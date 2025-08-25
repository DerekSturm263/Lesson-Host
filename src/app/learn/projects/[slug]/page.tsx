import { Header } from '../../../lib/components';
import { getProject } from '../../../lib/database';

export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const project = await getProject(slug);

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{project.title}</h1>
      </main>
    </div>
  );
}
