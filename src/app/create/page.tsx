import Link from 'next/link';
import { Header } from '../lib/components';
import { createCourse, createProject, createSkill } from '../lib/database';

export default function Page() {
  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">Create</h1>

        <div>
          <button
            onClick={async (e) => {
              const newSkill = await createSkill();
              window.open(`https://www.myskillstudy.com/edit/skills/${newSkill[1]}/`);
            }}
          >
            Skill
          </button>

          <button
            onClick={async (e) => {
              const newProject = await createProject();
              window.open(`https://www.myskillstudy.com/edit/projects/${newProject[1]}/`);
            }}
          >
            Project
          </button>

          <button
            onClick={async (e) => {
              const newCourse = await createCourse();
              window.open(`https://www.myskillstudy.com/edit/courses/${newCourse[1]}/`);
            }}
          >
            Course
          </button>
        </div>
      </main>
    </div>
  );
}
