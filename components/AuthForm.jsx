'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

export default function AuthForm({ mode = 'login' }) {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/me';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setInfo('Check your email to confirm your account, then log in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const isSignup = mode === 'signup';

  return (
    <div>
      <div
        className="text-[11px] uppercase text-stone-500 mb-4"
        style={{ fontFamily: mono, letterSpacing: '0.28em' }}
      >
        {isSignup ? 'Create your learner account' : 'Welcome back'}
      </div>
      <h1
        className="text-3xl sm:text-4xl leading-[1.1] mb-7"
        style={{ fontFamily: serif, fontWeight: 500 }}
      >
        {isSignup ? (
          <>Start <span style={{ color: '#c2185b', fontStyle: 'italic' }}>learning</span>.</>
        ) : (
          <>Sign in to <span style={{ color: '#c2185b', fontStyle: 'italic' }}>Practikal</span>.</>
        )}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <Field
            label="Full name"
            value={fullName}
            onChange={setFullName}
            type="text"
            required
            autoComplete="name"
          />
        )}
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          required
          autoComplete="email"
        />
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          required
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          minLength={6}
        />

        {error && (
          <div
            className="text-xs px-3 py-2 border"
            style={{
              borderColor: 'rgba(194,24,91,0.4)',
              backgroundColor: 'rgba(194,24,91,0.06)',
              color: '#c2185b',
              fontFamily: mono,
            }}
          >
            {error}
          </div>
        )}
        {info && (
          <div
            className="text-xs px-3 py-2 border"
            style={{
              borderColor: 'rgba(46,125,50,0.4)',
              backgroundColor: 'rgba(46,125,50,0.06)',
              color: '#2e7d32',
              fontFamily: mono,
            }}
          >
            {info}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 text-[12px] uppercase active:scale-95 disabled:opacity-50"
          style={{
            fontFamily: mono,
            letterSpacing: '0.25em',
            backgroundColor: '#1a1f2e',
            color: '#e8e4d8',
            fontWeight: 500,
          }}
        >
          {loading ? 'Working…' : isSignup ? 'Create account' : 'Sign in'}{' '}
          {!loading && <ArrowRight size={14} />}
        </button>
      </form>

      <div className="mt-6 text-xs opacity-75" style={{ fontFamily: mono }}>
        {isSignup ? (
          <>
            Already have an account?{' '}
            <Link href="/login" className="underline">Sign in</Link>
          </>
        ) : (
          <>
            New here?{' '}
            <Link href="/signup" className="underline">Create an account</Link>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type, required, autoComplete, minLength }) {
  return (
    <label className="block">
      <span
        className="block text-[10px] uppercase mb-1.5 opacity-65"
        style={{ fontFamily: mono, letterSpacing: '0.22em' }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        minLength={minLength}
        className="w-full px-3 py-2.5 bg-transparent text-sm outline-none focus:ring-0"
        style={{
          fontFamily: serif,
          border: '1px solid rgba(26,31,46,0.25)',
        }}
      />
    </label>
  );
}
