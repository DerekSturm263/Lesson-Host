import { Header } from './lib/components';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default async function Home() {
  return (
    <div>
      <main>
        <Header />
        <h1 className="mainHeader">Pick up where you left off</h1>
      </main>
    </div>
  );
}
