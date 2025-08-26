import { Header, Sidebar, Element, ChapterButton } from '../../../../lib/components';
import { getSkill } from '../../../../lib/database';

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
            <Sidebar label="Chapters" doHamburgerButton={true}>
              {skill.learn.chapters.map((chapter, index) => (
                <ChapterButton key={index} chapter={chapter} index={index} />
              ))}
            </Sidebar>

            <div className="elements">
              {skill.learn.chapters.map((chapter, cIndex) => (
                chapter.elements.map((element, eIndex) => (
                  <Element key={`${cIndex}:${eIndex}`} chapter={chapter} element={element} />
                ))
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  //load();

  return page;
}
