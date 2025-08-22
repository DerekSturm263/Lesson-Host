import { Header } from '../../lib/components';
//import { createProject } from '../../lib/database';

export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
  //const project = await createProject();

  return (
    <div>
      <main>
        <Header />
      </main>
    </div>
  );
}
