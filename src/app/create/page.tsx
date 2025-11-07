import { Header, CreateSharableButton, Header2 } from '@/app/lib/components';
import { Metadata } from 'next';
import { ComponentMode } from '../lib/types';
import { createSkill, createProject, createCourse } from '@/app/lib/database';

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
        <Header2 />
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
          <CreateSharableButton
            create={createSkill}
            type="Skill"
            path="skills"
          />

          <CreateSharableButton
            create={createProject}
            type="Project"
            path="projects"
          />
          
          <CreateSharableButton
            create={createCourse}
            type="Course"
            path="courses"
          />
        </Stack>
      </main>
    </div>
  );
}
