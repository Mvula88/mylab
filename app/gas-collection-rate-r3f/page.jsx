'use client';

import dynamic from 'next/dynamic';

const GasCollectionRateLabR3F = dynamic(() => import('@/components/GasCollectionRateLabR3F'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-100">
      <div className="text-stone-500 text-sm">Loading lab…</div>
    </div>
  ),
});

export default function GasCollectionRateR3FPage() {
  return <GasCollectionRateLabR3F />;
}
