import { ComponentMode, Props } from '@/app/lib/types';
import { Metadata } from 'next';
import { Header, Header2, SharableCard } from '../lib/components';
import { Grid, Toolbar } from '@mui/material';
import { getAllSkills } from '../lib/database';

import Typography from '@mui/material/Typography';

export const metadata: Metadata = {
  title: 'Skills | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default async function Page({ params, searchParams }: Props) {
  const skills = await getAllSkills();

  return (
    <div>
      <main>
        <Header2 />
        <Toolbar />

        <Typography
          variant="h2"
        >
          Skills
        </Typography>

        <Typography
          variant="body1"
        >
          Skills are single, actionable things that you can do. Learn, practice, and quiz yourself on any skill you can think of.
        </Typography>

        <Grid
          container
          spacing={5}
          sx={{ justifyContent: "center" }}
        >
          {skills.map((skill, index) => (
            <SharableCard
              key={index}
              sharable={skill}
              id={skill._id.toString()}
              type="skills"
            />
          ))}
        </Grid>
      </main>
    </div>
  );
}
