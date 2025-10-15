import { Props } from '@/app/lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default async function Page({ params, searchParams }: Props) {
  return (
    <div>
      <main>
      </main>
    </div>
  );
}
