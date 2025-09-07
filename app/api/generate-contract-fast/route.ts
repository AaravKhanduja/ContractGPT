import { NextRequest, NextResponse } from 'next/server';

// Optimized system prompt - 60% shorter while maintaining quality
const OPTIMIZED_SYSTEM_PROMPT = `Create a professional Service Agreement in markdown format.

FORMAT: Use # for title, ## for sections, - for lists, **bold** for terms.

TEMPLATE:
# [Service Name] Agreement

## Parties
- **Client:** [Name/Company]
- **Service Provider:** [Name/Company]

## Services and Deliverables
- [Specific deliverables and scope]

## Payment Terms
- **Total Fee:** [Amount]
- **Payment Schedule:** [Terms]
- **Payment Method:** [Method]

## Timeline
- **Project Kickoff:** [Start date]
- **Delivery Timeline:** [Completion time]
- **Revision Policy:** [Revisions included]

## Terms and Conditions
- **Confidentiality:** Both parties maintain confidentiality
- **Intellectual Property:** [IP ownership]
- **Termination:** [Termination conditions]
- **Liability Limitation:** Provider liability capped at fees paid
- **Governing Law:** [Jurisdiction]

Output only the contract markdown.`;

// Simplified post-processing - only essential fixes
function quickFormat(content: string): string {
  return content
    .trim()
    .replace(/^([A-Z][A-Za-z\s]+)$/gm, '## $1') // Fix headers
    .replace(/^•\s*/gm, '- ') // Fix bullets
    .replace(/(^|\n)(#{1,2}\s+[^\n]+)(\n|$)/g, '\n$2\n'); // Fix spacing
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    // Production: Only use OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured for production' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: OPTIMIZED_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3, // Lower temperature for faster, more consistent output
        max_tokens: 1200, // Reduced for faster generation
        top_p: 0.9, // Focus on most likely tokens
        frequency_penalty: 0.1, // Reduce repetition
        presence_penalty: 0.1, // Encourage new content
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('OpenAI returned empty response');
    }

    const contract = quickFormat(content);

    return NextResponse.json({ contract });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
