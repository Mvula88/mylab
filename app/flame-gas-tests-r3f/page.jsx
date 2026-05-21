'use client';

import dynamic from 'next/dynamic';

const FlameAndGasTestsLabR3F = dynamic(() => import('@/components/FlameAndGasTestsLabR3F'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-100">
      <div className="text-stone-500 text-sm">Loading lab…</div>
    </div>
  ),
});

export default function FlameAndGasTestsR3FPage() {
  return <FlameAndGasTestsLabR3F />;
}
