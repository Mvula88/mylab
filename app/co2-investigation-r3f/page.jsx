'use client';

import dynamic from 'next/dynamic';

const CO2InvestigationLabR3F = dynamic(() => import('@/components/CO2InvestigationLabR3F'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-100">
      <div className="text-stone-500 text-sm">Loading lab…</div>
    </div>
  ),
});

export default function CO2InvestigationR3FPage() {
  return <CO2InvestigationLabR3F />;
}
