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
  const hideHeader = !urlParams || urlParams.hideHeader == 'true';
  const mode = urlParams?.mode ?? "view";

  const skill = await getSkill(slug);

  const urlParamAppend = urlParams ? "?" + Object.entries(urlParams).map(value => `${value[0]}=${value[1]}`).join('&') : "";

  return (
    <div>
      <main>
        <Header
          title={skill.title}
          mode={mode as ComponentMode}
          type=""
          progress={0}
        />
        <Toolbar />

        <Stack
          spacing={2}
        >
          <SkillDescription
            skill={skill}
            mode={mode as ComponentMode}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={2}
        >
          <Button
            href={"./" + slug + "/learn" + urlParamAppend}
            variant="contained"
            startIcon={<School />}
          >
            Learn
          </Button>

          <Button
            href={"./" + slug + "/practice" + urlParamAppend}
            variant="contained"
            startIcon={<LocalLibrary />}
          >
            Practice
          </Button>

          <Button
            href={"./" + slug + "/implement" + urlParamAppend}
            variant="contained"
            startIcon={<CloudUpload />}
          >
            Implement
          </Button>
          
          <Button
            href={"./" + slug + "/certify" + urlParamAppend}
            variant="contained"
            startIcon={<VerifiedUser />}
          >
            Certify
          </Button>
        </Stack>
      </main>
    </div>
  );
}
