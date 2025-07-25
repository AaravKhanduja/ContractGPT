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
        content:
          'You are a helpful contract-writing assistant. When given a vague or informal client request, your task is to create a clear and professional freelance contract. Break the response into 3 clearly titled sections: 1. **Deliverables** – Describe exactly what the freelancer will provide, even if the original prompt is vague. Use bullet points where possible. 2. **Payment Terms** – Specify the total fee (you can estimate a fair range), payment milestones (e.g., upfront %, after delivery), and any conditions. Assume the freelancer is experienced and the client expects clarity. Write in a concise and formal tone. Do not include any disclaimers or apologies. Just return the 3 sections directly.',
      },
      {
        role: 'user',
        content: prompt,
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
    //console.log('OpenAI API response:', data);
    const contract = data.choices?.[0]?.message?.content;
    //console.log('Generated contract:', contract);
    return NextResponse.json({ contract });
  } catch (err) {
    //console.error('Error generating contract:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
