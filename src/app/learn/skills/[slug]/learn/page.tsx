import { Header, Sidebar, Element, ChapterButton } from '../../../../lib/components';
import { getSkill } from '../../../../lib/database';

export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const skill = await getSkill(slug);

  const page = (
    <div>
      <main>
        <Header />

        <Sidebar label="Chapters" doHamburgerButton={true}>
          {skill.learn.chapters.map((chapter, index) => (
            <ChapterButton chapter={chapter} index={index} />
          ))}
        </Sidebar>

        <div className="elements">
          {skill.learn.chapters.map((chapter, cIndex) => (
            chapter.elements.map((element, eIndex) => (
              <Element key={`${cIndex}:${eIndex}`} chapter={chapter} element={element} />
            ))
          ))}
        </div>
      </main>
    </div>
  );

  //load();

  return page;
}
