import { Header, CreateSkillButton, CreateProjectButton, CreateCourseButton } from '@/app/lib/components';
import { Metadata } from 'next';
import { ComponentMode } from '../lib/types';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export const metadata: Metadata = {
  title: 'Create | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default function Page() {
  return (
    <div>
      <main>
        <Header
          title={""}
          mode={ComponentMode.Master}
          type=""
          progress={1}
          hideLogo={false}
        />
        <Toolbar />

        <Typography
          variant='h3'
        >
          Create
        </Typography>
        
        <Stack
          direction="row"
          spacing={2}
        >
          <CreateSkillButton />
          <CreateProjectButton />
          <CreateCourseButton />
        </Stack>
      </main>
    </div>
  );
}
