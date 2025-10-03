import { Props } from '@/app/lib/types';
import { ToastContainer } from 'react-toastify';
import { Header, LearnPageContent } from '../../../../lib/components';
import { getSkill } from '../../../../lib/database';
import * as types from '../../../../lib/types';
import { Metadata, ResolvingMetadata } from 'next';

/*export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkill(slug);

  return {
    title: `Learn ${skill.title} | MySkillStudy.com`,
    description: 'Learn anything by practicing skills and creating projects.',
  }
}*/

export default async function Page({ params, searchParams }: types.Props) {
  const { slug } = await params;

  const urlParams = await searchParams;
  const hideHeader = !urlParams || urlParams.hideHeader == 'true';
  const mode = urlParams?.mode ?? "view";

  const skill = await getSkill(slug);

  const page = (
    <div>
      <main>
        <div className="all">
          {!hideHeader && <Header />}

          <LearnPageContent
            slug={slug}
            skill={skill}
            mode={mode as types.ComponentMode}
            apiKey={process.env.ONECOMPILER_API_KEY ?? ''}
          />

          <ToastContainer />
        </div>
      </main>
    </div>
  );

  return page;
}
