'use client';

import dynamic from 'next/dynamic';

const ElectrolysisLabR3F = dynamic(() => import('@/components/ElectrolysisLabR3F'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-100">
      <div className="text-stone-500 text-sm">Loading lab…</div>
    </div>
  ),
});

export default function ElectrolysisR3FPage() {
  return <ElectrolysisLabR3F />;
}
