import { ElementID } from '@/app/lib/types';
import { Header, Sidebar, Element, ChapterButton } from '../../../../lib/components';
import { getSkill } from '../../../../lib/database';
import { load } from '../../../../lib/functions';

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const skill = await getSkill(slug);

  const hideHeader = !urlParams || urlParams.hideHeader == 'true';

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
                  elementID={{ learn: skill.learn, chapterIndex: index, elementIndex: 0 }}
                />
              ))}
            </Sidebar>

            <div className="elements">
              {skill.learn.chapters.map((chapter, cIndex) => (
                chapter.elements.map((element, eIndex) => (
                  <Element
                    key={`${cIndex}:${eIndex}`}
                    elementID={{ learn: skill.learn, chapterIndex: cIndex, elementIndex: eIndex }}
                  />
                ))
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  //load({ learn: skill.learn, chapterIndex: 0, elementIndex: 0 });

  return page;
}
