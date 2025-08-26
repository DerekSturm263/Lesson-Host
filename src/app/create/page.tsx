import Link from 'next/link';
import { Header } from '../lib/components';

export default function Page() {
  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">Create</h1>

        <div>
          <Link
            href={"./create/skill"}
            target="_self"
            rel="noopener noreferrer"
          >
            Skill
          </Link>

          <Link
            href={"./create/project"}
            target="_self"
            rel="noopener noreferrer"
          >
            Project
          </Link>

          <Link
            href={"./create/course"}
            target="_self"
            rel="noopener noreferrer"
          >
            Course
          </Link>
        </div>
      </main>
    </div>
  );
}
