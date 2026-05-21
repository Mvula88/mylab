'use client';

import dynamic from 'next/dynamic';

const FoodTestsLabR3F = dynamic(() => import('@/components/FoodTestsLabR3F'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-100">
      <div className="text-stone-500 text-sm">Loading lab…</div>
    </div>
  ),
});

export default function FoodTestsR3FPage() {
  return <FoodTestsLabR3F />;
}
