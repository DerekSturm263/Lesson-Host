import Link from 'next/link';
import { Header } from '../../../lib/components';
import { getSkill } from '../../../lib/files';
import ky from 'ky';

const lti = require('ltijs').Provider;

lti.onConnect(async (token: any, req: any, res: any) => {
  const customParams = res.locals.lti.custom;
  console.log('Custom parameters:', customParams);
});

export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const skill = await getSkill(slug);



  /*(async () => {
    try {
      const launchInfo = await ky.get(`https://api.schoology.com/v1/sections/{section_id}/grades`,
        {
          credentials: 'include',
          headers: {
            Authorization: 'Bearer ' + process.env.LTI_KEY
          }
        }
      ).json();

      console.log(JSON.stringify(launchInfo));
    } catch (err) {
      console.error(err);
    }
  })();*/

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{skill.title}</h1>

        <div>
          <Link
            href={"./" + skill.title + "/learn"}
            target="_self"
            rel="noopener noreferrer"
          >
            Learn
          </Link>

          <Link
            href={"./" + skill.title + "/practice"}
            target="_self"
            rel="noopener noreferrer"
          >
            Practice
          </Link>

          <Link
            href={"./" + skill.title + "/implement"}
            target="_self"
            rel="noopener noreferrer"
          >
            Implement
          </Link>
          
          <Link
            href={"./" + skill.title + "/study"}
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
