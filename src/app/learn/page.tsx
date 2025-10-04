import { Header } from '@/app/lib/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default function Page() {
  return (
    <div>
      <main>
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
