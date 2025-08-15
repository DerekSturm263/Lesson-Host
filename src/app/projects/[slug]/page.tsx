'use client'

import { useParams } from 'next/navigation';
import { Header } from '../../lib/components';
import { getProject } from '../../lib/files';

export default function Page() {
  const params = useParams();
  const project = getProject(params.slug?.toString() ?? '');

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{project.title}</h1>
      </main>
    </div>
  );
}
