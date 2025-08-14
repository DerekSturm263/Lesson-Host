'use client'

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Header, Sidebar, Element } from '../../../lib/components';
import { load } from '../../../lib/functions';
import * as types from '../../../lib/types';

export default function Page() {
  const params = useParams();
  const skill: types.Skill = {
    title: params.slug?.toString() ?? '',
    description: 'This is a placeholder description for the skill.',
    learn: {
      chapters: [
        {
          title: 'Chapter 1',
          elements: [
            {
              text: 'What is SQL?',
              type: types.ElementType.ShortAnswer,
              value: {
                correctAnswer: 'SQL is a standard language for accessing and manipulating databases.'
              },
              state: types.ElementState.InProgress
            },
            {
              text: 'SQL stands for Structured Query Language.',
              type: types.ElementType.TrueOrFalse,
              value: {
                isCorrect: true
              },
              state: types.ElementState.Locked
            }
          ]
        }
      ]
    },
    practice: {
      placeholder: true
    },
    implement: {
      link: ''
    },
    study: {
      link: ''
    }
  };

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
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1200px-Eo_circle_green_checkmark.svg.png"
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
