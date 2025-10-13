import { Props, ComponentMode } from '@/app/lib/types';
import { Header, ProjectDescription } from '@/app/lib/components';
import { getProject } from '@/app/lib/database';
import { Metadata, ResolvingMetadata } from 'next';

import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';

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
        <Header
          title={project.title}
          mode={mode as ComponentMode}
          type=""
          progress={0}
          hideLogo={hideLogo}
        />
        <Toolbar />
        
        <Stack
          spacing={2}
        >
          <ProjectDescription
            project={project}
            mode={mode as ComponentMode}
          />
        </Stack>
      </main>
    </div>
  );
}
