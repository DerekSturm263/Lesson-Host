import { Header, Sidebar, Element, ChapterButton } from '../../../../lib/components';
import { getSkill } from '../../../../lib/database';
import * as types from '../../../../lib/types';
import type { GetStaticProps } from 'next'

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const skill = await getSkill(slug);

  const hideHeader = !urlParams || urlParams.hideHeader == 'true';

  for (let i = 0; i < skill.learn.chapters.length; ++i) {
    for (let j = 0; j < skill.learn.chapters[i].elements.length; ++j) {
      if (i != 0 || j != 0) {
        skill.learn.chapters[i].elements[j].state = types.ElementState.Locked;
      }
    }
  }

  const page = (
    <div>
      <main>
        <div className="all">
          {!hideHeader && <Header />}

          <div className="content">
            <Sidebar label="Chapters">
              {skill.learn.chapters.map((chapter, index) => (
                <ChapterButton
                  key={index}
                  elementID={{ learn: skill.learn, chapterIndex: index, elementIndex: 0, keys: [ oneCompilerApiKey ] }}
                />
              ))}
            </Sidebar>

            <div className="elements">
              {skill.learn.chapters.map((chapter, cIndex) => (
                chapter.elements.map((element, eIndex) => (
                  <Element
                    key={`${cIndex}:${eIndex}`}
                    elementID={{ learn: skill.learn, chapterIndex: cIndex, elementIndex: eIndex, keys: [ oneCompilerApiKey ] }}
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

let oneCompilerApiKey: string = '';

export async function getStaticProps() {
  oneCompilerApiKey = process.env.ONECOMPILER_API_KEY ?? ''; 
}
