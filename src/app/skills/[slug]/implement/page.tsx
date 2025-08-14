'use client'

import { useParams } from 'next/navigation';
import { Header } from '../../../lib/components';

export default function Page() {
  const params = useParams();
  const skillTitle: string = params.slug?.toString() ?? '';

  return (
    <div>
      <main>
        <Header title={skillTitle + " - Implement"} doBackButton={true} doLanguageSwitcher={false} />
      </main>
    </div>
  );
}
