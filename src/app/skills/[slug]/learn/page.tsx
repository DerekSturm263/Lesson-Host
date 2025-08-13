'use client'

import { useParams } from 'next/navigation';
import sql from '../../../lib/sql';
import { Header, Sidebar, Element } from '../../../lib/components';
import { ElementType, Skill } from '../../../lib/types';

export default function Page() {
  const params = useParams();
  const skill: Skill = {
    title: params.slug?.toString() ?? '',
    description: 'This is a placeholder description for the skill.',
    learn: {
      chapters: [
        {
          title: 'Chapter 1',
          elements: [
            {
              type: ElementType.ShortAnswer,
              text: 'What is SQL?',
              value: {
                correctAnswer: 'SQL is a standard language for accessing and manipulating databases.'
              }
            },
            {
              type: ElementType.TrueOrFalse,
              text: 'SQL stands for Structured Query Language.',
              value: true
            }
          ]
        }
      ]
    },
    practice: {},
    implement: {},
    study: {}
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Header title={skill.title + " - Learn"} content={[]} doBackButton={true} doLanguageSwitcher={false} />
        <Sidebar label="Chapters" content={skill.learn.chapters.map((chapter) => {
          return {
            label: chapter.title,
            action: () => {
              console.log(`Navigating to chapter: ${chapter.title}`);
            }
          };
        })} doHamburgerButton={true} />
        
        {skill.learn.chapters.map((chapter, chapterIndex) => (
          chapter.elements.map((element, elementIndex) => (
            <Element element={element} />
          ))
        ))}
      </main>
    </div>
  );
}
