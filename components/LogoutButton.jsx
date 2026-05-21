'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const mono = '"IBM Plex Mono", monospace';

export default function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }
  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 text-[11px] uppercase py-2 px-3 active:scale-95"
      style={{
        fontFamily: mono,
        letterSpacing: '0.22em',
        border: '1px solid rgba(26,31,46,0.35)',
      }}
    >
      <LogOut size={12} /> Sign out
    </button>
  );
}
