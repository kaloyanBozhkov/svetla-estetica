import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { getLLMResponse } from "@koko420/ai-tools";
import { retry } from "@koko420/shared";

const requestSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
});

const SYSTEM_MESSAGE = `<about>You're a professional beautician running an aesthetics center offering beauty treatments and services.</about> 
<instructions>
You receive a treatment/service title and its description.
You must return: 
- the treatment title, as professionally formatted service name. Should be clear, elegant and appealing.
- the treatment description, formatted with html tags to look nicely presentable. 
</instructions>

<important>
- Based on the treatment title and description, enrich the description where sensible. 
- Ideal description should be informative for clients: what the treatment does, benefits, who it's ideal for, what to expect during the session.
- Maximum 5 paragraphs, not too long please.. but also needs to make the client want to book the treatment!
- When writing new paragraphs, add a break (<br> tag) between paragraphs. Also reminder you can use <b> <i> as well as lists if you need.
</important>

<response_format>
- Return only JSON of this shape: { 
    title: "", // title, professional formatting
    description: "",  // html tags formatting content beautifully
}
- Reminder to return only the valid JSON object, nothing else.
</response_format>

<language>
Keep the response language as italian
</language>
`;

const resultSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export async function POST(req: Request) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description } = requestSchema.parse(body);

    const userMessage = `Treatment Title: ${title}
Description: ${description || "No description provided"}`;

    const response = await retry(
      () =>
        getLLMResponse({
          userMessage,
          systemMessage: SYSTEM_MESSAGE,
          schema: resultSchema,
        }),
      3
    );

    return NextResponse.json({
      title: response.title,
      description: response.description,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.message },
        { status: 400 }
      );
    }
    console.error("AI reword error:", error);
    return NextResponse.json(
      { error: "Failed to reword with AI" },
      { status: 500 }
    );
  }
}

