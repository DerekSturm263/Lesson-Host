import { Props, ComponentMode } from '@/app/lib/types';
import { Header } from '@/app/lib/components';
import { getSkill } from '@/app/lib/database';
import { Metadata, ResolvingMetadata } from 'next';

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
        <Header
          title={skill.title}
          mode={mode as ComponentMode}
          type="Practice"
          progress={1}
          hideLogo={hideLogo}
        />
      </main>
    </div>
  );
}
