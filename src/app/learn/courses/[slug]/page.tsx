import { Header } from '../../../lib/components';
import { getCourse } from '../../../lib/sql';

export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const course = await getCourse(slug);

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{course.title}</h1>
      </main>
    </div>
  );
}
