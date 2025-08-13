'use client'

import { useParams } from 'next/navigation';
import sql from '../../../lib/sql';

export default function Page() {
  const params = useParams();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-center sm:text-center">
          {params.slug} - Practice
        </h1>
      </main>
    </div>
  );
}
