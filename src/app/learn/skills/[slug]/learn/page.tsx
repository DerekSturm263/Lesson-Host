import { Header, LearnPageContent } from '../../../../lib/components';
import { getSkill } from '../../../../lib/database';
import * as types from '../../../../lib/types';

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const urlParams = await searchParams;
  const hideHeader = !urlParams || urlParams.hideHeader == 'true';

  const skill = await getSkill(slug);

  const page = (
    <div>
      <main>
        <div className="all">
          {!hideHeader && <Header />}

          <LearnPageContent slug={slug} skill={skill} mode={types.ComponentMode.View} apiKey={process.env.ONECOMPILER_API_KEY ?? ''} />
        </div>
      </main>
    </div>
  );

  return page;
}
