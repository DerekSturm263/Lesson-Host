'use client'

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Header, Sidebar, Element } from '../../../lib/components';
import { load } from '../../../lib/functions';
import * as types from '../../../lib/types';
import { getSkill } from '../../../lib/files';

export default function Page() {
  const params = useParams();
  const skill = getSkill(params.slug?.toString() ?? '');

  const page = (
    <div>
      <main>
        <Header />

        <Sidebar label="Chapters" doHamburgerButton={true}>
          {skill.learn.chapters.map((chapter, index) => (
            <button
              title={`Load chapter ${index}`}
              key={index}
              onClick={load}
              disabled={chapter.elements[0].state == types.ElementState.Locked}
              data-iscomplete="false"
              data-isselected="false"
            >
              <h4>
                {chapter.title}
              </h4>

              <Image
                className="checkmark"
                src="/icons/checkmark.png"
                alt="Checkmark"
                data-iscomplete="false"
              />
            </button>
          ))}
        </Sidebar>

        {skill.learn.chapters.map((chapter, cIndex) => (
          chapter.elements.map((element, eIndex) => (
            <Element key={`${cIndex}:${eIndex}`} chapter={chapter} element={element} />
          ))
        ))}
      </main>
    </div>
  );

  return page;
}
