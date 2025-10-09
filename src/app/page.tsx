import { Metadata } from 'next';
import { ComponentMode } from './lib/types';
import { Header } from './lib/components';

export const metadata: Metadata = {
  title: 'Home | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default async function Home() {
  return (
    <div>
      <main>
        <Header title={""} mode={ComponentMode.Master} type="" progress={100} />

        <h1 className="mainHeader">Main page under construction. Be back soon!</h1>
      </main>
    </div>
  );
}
