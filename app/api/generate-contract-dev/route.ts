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
- [Add any assumptions if details are vague]

## Payment Terms
- **Total Fee:** [Amount]
- **Payment Schedule:** [Milestones or payment terms]
- **Payment Method:** [How payment will be made]
- **Late Payment Policy:** [Late fee policy]

## Timeline
- **Project Kickoff:** [Start date or conditions]
- **Delivery Timeline:** [Expected completion time]
- **Revision Policy:** [Revision turnaround and limits]

## Terms and Conditions
- **Confidentiality:** Both parties agree to maintain confidentiality
- **Intellectual Property:** [IP ownership terms]
- **Termination:** [Termination conditions]
- **Governing Law:** [Applicable law and jurisdiction]

## Signatures
- **Client Signature:** [Client Name]
- **Service Provider Signature:** [Service Provider Name]
- **Date:** [Date]

DO NOT use emojis, special characters, or any formatting other than markdown. Use ONLY #, ##, -, and ** for formatting.`;

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

    // Development: Only use Ollama
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3.2:3b';

    try {
      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: `${SYSTEM_PROMPT}\n\nUser request: ${prompt}\n\nContract:`,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 2000,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.response?.trim();

      if (!content) {
        throw new Error('Ollama returned empty response');
      }

      const contract = fixMarkdownFormatting(content);

      return NextResponse.json({ contract });
    } catch (error) {
      throw error;
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
