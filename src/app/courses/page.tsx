import { ComponentMode, Props } from '@/app/lib/types';
import { Metadata } from 'next';
import { Header, SharableCard } from '../lib/components';
import { Grid, Toolbar } from '@mui/material';
import { getAllCourses } from '../lib/database';

export const metadata: Metadata = {
  title: 'Courses | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default async function Page({ params, searchParams }: Props) {
  const courses = await getAllCourses();
  
  return (
    <div>
      <main>
        <Header
          title="Courses"
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
          {courses.map((course, index) => (
            <SharableCard
              key={index}
              sharable={course}
              id={course._id.toString()}
              type="courses"
            />
          ))}
        </Grid>
      </main>
    </div>
  );
}
