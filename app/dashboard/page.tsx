import React, { Suspense } from 'react';
import PublicExamDisplay from '../../components/PublicExamDisplay';

export default function PublicExamPage({ searchParams }: { searchParams: { data?: string } }) {
  const encodedData = searchParams?.data || '';

  return (
    <div className="bg-slate-100 font-sans">
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Exam...</div>}>
        <PublicExamDisplay encodedData={encodedData} />
      </Suspense>
    </div>
  );
}