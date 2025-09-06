import { NextRequest, NextResponse } from 'next/server';

// Pre-built contract template with placeholders
const CONTRACT_TEMPLATE = `# [SERVICE_NAME] Agreement

## Parties
- **Client:** [CLIENT_NAME]
- **Service Provider:** [PROVIDER_NAME]

## Services and Deliverables
- [SERVICE_DESCRIPTION]
- [DELIVERABLES_LIST]
- [SCOPE_DETAILS]

## Payment Terms
- **Total Fee:** [TOTAL_AMOUNT]
- **Payment Schedule:** [PAYMENT_TERMS]
- **Payment Method:** [PAYMENT_METHOD]
- **Late Payment Policy:** 1.5% monthly interest on overdue amounts

## Timeline
- **Project Kickoff:** [START_DATE]
- **Delivery Timeline:** [COMPLETION_TIME]
- **Revision Policy:** [REVISION_COUNT] revisions included, additional revisions at $[REVISION_RATE]/hour
- **Acceptance Criteria:** Deliverables deemed accepted 5 business days after delivery unless written objections provided

## Terms and Conditions
- **Confidentiality:** Both parties agree to maintain confidentiality of all project information
- **Intellectual Property:** [IP_OWNERSHIP_TERMS]
- **Termination:** Either party may terminate with [NOTICE_PERIOD] written notice
- **Liability Limitation:** Service Provider's liability is capped at fees paid under this Agreement
- **Portfolio Rights:** Service Provider may display completed work in their portfolio unless Client objects in writing
- **Governing Law:** [GOVERNING_LAW]`;

// AI prompt for filling template - much shorter and focused
const TEMPLATE_FILL_PROMPT = `Fill this contract template with specific details based on the user request. Replace bracketed placeholders with appropriate values. Keep the same markdown format.

Template:
${CONTRACT_TEMPLATE}

User Request: [USER_REQUEST]`;

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
          {
            role: 'system',
            content: TEMPLATE_FILL_PROMPT.replace('[USER_REQUEST]', prompt),
          },
        ],
        temperature: 0.5, // Lower temperature for more consistent template filling
        max_tokens: 1000, // Much shorter response needed
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

    return NextResponse.json({ contract: content });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
