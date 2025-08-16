import { Header } from '../../lib/components';

export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
  return (
    <div>
      <main>
        <Header />
      </main>
    </div>
  );
}
