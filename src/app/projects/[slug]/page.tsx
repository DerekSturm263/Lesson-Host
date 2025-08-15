'use client'

import { useParams } from 'next/navigation';
import { Header } from '../../lib/components';

export default function Page() {
  const params = useParams();
  const projectTitle: string = params.slug?.toString() ?? '';

  return (
    <div>
      <main>
        <Header />
        <h1>{projectTitle}</h1>
      </main>
    </div>
  );
}
