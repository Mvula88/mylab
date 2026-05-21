'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const mono = '"IBM Plex Mono", monospace';

export default function HeaderAuthMenu() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (mounted) setRole(profile?.role || 'learner');
      }
      setLoading(false);
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session) setRole(null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-[11px] uppercase py-2 px-3 active:scale-95"
        style={{
          fontFamily: mono,
          letterSpacing: '0.22em',
          border: '1px solid rgba(26,31,46,0.35)',
        }}
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {role === 'admin' && (
        <Link
          href="/admin"
          className="text-[11px] uppercase opacity-75 hover:opacity-100 transition"
          style={{ fontFamily: mono, letterSpacing: '0.18em' }}
        >
          Admin
        </Link>
      )}
      <Link
        href="/me"
        className="text-[11px] uppercase py-2 px-3 active:scale-95"
        style={{
          fontFamily: mono,
          letterSpacing: '0.22em',
          backgroundColor: '#1a1f2e',
          color: '#e8e4d8',
          fontWeight: 500,
        }}
      >
        My Practikal
      </Link>
    </div>
  );
}
