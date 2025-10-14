import { Props, ComponentMode } from '@/app/lib/types';
import { CourseContent } from '@/app/lib/components';
import { getCourse } from '@/app/lib/database';
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
  const urlParams = await searchParams;

  const hideLogo = urlParams && urlParams.hideLogo == 'true';
  const mode = urlParams?.mode ?? "view";

  const course = await getCourse(slug);

  return (
    <div>
      <main>
        <CourseContent
          slug={slug}
          title={course.title}
          course={course}
          mode={mode as ComponentMode}
          apiKey={process.env.ONECOMPILER_API_KEY ?? ''}
          hideLogo={hideLogo}
        />
      </main>
    </div>
  );
}
