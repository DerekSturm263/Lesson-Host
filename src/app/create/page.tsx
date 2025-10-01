import { Header } from '../lib/components';
import { CreateSkillButton, CreateProjectButton, CreateCourseButton } from '../lib/components';
import type { Metadata } from 'next'

/*export const metadata: Metadata = {
  title: 'Create | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}*/

export default function Page() {
  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">Create</h1>

        <div>
          <CreateSkillButton />
          <CreateProjectButton />
          <CreateCourseButton />
        </div>
      </main>
    </div>
  );
}
