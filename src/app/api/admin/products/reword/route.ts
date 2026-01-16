import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { getLLMResponse } from "@koko420/ai-tools";
import { retry } from "@koko420/shared";

const requestSchema = z.object({
  title: z.string().min(1),
  brand: z.string().min(1),
  description: z.string(),
});

const SYSTEM_MESSAGE = `You're a professional beautician and cosmetics product manufacturer and seller. 
You receive a product title, its brand and description 
You must return: 
- the product title, stripped from volume amounts and weird characters (e.g 30ml, 100ml) -> should be professional looking product name. 
- volume amount (if any mentioned in title or description)
- the product description, formatted with html tags to look nicely presentable. 

Important: based on product title, description & brand, enrich the description where sensible. Ideal description should be informative for clients, when and why to use it, can maybe include "how to use/apply" if it fits the product and you know about it, and any other important info. Maximum 5 paragraphs, not too long please.. but also needs to sell the product well (indirectly)! 

Language: italian`;

const resultSchema = z.object({
  result: z.object({
    title: z.string(),
    description: z.string(),
    amount: z.string(),
  }),
});

export async function POST(req: Request) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, brand, description } = requestSchema.parse(body);

    const userMessage = `Product Title: ${title}
Brand: ${brand}
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
      title: response.result.title,
      description: response.result.description,
      amount: response.result.amount,
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

