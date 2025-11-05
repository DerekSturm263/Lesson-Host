import { Props, ComponentMode } from '@/app/lib/types';
import { SharableContent } from '@/app/lib/components';
import { getSkill } from '@/app/lib/database';
import { Metadata, ResolvingMetadata } from 'next';

import Button from '@mui/material/Button';

import School from '@mui/icons-material/School';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import Quiz from '@mui/icons-material/Quiz';

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkill(slug);

  return {
    title: `${skill.title} | MySkillStudy.com`,
    description: 'Learn anything by practicing skills and creating projects.',
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const hideLogo = urlParams && urlParams.hideLogo == 'true';
  const mode = urlParams?.mode ?? "view";

  const skill = await getSkill(slug);

  return (
    <div>
      <main>
        <SharableContent
          slug={slug}
          title={skill.title}
          sharable={skill}
          mode={mode as ComponentMode}
          apiKey={process.env.ONECOMPILER_API_KEY ?? ''}
          hideLogo={hideLogo}
        >
          <Button
            href={`./${slug}/learn?mode=${mode}&hideLogo=${hideLogo}`}
            variant="contained"
            startIcon={<School />}
            size="large"
          >
            Learn
          </Button>

          <Button
            href={`./${slug}/practice?mode=${mode}&hideLogo=${hideLogo}`}
            variant="contained"
            startIcon={<LocalLibrary />}
            size="large"
          >
            Practice
          </Button>

          <Button
            href={`./${slug}/quiz?mode=${mode}&hideLogo=${hideLogo}`}
            variant="contained"
            startIcon={<Quiz />}
            size="large"
          >
            Quiz
          </Button>
        </SharableContent>
      </main>
    </div>
  );
}
