import { Props, ComponentMode } from '@/app/lib/types';
import { Header, LearnPageContent } from '@/app/lib/components';
import { getSkill } from '@/app/lib/database';
import { Metadata, ResolvingMetadata } from 'next';

/*export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkill(slug);

  return {
    title: `Learn ${skill.title} | MySkillStudy.com`,
    description: 'Learn anything by practicing skills and creating projects.',
  }
}*/

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;

  const urlParams = await searchParams;
  const hideHeader = !urlParams || urlParams.hideHeader == 'true';
  const mode = urlParams?.mode ?? "view";

  const skill = await getSkill(slug);

  const page = (
    <div>
      <main>
        <Header title={skill.title} mode={mode as ComponentMode} type="Learn" />

        <LearnPageContent
          slug={slug}
          skill={skill}
          mode={mode as ComponentMode}
          apiKey={process.env.ONECOMPILER_API_KEY ?? ''}
        />
      </main>
    </div>
  );

  return page;
}
