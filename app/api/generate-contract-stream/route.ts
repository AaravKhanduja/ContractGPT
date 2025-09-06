import { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `You are a professional contract-writing assistant. 
When given a client request, create a comprehensive Service Agreement in markdown format.

CRITICAL FORMATTING REQUIREMENTS:
1. Start with a single # for the main title
2. Use ## for all section headers
3. Use bullet points (-) for lists
4. Use **bold** for important terms

EXACT MARKDOWN FORMAT REQUIRED:

# [Service Name] Agreement

## Parties
- **Client:** [Client Name/Company]
- **Service Provider:** [Service Provider Name/Company]

## Services and Deliverables
- [List specific deliverables based on the request]
- [Include scope of work]
- [If details are vague, state explicit assumptions (e.g., page counts, number of revisions) to avoid scope creep]

## Payment Terms
- **Total Fee:** [Amount]
- **Payment Schedule:** [Milestones or payment terms]
- **Payment Method:** [How payment will be made]
- **Late Payment Policy:** [Late fee policy]

## Timeline
- **Project Kickoff:** [Start date or conditions]
- **Delivery Timeline:** [Expected completion time]
- **Revision Policy:** [Number of revisions included, turnaround time, and how extra revisions are billed]
- **Acceptance Criteria:** [How completion is defined and when deliverables are deemed accepted]
- **Post-Launch Support:** [What, if any, maintenance or bug-fixing period is included]

## Terms and Conditions
- **Confidentiality:** Both parties agree to maintain confidentiality
- **Intellectual Property:** [IP ownership terms]
- **Termination:** [Termination conditions]
- **Liability Limitation:** Service Provider's liability is capped at fees paid under this Agreement
- **Portfolio Rights:** Service Provider may display completed work in their portfolio unless Client objects in writing
- **Governing Law:** [Applicable law and jurisdiction]

IMPORTANT: Do not output anything outside the markdown contract (no explanations, no notes). Use ONLY #, ##, -, and ** for formatting.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required and must be a non-empty string.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Production: Only use OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4';

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured for production' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
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
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
      );
    }

    // Create a readable stream
    const stream = new ReadableStream({
      start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = '';

        function pump(): Promise<void> {
          return reader!.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }

            // Decode the chunk
            const chunk = new TextDecoder().decode(value);
            buffer += chunk;

            // Process complete lines
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`)
                    );
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }

            return pump();
          });
        }

        return pump();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
