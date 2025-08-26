import Link from 'next/link';
import { Header } from '../../../lib/components';
import { getSkill } from '../../../lib/database';

/* tslint:disable no-require-imports */
//const lti = require('ltijs').Provider;

/* tslint:disable no-explicit-any */
/*lti.onConnect(async (token: any, req: any, res: any) => {
  const customParams = res.locals.lti.custom;
  console.log('Custom parameters:', customParams);
});*/

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const skill = await getSkill(slug);

  console.log(JSON.stringify(searchParams));

  try {
    /*const enrollment = await ky.get(`https://api.schoology.com/v1/[realm]/enrollments`,
      {
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + process.env.LTI_KEY
        }
      }
    ).json();

    console.log(JSON.stringify(enrollment));

    const grades = await ky.get(`https://api.schoology.com/v1/sections/{section_id}/grades`,
      {
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + process.env.LTI_KEY
        }
      }
    ).json();

    console.log(JSON.stringify(grades));*/
  } catch (err) {
    console.error(err);
  }

  return (
    <div>
      <main>
        {<Header />}
        <h1 className="mainHeader">{skill.title}</h1>

        <div>
          <Link
            href={"./" + slug + "/learn"}
            target="_self"
            rel="noopener noreferrer"
          >
            Learn
          </Link>

          <Link
            href={"./" + slug + "/practice"}
            target="_self"
            rel="noopener noreferrer"
          >
            Practice
          </Link>

          <Link
            href={"./" + slug + "/implement"}
            target="_self"
            rel="noopener noreferrer"
          >
            Implement
          </Link>
          
          <Link
            href={"./" + slug + "/study"}
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
