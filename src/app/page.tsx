import { Header } from '@/app/lib/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default async function Home() {
  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">Main page under construction. Be back soon!</h1>
      </main>
    </div>
  );
}
