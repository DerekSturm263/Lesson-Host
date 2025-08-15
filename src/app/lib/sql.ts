import postgres from 'postgres';
import { Skill, Project, Course } from './types';

const sql = postgres(process.env.DATABASE_URL ?? '', { ssl: 'verify-full' });

export async function getSkill(id: string): Promise<Skill> {
  const skillQuery = await sql`
    SELECT *
    FROM skills
    WHERE id = ${id}
  `;

  return JSON.parse(skillQuery[0].data) as Skill;
}

export async function getProject(id: string): Promise<Project> {
  const skillQuery = await sql`
    SELECT *
    FROM projects
    WHERE id = ${id}
  `;

  return JSON.parse(skillQuery[0].data) as Project;
}

export async function getCourse(id: string): Promise<Course> {
  const skillQuery = await sql`
    SELECT *
    FROM courses
    WHERE id = ${id}
  `;

  return JSON.parse(skillQuery[0].data) as Course;
}
