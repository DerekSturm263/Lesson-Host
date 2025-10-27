import { ComponentMode, Props } from '@/app/lib/types';
import { Metadata } from 'next';
import { Header, ProjectCard } from '../lib/components';
import { Grid, Toolbar } from '@mui/material';
import { getAllCourses, getAllProjects } from '../lib/database';

export const metadata: Metadata = {
  title: 'Projects | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default async function Page({ params, searchParams }: Props) {
  const projects = await getAllProjects();
  
  return (
    <div>
      <main>
        <Header
          title="Projects"
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
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              id={project._id.toString()}
            />
          ))}
        </Grid>
      </main>
    </div>
  );
}
