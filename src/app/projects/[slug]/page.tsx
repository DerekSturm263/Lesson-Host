import { Header } from '../../lib/components';
import { getProject } from '../../lib/files';

export default async function Page({ params }: { params: { slug: string | undefined } }) {
  const project = await getProject(params.slug?.toString() ?? '');

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{project.title}</h1>
      </main>
    </div>
  );
}
