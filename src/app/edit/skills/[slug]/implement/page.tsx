'use client'

import { Props } from '@/app/lib/types';
import { Header } from '../../../../lib/components';
import { getSkill } from '../../../../lib/database';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkill(slug);

  return {
    title: `Edit Implement ${skill.title} | MySkillStudy.com`,
    description: 'Learn anything by practicing skills and creating projects.',
  }
}

export default async function Page({ params, searchParams }: Props) {
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
