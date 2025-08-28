import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: 'system',
        content: `
You are a helpful contract-writing assistant. 
When given a vague or informal client request, your task is to create a professional **Service Agreement** in markdown format.

Structure it in exactly 3 sections:
1. **Deliverables** – Use clear bullet points based on the user's request. Include assumptions if details are vague.
2. **Payment Terms** – Include total fee (estimate if needed), milestones, method, and a late fee policy.
3. **Timeline** – Mention kickoff, delivery time, and revision turnaround.

Return markdown only. Use headings (##, ###), bold for important text, and clean formatting. Do not include disclaimers or explanations — just the contract content.`,
      },
      {
        role: 'user',
        content: prompt, // user's informal request
      },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const contract = data.choices?.[0]?.message?.content;
    return NextResponse.json({ contract });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
