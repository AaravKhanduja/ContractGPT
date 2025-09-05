import { NextResponse } from 'next/server';
import { getAIConfig } from '@/utils/ai-config';

export async function GET() {
  try {
    const config = getAIConfig();

    return NextResponse.json({
      provider: config.provider,
      model: config.model,
      environment: process.env.NODE_ENV,
      endpoint: config.endpoint,
    });
  } catch {
    return NextResponse.json(
      {
        provider: 'unknown',
        error: 'Failed to get AI configuration',
      },
      { status: 500 }
    );
  }
}
