import { Header } from '../../lib/components';
import { createCourse } from '../../lib/database';

export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
  //const course = await createCourse();

  return (
    <div>
      <main>
        <Header />
      </main>
    </div>
  );
}
