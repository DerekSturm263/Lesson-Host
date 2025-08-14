'use client'

import { useParams } from 'next/navigation';
import { Header, Sidebar, Element } from '../../../lib/components';
import { load } from '../../../lib/functions';
import * as types from '../../../lib/types';

export default function Page() {
  const params = useParams();
  const skill = JSON.parse(require(`../../../data/skills/${params.slug?.toString() ?? ''}.json`)) as types.Skill;

  let page = (
    <div>
      <main>
        <Header title={skill.title + " - Learn"} doBackButton={true} doLanguageSwitcher={false} />

        <Sidebar label="Chapters" doHamburgerButton={true}>
          {skill.learn.chapters.map((chapter, index) => (
            <button
              title={`Load chapter ${index}`}
              onClick={load}
              disabled={chapter.elements[0].state == types.ElementState.Locked}
              data-iscomplete="false"
              data-isselected="false"
            >
              <h4>
                {chapter.title}
              </h4>

              <img
                className="checkmark"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1200px-Eo_circle_green_checkmark.svg.png"
                data-iscomplete="false"
              />
            </button>
          ))}
        </Sidebar>

        {skill.learn.chapters.map((chapter) => (
          chapter.elements.map((element) => (
            <Element chapter={chapter} element={element} />
          ))
        ))}
      </main>
    </div>
  );

  return page;
}
