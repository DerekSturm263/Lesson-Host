'use client'

import { useParams } from 'next/navigation';
import { Header } from '../../lib/components';

export default function Page() {
  const params = useParams();
  const skillTitle: string = params.slug?.toString() ?? '';

  return (
    <div>
      <main>
        <Header />

        <div>
          <a
            href={"./" + params.slug + "/learn"}
            target="_self"
            rel="noopener noreferrer"
          >
            Learn
          </a>

          <a
            href={"./" + params.slug + "/practice"}
            target="_self"
            rel="noopener noreferrer"
          >
            Practice
          </a>

          <a
            href={"./" + params.slug + "/implement"}
            target="_self"
            rel="noopener noreferrer"
          >
            Implement
          </a>
          
          <a
            href={"./" + params.slug + "/study"}
            target="_self"
            rel="noopener noreferrer"
          >
            Study
          </a>
        </div>
      </main>
    </div>
  );
}
