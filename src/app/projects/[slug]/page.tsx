import { useRouter } from 'next/router';
import { Header } from '../../lib/components';
import { getProject } from '../../lib/files';

export default async function Page() {
  const router = useRouter();
  const project = await getProject(router.query.slug?.toString() ?? '');

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{project.title}</h1>
      </main>
    </div>
  );
}
