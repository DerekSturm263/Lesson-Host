'use client'

import { useParams } from 'next/navigation';
import { Header } from '../../lib/components';

export default function Page() {
  const params = useParams();
  const courseTitle: string = params.slug?.toString() ?? '';

  return (
    <div>
      <main>
        <Header title={courseTitle} doBackButton={false} doLanguageSwitcher={false} />
      </main>
    </div>
  );
}
