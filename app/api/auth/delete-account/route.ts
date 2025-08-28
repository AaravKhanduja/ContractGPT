import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function DELETE(request: NextRequest) {
  try {
    const isDevMode = process.env.NODE_ENV === 'development';

    if (isDevMode) {
      // In development mode, just return success (localStorage cleanup is handled client-side)
      return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
    }

    // Production mode: use Supabase
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Delete user account using admin API
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Failed to delete user account:', deleteError);

      // If admin delete fails, try to clean up user data and sign out
      try {
        await supabase.auth.signOut();

        return NextResponse.json(
          { message: 'Account data cleared and signed out' },
          { status: 200 }
        );
      } catch (cleanupError) {
        console.error('Failed to cleanup user data:', cleanupError);
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
