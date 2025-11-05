import { Props, ComponentMode } from '@/app/lib/types';
import { SharableContent } from '@/app/lib/components';
import { getCourse } from '@/app/lib/database';
import { Metadata, ResolvingMetadata } from 'next';

import Button from '@mui/material/Button';

import Launch from '@mui/icons-material/Launch';

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
        <SharableContent
          slug={slug}
          title={course.title}
          sharable={course}
          mode={mode as ComponentMode}
          apiKey={process.env.ONECOMPILER_API_KEY ?? ''}
          hideLogo={hideLogo}
          type="courses"
        >
          <Button
            href={`./${slug}/open?mode=${mode}&hideLogo=${hideLogo}`}
            variant="contained"
            startIcon={<Launch />}
            size="large"
          >
            Open
          </Button>
        </SharableContent>
      </main>
    </div>
  );
}
