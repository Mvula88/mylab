'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 24,
          background: '#fafaf9',
        }}>
          <div style={{ maxWidth: 480, textAlign: 'left' }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#1c1917' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#57534e', fontSize: 14, marginBottom: 16 }}>
              {error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '10px 16px',
                background: '#1c1917',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
