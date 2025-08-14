import { Header } from './lib/components';

export default async function Home() {
  return (
    <div>
      <main>
        <Header title="MySkillStudy.com" doBackButton={false} doLanguageSwitcher={false}>
          <a
            href="skills"
            target="_self"
            rel="noopener noreferrer"
          >
            Skills
          </a>
          
          <a
            href="courses"
            target="_self"
            rel="noopener noreferrer"
          >
            Courses
          </a>
        </Header>
      </main>
    </div>
  );
}
