import { Header } from '../lib/components';

export default function Page() {
  return (
    <div>
      <main>
        <Header title="Courses" doBackButton={false} doLanguageSwitcher={false} />
      </main>
    </div>
  );
}
