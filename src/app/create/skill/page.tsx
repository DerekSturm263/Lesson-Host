import { Header } from '../../lib/components';
import { createSkill } from '../../lib/sql';

export default async function Page({ params }: { params: Promise<{ slug: string }>}) {
  const skill = await createSkill();
  
  return (
    <div>
      <main>
        <Header />
      </main>
    </div>
  );
}
