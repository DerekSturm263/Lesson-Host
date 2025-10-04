import { Props, ComponentMode } from '@/app/lib/types';
import { Header, SkillDescription, SkillTitle } from '@/app/lib/components';
import { getSkill } from '@/app/lib/database';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';

/*export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkill(slug);

  return {
    title: `${skill.title} | MySkillStudy.com`,
    description: 'Learn anything by practicing skills and creating projects.',
  }
}*/

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;

  const urlParams = await searchParams;
  const hideHeader = !urlParams || urlParams.hideHeader == 'true';
  const mode = urlParams?.mode ?? "view";

  const skill = await getSkill(slug);

  const urlParamAppend = urlParams ? "?" + Object.entries(urlParams).map(value => `${value[0]}=${value[1]}`).join('&') : "";

  return (
    <div>
      <main>
        <Header title={skill.title} mode={mode as ComponentMode} type="" />

        <SkillTitle skill={skill} mode={mode as ComponentMode} />
        <SkillDescription skill={skill} mode={mode as ComponentMode} />

        <div className="colButtons">
          <Link
            href={"./" + slug + "/learn" + urlParamAppend}
            target="_self"
            rel="noopener noreferrer"
          >
            Learn
          </Link>

          <Link
            href={"./" + slug + "/practice" + urlParamAppend}
            target="_self"
            rel="noopener noreferrer"
          >
            Practice
          </Link>

          <Link
            href={"./" + slug + "/implement" + urlParamAppend}
            target="_self"
            rel="noopener noreferrer"
          >
            Implement
          </Link>
          
          <Link
            href={"./" + slug + "/study" + urlParamAppend}
            target="_self"
            rel="noopener noreferrer"
          >
            Study
          </Link>
        </div>
      </main>
    </div>
  );
}
