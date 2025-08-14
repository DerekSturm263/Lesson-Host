import postgres from 'postgres';
import { Skill, Course } from './types';

const sql = postgres({  });

export async function getLessonByID(id: number): Promise<Skill> {
  const skillQuery = await sql`
    SELECT *
    FROM skills
    WHERE id = ${id}
  `;

  return JSON.parse(skillQuery[0].data) as Skill;
}

export async function getCourseByID(id: number): Promise<Course> {
  const skillQuery = await sql`
    SELECT *
    FROM courses
    WHERE id = ${id}
  `;

  return JSON.parse(skillQuery[0].data) as Course;
}
