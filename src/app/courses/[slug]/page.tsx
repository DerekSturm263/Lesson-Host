'use client'

import { useParams } from 'next/navigation';
import { Header } from '../../lib/components';
import { getCourse } from '../../lib/files';

export default function Page() {
  const params = useParams();
  const course = getCourse(params.slug?.toString() ?? '');

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{course.title}</h1>
      </main>
    </div>
  );
}
