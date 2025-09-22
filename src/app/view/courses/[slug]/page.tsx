import { Props } from '@/app/lib/types';
import { Header } from '../../../lib/components';
import { getCourse } from '../../../lib/database';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);

  return {
    title: `${course.title} | MySkillStudy.com`,
    description: 'Learn anything by practicing skills and creating projects.',
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const course = await getCourse(slug);

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{course.title}</h1>
      </main>
    </div>
  );
}
