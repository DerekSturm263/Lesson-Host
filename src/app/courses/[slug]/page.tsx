'use client'

import { Header } from '../../lib/components';
import { getCourse } from '../../lib/files';

export default async function Page({ params }: { params: { slug: string | undefined } }) {
  const course = await getCourse(params.slug?.toString() ?? '');

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{course.title}</h1>
      </main>
    </div>
  );
}
