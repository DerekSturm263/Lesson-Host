import { useState } from 'react';
import { Header, Sidebar, Element, ChapterButton } from '../../../../lib/components';
import { getSkill } from '../../../../lib/database';
import * as types from '../../../../lib/types';

let oneCompilerApiKey: string = '';

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const urlParams = await searchParams;
  const hideHeader = !urlParams || urlParams.hideHeader == 'true';

  const skill = await getSkill(slug);

  oneCompilerApiKey = process.env.ONECOMPILER_API_KEY ?? ''; 

  for (let i = 0; i < skill.learn.chapters.length; ++i) {
    for (let j = 0; j < skill.learn.chapters[i].elements.length; ++j) {
      if (i != 0 || j != 0) {
        skill.learn.chapters[i].elements[j].state = types.ElementState.Locked;
      }
    }
  }

  const [ chapters, setChapters ] = useState(skill.learn.chapters);

  const page = (
    <div>
      <main>
        <div className="all">
          {!hideHeader && <Header />}

          <div className="content">
            <Sidebar label="Chapters">
              {chapters.map((chapter, index) => (
                <ChapterButton
                  key={index}
                  elementID={{ learn: skill.learn, chapterIndex: index, elementIndex: 0, keys: [ oneCompilerApiKey ] }}
                  mode={types.ComponentMode.View}
                />
              ))}
            </Sidebar>

            <div className="elements">
              {chapters.map((chapter, cIndex) => (
                chapter.elements.map((element, eIndex) => (
                  <Element
                    key={`${cIndex}:${eIndex}`}
                    elementID={{ learn: skill.learn, chapterIndex: cIndex, elementIndex: eIndex, keys: [ oneCompilerApiKey ] }}
                    mode={types.ComponentMode.View}
                  />
                ))
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return page;
}
