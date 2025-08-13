'use client'

import { useParams } from 'next/navigation';
import sql from '../../../lib/sql';
import { Header } from '../../../lib/components';

export default function Page() {
  const params = useParams();
  const skillTitle: string = params.slug?.toString() ?? '';

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Header title={skillTitle + " - Implement"} doBackButton={true} doLanguageSwitcher={false} />
      </main>
    </div>
  );
}
