import { ComponentMode, Props } from '@/app/lib/types';
import { Metadata } from 'next';
import { Header, SkillCard } from '../lib/components';
import { Grid, Toolbar } from '@mui/material';
import { getAllSkills } from '../lib/database';

export const metadata: Metadata = {
  title: 'Skills | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default async function Page({ params, searchParams }: Props) {
  const skills = await getAllSkills();

  return (
    <div>
      <main>
        <Header
          title="Skills"
          slug={""}
          mode={ComponentMode.View}
          type=""
          progress={0}
          showProgress={false}
          hideLogo={false}
          value={undefined}
          showSave={false}
          linkType=""
        />
        <Toolbar />

        <Grid
          container
          spacing={5}
          sx={{ justifyContent: "center" }}
        >
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              skill={skill}
              id={skill._id.toString()}
            />
          ))}
        </Grid>
      </main>
    </div>
  );
}
