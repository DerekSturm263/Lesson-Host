import { Props, ComponentMode } from '@/app/lib/types';
import { CourseDescription, Header } from '@/app/lib/components';
import { getCourse } from '@/app/lib/database';
import { Metadata, ResolvingMetadata } from 'next';

import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';

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
  const hideHeader = !urlParams || urlParams.hideHeader == 'true';
  const mode = urlParams?.mode ?? "view";

  const course = await getCourse(slug);

  const urlParamAppend = urlParams ? "?" + Object.entries(urlParams).map(value => `${value[0]}=${value[1]}`).join('&') : "";

  return (
    <div>
      <main>
        <Header
          title={course.title}
          mode={mode as ComponentMode}
          type=""
          progress={0}
        />
        <Toolbar />

        <Stack
          spacing={2}
        >
          <CourseDescription
            course={course}
            mode={mode as ComponentMode}
          />
        </Stack>
      </main>
    </div>
  );
}
