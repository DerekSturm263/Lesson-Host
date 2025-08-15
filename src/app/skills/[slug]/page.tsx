'use client'

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../lib/components';

export default function Page() {
  const params = useParams();
  const skillTitle: string = params.slug?.toString() ?? '';

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{skillTitle}</h1>

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
