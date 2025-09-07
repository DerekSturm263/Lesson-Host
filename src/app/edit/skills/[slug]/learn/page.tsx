import { useState } from 'react';
import { Header, Sidebar, Element, ChapterButton, NewChapter, Save } from '../../../../lib/components';
import { getSkill, saveSkill } from '../../../../lib/database';
import * as types from '../../../../lib/types';

let oneCompilerApiKey: string = '';

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const urlParams = await searchParams;
  const hideHeader = !urlParams || urlParams.hideHeader == 'true';

  const skill = await getSkill(slug);

  oneCompilerApiKey = process.env.ONECOMPILER_API_KEY ?? ''; 

  const [ chapters, setChapters ] = useState(skill.learn.chapters);

  function addChapter() {
    const newChapters = chapters;
    newChapters.push();
    setChapters(newChapters);
  }

  function removeChapter(index: number) {
    const newChapters = chapters;
    chapters.splice(index, 1);
    setChapters(newChapters);
  }

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
                  mode={types.ComponentMode.Edit}
                />
              ))}

              <NewChapter addChapter={addChapter} />
              <Save slug={slug} skill={skill} />
            </Sidebar>

            <div className="elements">
              {chapters.map((chapter, cIndex) => (
                chapter.elements.map((element, eIndex) => (
                  <Element
                    key={`${cIndex}:${eIndex}`}
                    elementID={{ learn: skill.learn, chapterIndex: cIndex, elementIndex: eIndex, keys: [ oneCompilerApiKey ] }}
                    mode={types.ComponentMode.Edit}
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
