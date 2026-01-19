import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { getLLMResponse } from "@koko420/ai-tools";
import { retry } from "@koko420/shared";

const requestSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
});

const SYSTEM_MESSAGE = `You are a text formatter for an Italian cosmetics e-commerce. Your task is ONLY to format text, NOT to change its meaning or content.

Rules:
1. Fix obvious grammar/spelling mistakes in Italian
2. For TITLE:
   - Format the title letters' casings to be "product name/title"-esque 
   - Format dosages/amounts correctly: "30ml." (no space between number and unit, with abbreviation dot)
   - Examples: "30 ml" → "30ml.", "100ML" → "100ml.", "50ml" → "50ml."
   - Do NOT change the product name itself
3. For DESCRIPTION:
   - Add HTML tags to make it readable and visually appealing, where sensible.
   - Use <br/> for paragraph breaks
   - Use <strong> for emphasis on key benefits or product names
   - Use <em> for subtle emphasis
   - Use <ul><li>...</li></ul> for lists if applicable
   - Keep the exact same content and meaning
   - Do NOT add new information

Return ONLY JSON in this exact shape:
{ "result": { "title": "...", "description": "..." } }

Language: Italian`;

const resultSchema = z.object({
  result: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export async function POST(req: Request) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description } = requestSchema.parse(body);

    const userMessage = `Title: ${title}
Description: ${description || "No description"}`;

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
      title: response.result.title,
      description: response.result.description,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.message },
        { status: 400 }
      );
    }
    console.error("AI format error:", error);
    return NextResponse.json(
      { error: "Failed to format with AI" },
      { status: 500 }
    );
  }
}

