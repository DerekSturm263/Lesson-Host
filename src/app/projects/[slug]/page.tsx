import { Props, ComponentMode } from '@/app/lib/types';
import { SharableContent } from '@/app/lib/components';
import { getProject } from '@/app/lib/database';
import { Metadata, ResolvingMetadata } from 'next';

import Button from '@mui/material/Button';

import Launch from '@mui/icons-material/Launch';

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  return {
    title: `${project.title} | MySkillStudy.com`,
    description: 'Learn anything by practicing skills and creating projects.',
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const hideLogo = urlParams && urlParams.hideLogo == 'true';
  const mode = urlParams?.mode ?? "view";

  const project = await getProject(slug);

  return (
    <div>
      <main>
        <SharableContent
          slug={slug}
          title={project.title}
          sharable={project}
          mode={mode as ComponentMode}
          apiKey={process.env.ONECOMPILER_API_KEY ?? ''}
          hideLogo={hideLogo}
          type="projects"
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
