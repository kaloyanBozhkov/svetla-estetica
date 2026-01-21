import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdmin } from '@/lib/auth';
import { getLLMResponse } from '@koko420/ai-tools';
import { retry } from '@koko420/shared';

const requestSchema = z.object({
  title: z.string().min(1),
  brand: z.string().min(1),
  description: z.string(),
});

const SYSTEM_MESSAGE = `<about>You're a professional beautician and cosmetics product manufacturer and seller.</about> 
<instructions>
You receive a product title, its brand and description 
You must return: 
- the product title, as professionaly formatted product name. Any volume amounts and weird characters (e.g 30ml, 100ml) -> should be properly and consistnetly formatted (e.g. 30ml. -> is good, 30 ml or 30ml is not good (first has space between the unit and numebr latter has missing . for abbreviaton))
- the product description, formatted with html tags to look nicely presentable. 
</instructions>

<important>
- based on product title, description & brand, enrich the description where sensible. 
- Ideal description should be informative for clients, when and why to use it, can maybe include "how to use/apply" if it fits the product and you know about it, and any other important info. Maximum 5 paragraphs, not too long please.. but also needs to sell the product well (indirectly)! 
- When writing new paragraphs, add a break (<br> tag) between paragraphs. Also reminder you can use <b> <i> as well as lists if you need.
- If formatting the title to be more professional, any extra information removed from the original title likely should be mentioned in the description.
</important>

<response_format>
- Return only JSON of this shape: { 
    title: "", // title, professional formatting
    descritpion: "",  // html tags formatting content sof this beautifully
}
- Reminder to return only the valid JSON object, nothing else.
</response_format>

<language>
Keep the response language as italian
</language>

<important>
Keep the description as conscise as possible, but still informative and selling the product well. Assume the reader wants to read as little as possible.
</important>
`;

const resultSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export async function POST(req: Request) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, brand, description } = requestSchema.parse(body);

    const userMessage = `Product Title: ${title}
Brand: ${brand}
Description: ${description || 'No description provided'}`;

    console.log('userMessage', userMessage);
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
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      );
    }
    console.error('AI reword error:', error);
    return NextResponse.json({ error: 'Failed to reword with AI' }, { status: 500 });
  }
}
