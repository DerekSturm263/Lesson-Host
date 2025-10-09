import { Header } from '@/app/lib/components';
import { Metadata } from 'next';
import { ComponentMode } from '../lib/types';

export const metadata: Metadata = {
  title: 'View | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default function Page() {
  return (
    <div>
      <main>
        <Header title={""} mode={ComponentMode.Master} type="" progress={100} />

        <h1 className="mainHeader">Learn</h1>

        <form
          //action={}
        >
          <input
            type="text"
            name="search"
            placeholder="What would you like to learn?"
            autoComplete="on"
          />
        </form>

        <h2 className="mainHeader">Courses</h2>

        <h2 className="mainHeader">Skills</h2>

        <h2 className="mainHeader">Projects</h2>
      </main>
    </div>
  );
}
