import { NextRequest, NextResponse } from 'next/server';

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
- **Liability Limitation:** Service Provider’s liability is capped at fees paid under this Agreement
- **Portfolio Rights:** Service Provider may display completed work in their portfolio unless Client objects in writing
- **Governing Law:** [Applicable law and jurisdiction]

## Signatures
- **Client Signature:** [Client Name]
- **Service Provider Signature:** [Service Provider Name]
- **Date:** [Date]

IMPORTANT: Do not output anything outside the markdown contract (no explanations, no notes). Use ONLY #, ##, -, and ** for formatting.`;

// Function to post-process and fix markdown formatting
function fixMarkdownFormatting(content: string): string {
  let fixed = content.trim();

  // Ensure it starts with a main title
  if (!fixed.startsWith('# ')) {
    // Try to find the first line that could be a title
    const lines = fixed.split('\n');
    const firstNonEmptyLine = lines.find((line) => line.trim().length > 0);
    if (firstNonEmptyLine && !firstNonEmptyLine.startsWith('#')) {
      // Add a main title
      fixed = `# ${firstNonEmptyLine.trim()}\n\n${fixed}`;
    }
  }

  // Fix section headers - look for common patterns and convert to markdown
  const headerPatterns = [
    { pattern: /^([A-Z][A-Za-z\s]+)$/gm, replacement: '## $1', name: 'Capitalized lines' },
    { pattern: /^📄\s*(.+)$/gm, replacement: '# $1', name: 'Emoji titles' },
    { pattern: /^([A-Z][A-Za-z\s]+):$/gm, replacement: '## $1', name: 'Colon headers' },
  ];

  headerPatterns.forEach(({ pattern, replacement }) => {
    fixed = fixed.replace(pattern, replacement);
  });

  // Ensure proper spacing around headers
  fixed = fixed.replace(/(^|\n)(#{1,2}\s+[^\n]+)(\n|$)/g, '\n$2\n');

  // Fix bullet points
  const bulletFixes = [
    { pattern: /^•\s*/gm, replacement: '- ' },
    { pattern: /^-\s*•\s*/gm, replacement: '- ' },
  ];

  bulletFixes.forEach(({ pattern, replacement }) => {
    fixed = fixed.replace(pattern, replacement);
  });

  return fixed;
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
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
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

    const contract = fixMarkdownFormatting(content);

    return NextResponse.json({ contract });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
