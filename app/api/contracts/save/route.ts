import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { title, content, prompt } = await req.json();

    if (!title || !content || !prompt) {
      return NextResponse.json(
        { error: 'Title, content, and prompt are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Insert the contract
    const { data: contract, error: insertError } = await supabase
      .from('contracts')
      .insert({
        user_id: user.id,
        title,
        type: 'Service Agreement',
        content,
        prompt,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'Failed to save contract' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      contract: {
        id: contract.id,
        title: contract.title,
        created_at: contract.created_at,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
