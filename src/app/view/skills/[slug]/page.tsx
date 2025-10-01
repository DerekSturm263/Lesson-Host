import Link from 'next/link';
import { Header } from '../../../lib/components';
import { getSkill } from '../../../lib/database';
import { Metadata, ResolvingMetadata } from 'next';
import { Props } from '@/app/lib/types';

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

  const skill = await getSkill(slug);

  const urlParamAppend = urlParams ? "?" + Object.entries(urlParams).map(value => `${value[0]}=${value[1]}`) : "";

  return (
    <div>
      <main>
        {!hideHeader && <Header />}

        <h1
          className="mainHeader"
        >
          {skill.title}
        </h1>
        
        <h3
          className="subHeader"
        >
          {skill.description}
        </h3>

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
