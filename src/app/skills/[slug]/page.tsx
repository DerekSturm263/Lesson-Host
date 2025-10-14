import { Props, ComponentMode } from '@/app/lib/types';
import { Header, SkillDescription } from '@/app/lib/components';
import { getSkill } from '@/app/lib/database';
import { Metadata, ResolvingMetadata } from 'next';

import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';

import School from '@mui/icons-material/School';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import CloudUpload from '@mui/icons-material/CloudUpload';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import Head from 'next/head';

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkill(slug);

  return {
    title: `${skill.title} | MySkillStudy.com`,
    description: 'Learn anything by practicing skills and creating projects.',
    
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const hideLogo = urlParams && urlParams.hideLogo == 'true';
  const mode = urlParams?.mode ?? "view";

  const skill = await getSkill(slug);

  return (
    <div>
      <Head>
        <base
          href={`https://myskillstudy.com/skills/${slug}/`}
          target="_blank"
        ></base>
      </Head>

      <main>
        <Header
          title={skill.title}
          mode={mode as ComponentMode}
          type=""
          progress={0}
          hideLogo={hideLogo}
        />
        <Toolbar />

        <SkillDescription
          skill={skill}
          mode={mode as ComponentMode}
        />

        <Stack
          direction="row"
          spacing={5}
          sx={{ justifyContent: "center" }}
        >
          <Button
            href={"/learn"}
            variant="contained"
            startIcon={<School />}
            sx={{ padding: ' 100px 50px 100px 50px' }}
            size="large"
          >
            Learn
          </Button>

          <Button
            href={"./practice"}
            variant="contained"
            startIcon={<LocalLibrary />}
            sx={{ padding: ' 100px 50px 100px 50px' }}
            size="large"
          >
            Practice
          </Button>

          <Button
            href={"implement/"}
            variant="contained"
            startIcon={<CloudUpload />}
            sx={{ padding: ' 100px 50px 100px 50px' }}
            size="large"
          >
            Implement
          </Button>
          
          <Button
            href={"certify"}
            variant="contained"
            startIcon={<VerifiedUser />}
            sx={{ padding: ' 100px 50px 100px 50px' }}
            size="large"
          >
            Certify
          </Button>
        </Stack>
      </main>
    </div>
  );
}
