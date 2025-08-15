import { neon } from '@neondatabase/serverless';
import { Skill, Project, Course } from './types';

const sql = neon(process.env.DATABASE_URL ?? '');

export async function getSkill(id: string): Promise<Skill> {
  const query = await sql`
    SELECT *
    FROM skills
    WHERE id = ${id}
  `;

  console.log(query);
  return JSON.parse(query[0].value) as Skill;
}

export async function createSkill(): Promise<Skill> {
  const skill: Skill = {
    title: "New Skill",
    description: "",
    learn: {
      chapters: [
        {
          title: "New Chapter",
          elements: []
        }
      ]
    },
    practice: {
      placeholder: false
    },
    implement: {
      link: ""
    },
    study: {
      link: ""
    }
  };

  const query = await sql`
    INSERT INTO skills
    VALUES (${JSON.stringify(skill)})
  `;

  console.log(query);
  return skill;
}

export async function saveSkill(id: number, skill: Skill) {
  const query = await sql`
    UPDATE skills
    SET value = ${JSON.stringify(skill)}
    WHERE id = ${id}
  `;

  console.log(query);
}

export async function getProject(id: string): Promise<Project> {
  const query = await sql`
    SELECT *
    FROM projects
    WHERE id = ${id}
  `;

  console.log(query);
  return JSON.parse(query[0].value) as Project;
}

export async function createProject(): Promise<Project> {
  const project: Project = {
    title: "New Course",
    description: ""
  };

  const query = await sql`
    INSERT INTO projects
    VALUES (${JSON.stringify(project)})
  `;

  console.log(query);
  return project;
}

export async function saveProject(id: number, project: Project) {
  const query = await sql`
    UPDATE projects
    SET value = ${JSON.stringify(project)}
    WHERE id = ${id}
  `;

  console.log(query);
}

export async function getCourse(id: string): Promise<Course> {
  const query = await sql`
    SELECT *
    FROM courses
    WHERE id = ${id}
  `;

  console.log(query);
  return JSON.parse(query[0].value) as Course;
}

export async function createCourse(): Promise<Course> {
  const course: Course = {
    title: "New Course",
    description: "",
    skills: [],
    projects: []
  };

  const query = await sql`
    INSERT INTO courses
    VALUES (${JSON.stringify(course)})
  `;

  console.log(query);
  return course;
}

export async function saveCourse(id: number, course: Course) {
  const query = await sql`
    UPDATE courses
    SET value = ${JSON.stringify(course)}
    WHERE id = ${id}
  `;

  console.log(query);
}
