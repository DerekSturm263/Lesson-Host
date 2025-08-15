import { Header } from './lib/components';

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
