'use client'

import { Header } from '../../../../lib/components';
import { getSkill } from '../../../../lib/database';

export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const skill = await getSkill(slug);

  return (
    <div>
      <main>
        <Header />
      </main>
    </div>
  );
}
