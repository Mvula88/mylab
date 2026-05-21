'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <div className="max-w-md">
        <h2 className="text-xl font-bold text-stone-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-stone-600 mb-4">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        {error?.stack && (
          <pre className="text-xs text-stone-500 bg-stone-100 p-3 rounded overflow-auto max-h-48 mb-4">
            {error.stack}
          </pre>
        )}
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
