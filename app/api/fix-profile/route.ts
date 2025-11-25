import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const supabase = createAdminClient();

    // Get user by email
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) throw userError;

    const user = users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return NextResponse.json({ message: 'Profile already exists' });
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'User',
        role: user.user_metadata?.role || 'referrer',
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return NextResponse.json({ message: 'Profile created', profile });
  } catch (error) {
    console.error('Fix profile error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fix profile' },
      { status: 500 }
    );
  }
}
