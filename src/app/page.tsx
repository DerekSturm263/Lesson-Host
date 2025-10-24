import { Metadata } from 'next';
import { ComponentMode } from './lib/types';
import { Header, CourseCard, SkillCard, ProjectCard } from './lib/components';

import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export const metadata: Metadata = {
  title: 'Home | MySkillStudy.com',
  description: 'Learn anything by practicing skills and creating projects.',
}

export default async function Home() {
  return (
    <div>
      <main>
        <Header
          title={""}
          slug={""}
          mode={ComponentMode.Master}
          type=""
          progress={0}
          showProgress={false}
          hideLogo={false}
          value={undefined}
        />
        <Toolbar />

        <Stack
          direction="row"
          spacing={2}
          sx={{ marginLeft: '150px', marginRight: '150px' }}
        >
          <TextField
            label="What do you want to learn?"
            name="response"
            autoComplete="off"
            sx={{ flexGrow: 1 }}
          />

          <Button
            variant="contained"
            sx={{ width: '120px' }}
          >
            Submit
          </Button>
        </Stack>

        <Stack>        
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            <Typography
              variant="h4"
            >
              Popular Courses
            </Typography>

            <Button
              href="/courses"
            >
              View All
            </Button>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
          >
            {[].map((course, index) => (
              <CourseCard
                key={index}
                course={course}
                id=""
              />
            ))}
          </Stack>
        </Stack>

        <Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            <Typography
              variant="h4"
            >
              Popular Skills
            </Typography>

            <Button
              href="/skills"
            >
              View All
            </Button>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
          >
            {[].map((skill, index) => (
              <SkillCard
                key={index}
                skill={skill}
                id=""
              />
            ))}
          </Stack>
        </Stack>

        <Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            <Typography
              variant="h4"
            >
              Popular Projects
            </Typography>

            <Button
              href="/projects"
            >
              View All
            </Button>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
          >
            {[].map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                id=""
              />
            ))}
          </Stack>

          <Button
            href="/create"
          >
            Create
          </Button>
        </Stack>
      </main>
    </div>
  );
}
