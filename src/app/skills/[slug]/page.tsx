'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '../../lib/components';
import { getSkill } from '../../lib/files';

export default async function Page() {
  const params = useParams();
  const skill = await getSkill(params.slug?.toString() ?? '');

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{skill.title}</h1>

        <div>
          <Link
            href={"./" + params.slug + "/learn"}
            target="_self"
            rel="noopener noreferrer"
          >
            Learn
          </Link>

          <Link
            href={"./" + params.slug + "/practice"}
            target="_self"
            rel="noopener noreferrer"
          >
            Practice
          </Link>

          <Link
            href={"./" + params.slug + "/implement"}
            target="_self"
            rel="noopener noreferrer"
          >
            Implement
          </Link>
          
          <Link
            href={"./" + params.slug + "/study"}
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
