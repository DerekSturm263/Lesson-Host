import Link from 'next/link';
import { Header } from '../../../lib/components';
import { getSkill } from '../../../lib/database';
//import { useState } from 'react';

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const urlParams = await searchParams;
  const hideHeader = !urlParams || urlParams.hideHeader == 'true';

  const skill = await getSkill(slug);

  const urlParamAppend = urlParams ? "?" + Object.entries(urlParams).map(value => `${value[0]}=${value[1]}`) : "";

  /*const [ title, setTitle ] = useState(skill.title);
  const [ description, setDescription ] = useState(skill.description);*/

  return (
    <div>
      <main>
        {!hideHeader && <Header />}

        <label>
          Title:

          <input
            type="text"
            name="title"
            autoComplete="off"
            /*value={title}
            onInput={(e) => {
              setTitle(e.currentTarget.value)
              skill.title = e.currentTarget.value;
            }}*/
          />
        </label>
        
        <label>
          Description:

          <input
            type="text"
            name="description"
            autoComplete="off"
            /*value={description}
            onInput={(e) => {
              setDescription(e.currentTarget.value)
              skill.description = e.currentTarget.value;
            }}*/
          />
        </label>

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
