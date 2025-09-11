import { Header } from '../lib/components';
import { CreateSkillButton, CreateProjectButton, CreateCourseButton } from '../lib/components';

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
