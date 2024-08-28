"use client"
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ErrorPage = dynamic(() => import('@/components/ErrorPage'), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorPage />
    </Suspense>
  );
}
