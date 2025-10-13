import { Metadata } from 'next';
import { ComponentMode } from './lib/types';
import { Header } from './lib/components';

import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Card, CardActions, CardContent, CardHeader, Chip, LinearProgress, Rating } from '@mui/material';

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
          mode={ComponentMode.Master}
          type=""
          progress={0}
          hideLogo={false}
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
          >
          
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
          >
          
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
          >
            <Card>
              <CardHeader
                title="Console RPG"
              />

              <CardContent>
                <Rating
                  name="project-rating"
                  value={1}
                  readOnly={true}
                />

                <Typography>
                  Create a Console RPG using various C# skills. This project is aimed towards beginners, but can be enjoyed by experienced developers as well.
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={0}
                />
              </CardContent>

              <CardActions>
                <Chip
                  label="View"
                />
                
                <Chip
                  label="Save"
                />
              </CardActions>
            </Card>
          </Stack>
        </Stack>
      </main>
    </div>
  );
}
