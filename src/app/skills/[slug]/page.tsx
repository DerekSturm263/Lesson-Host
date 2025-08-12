'use client'

import { useParams } from 'next/navigation';
import fs from 'fs';

/*const lti = require('ltijs').Provider;

lti.onConnect(async (token: any, req: any, res: any) => {
  if (token.custom) {
    console.log('Custom Parameter:', token.custom.skill);
  }
});*/

export default function Page() {
  const params = useParams();

  //const fileContents = fs.readFileSync(process.cwd() + `/app/data/skills/${params.slug}.json`, 'utf8').toString();
  //const skill = JSON.parse(fileContents);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-center sm:text-center">
          {'Test'}
        </h1>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[250px] md:h-[400px]"
            href="../../learn"
            target="_self"
            rel="noopener noreferrer"
          >
            Learn
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[250px] md:h-[400px]"
            href={"./" + params.slug + "/practice"}
            target="_self"
            rel="noopener noreferrer"
          >
            Practice
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[250px] md:h-[400px]"
            href="/implement"
            target="_self"
            rel="noopener noreferrer"
          >
            Implement
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[250px] md:h-[400px]"
            href="study"
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
