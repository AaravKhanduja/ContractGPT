import { NextRequest, NextResponse } from 'next/server';

// Pre-built instant templates for common services
const INSTANT_TEMPLATES = {
  website: `# Website Development Agreement

## Parties
- **Client:** [CLIENT_NAME]
- **Service Provider:** [PROVIDER_NAME]

## Services and Deliverables
- Custom website design and development
- Responsive design for mobile and desktop
- Content management system integration
- SEO optimization
- Basic maintenance for 30 days post-launch

## Payment Terms
- **Total Fee:** [AMOUNT]
- **Payment Schedule:** 50% upfront, 50% on completion
- **Payment Method:** Bank transfer or PayPal
- **Late Payment Policy:** 1.5% monthly interest on overdue amounts

## Timeline
- **Project Kickoff:** [START_DATE]
- **Delivery Timeline:** [TIMELINE] weeks
- **Revision Policy:** 3 revisions included, additional revisions at $75/hour
- **Acceptance Criteria:** Deliverables deemed accepted 5 business days after delivery

## Terms and Conditions
- **Confidentiality:** Both parties agree to maintain confidentiality
- **Intellectual Property:** Client owns final website, Provider retains portfolio rights
- **Termination:** Either party may terminate with 7 days written notice
- **Liability Limitation:** Provider's liability capped at fees paid
- **Governing Law:** [JURISDICTION]`,

  logo: `# Logo Design Agreement

## Parties
- **Client:** [CLIENT_NAME]
- **Service Provider:** [PROVIDER_NAME]

## Services and Deliverables
- Logo design concepts (3 initial options)
- Final logo in multiple formats (PNG, SVG, PDF)
- Logo usage guidelines document
- Source files delivery

## Payment Terms
- **Total Fee:** [AMOUNT]
- **Payment Schedule:** 50% upfront, 50% on final approval
- **Payment Method:** Bank transfer or PayPal
- **Late Payment Policy:** 1.5% monthly interest on overdue amounts

## Timeline
- **Project Kickoff:** [START_DATE]
- **Delivery Timeline:** [TIMELINE] business days
- **Revision Policy:** 2 rounds of revisions included, additional revisions at $50/hour
- **Acceptance Criteria:** Logo deemed accepted upon final approval

## Terms and Conditions
- **Confidentiality:** Both parties agree to maintain confidentiality
- **Intellectual Property:** Client owns final logo, Provider retains portfolio rights
- **Termination:** Either party may terminate with 3 days written notice
- **Liability Limitation:** Provider's liability capped at fees paid
- **Governing Law:** [JURISDICTION]`,

  consulting: `# Consulting Services Agreement

## Parties
- **Client:** [CLIENT_NAME]
- **Service Provider:** [PROVIDER_NAME]

## Services and Deliverables
- [CONSULTING_SERVICE] consulting services
- Strategic recommendations and analysis
- Implementation guidance
- Follow-up support for 30 days

## Payment Terms
- **Total Fee:** [AMOUNT]
- **Payment Schedule:** [PAYMENT_TERMS]
- **Payment Method:** Bank transfer or PayPal
- **Late Payment Policy:** 1.5% monthly interest on overdue amounts

## Timeline
- **Project Kickoff:** [START_DATE]
- **Delivery Timeline:** [TIMELINE] weeks
- **Revision Policy:** 1 revision included, additional revisions at $[HOURLY_RATE]/hour
- **Acceptance Criteria:** Deliverables deemed accepted 3 business days after delivery

## Terms and Conditions
- **Confidentiality:** Both parties agree to maintain confidentiality
- **Intellectual Property:** Client owns recommendations, Provider retains methodology rights
- **Termination:** Either party may terminate with 5 days written notice
- **Liability Limitation:** Provider's liability capped at fees paid
- **Governing Law:** [JURISDICTION]`,
};

// Function to detect service type from prompt
function detectServiceType(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  if (
    lowerPrompt.includes('website') ||
    lowerPrompt.includes('web') ||
    lowerPrompt.includes('site')
  ) {
    return 'website';
  } else if (
    lowerPrompt.includes('logo') ||
    lowerPrompt.includes('brand') ||
    lowerPrompt.includes('design')
  ) {
    return 'logo';
  } else if (
    lowerPrompt.includes('consult') ||
    lowerPrompt.includes('advice') ||
    lowerPrompt.includes('strategy')
  ) {
    return 'consulting';
  }

  return 'website'; // Default fallback
}

// Function to extract key details from prompt
function extractDetails(prompt: string): Record<string, string> {
  const details: Record<string, string> = {};

  // Extract amounts (look for $X, X dollars, etc.)
  const amountMatch = prompt.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|USD)?/i);
  if (amountMatch) {
    details.AMOUNT = `$${amountMatch[1]}`;
  }

  // Extract timeline (look for weeks, days, months)
  const timelineMatch = prompt.match(/(\d+)\s*(weeks?|days?|months?)/i);
  if (timelineMatch) {
    details.TIMELINE = timelineMatch[0];
  }

  // Extract client name (look for "I am", "my company", etc.)
  const clientMatch = prompt.match(/(?:i am|my name is|my company is|i'm)\s+([^,.\n]+)/i);
  if (clientMatch) {
    details.CLIENT_NAME = clientMatch[1].trim();
  }

  return details;
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

    // Detect service type and extract details
    const serviceType = detectServiceType(prompt);
    const details = extractDetails(prompt);

    // Get the appropriate template
    let contract =
      INSTANT_TEMPLATES[serviceType as keyof typeof INSTANT_TEMPLATES] || INSTANT_TEMPLATES.website;

    // Replace placeholders with extracted details
    Object.entries(details).forEach(([key, value]) => {
      contract = contract.replace(`[${key}]`, value);
    });

    // Replace remaining placeholders with generic values
    contract = contract
      .replace(/\[CLIENT_NAME\]/g, details.CLIENT_NAME || '[Client Name]')
      .replace(/\[PROVIDER_NAME\]/g, '[Your Company Name]')
      .replace(/\[AMOUNT\]/g, details.AMOUNT || '[Amount]')
      .replace(/\[TIMELINE\]/g, details.TIMELINE || '[Timeline]')
      .replace(/\[START_DATE\]/g, '[Start Date]')
      .replace(/\[JURISDICTION\]/g, '[Your State/Country]')
      .replace(/\[CONSULTING_SERVICE\]/g, '[Service Type]')
      .replace(/\[PAYMENT_TERMS\]/g, '[Payment Terms]')
      .replace(/\[HOURLY_RATE\]/g, '[Hourly Rate]');

    return NextResponse.json({ contract });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
