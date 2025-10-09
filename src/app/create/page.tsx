import { Header, CreateSkillButton, CreateProjectButton, CreateCourseButton } from '@/app/lib/components';
import { Metadata } from 'next';
import { ComponentMode } from '../lib/types';

export const metadata: Metadata = {
  title: 'Create | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default function Page() {
  return (
    <div>
      <main>
        <Header title={""} mode={ComponentMode.Master} type="" progress={100} />

        <h1 className="mainHeader">Create</h1>

        <div className="colButtons">
          <CreateSkillButton />
          <CreateProjectButton />
          <CreateCourseButton />
        </div>
      </main>
    </div>
  );
}
