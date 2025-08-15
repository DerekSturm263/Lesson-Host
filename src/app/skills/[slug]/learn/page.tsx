import Image from 'next/image';
import { Header, Sidebar, Element } from '../../../lib/components';
import { load } from '../../../lib/functions';
import { getSkill } from '../../../lib/sql';
import * as types from '../../../lib/types';

export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const skill = await getSkill(slug);

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
