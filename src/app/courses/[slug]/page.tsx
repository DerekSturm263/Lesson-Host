import { useRouter } from 'next/router';
import { Header } from '../../lib/components';
import { getCourse } from '../../lib/files';

export default async function Page() {
  const router = useRouter();
  const course = await getCourse(router.query.slug?.toString() ?? '');

  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">{course.title}</h1>
      </main>
    </div>
  );
}
