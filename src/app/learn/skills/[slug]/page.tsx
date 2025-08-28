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
  const urlParams = await searchParams;

  const skill = await getSkill(slug);

  const hideHeader = !urlParams || urlParams.hideHeader == 'true';

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

  const urlParamAppend = urlParams ? "?" + Object.entries(urlParams).map(value => `${value[0]}=${value[1]}`) : "";

  return (
    <div>
      <main>
        {!hideHeader && <Header />}
        <h1 className="mainHeader">{skill.title}</h1>

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
