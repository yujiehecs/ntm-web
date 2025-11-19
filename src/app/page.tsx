import { Suspense } from 'react';
import Dashboard from '@/components/pages/Dashboard';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
