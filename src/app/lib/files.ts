'use server'

import { promises as fs } from 'fs';
import { Skill, Course, Project } from './types';

export async function getSkill(name: string) : Promise<Skill> {
  const file = await fs.readFile(`${process.cwd()}/app/data/skills/${name}.json`, 'utf-8')
  return JSON.parse(file) as Skill;
}

export async function getProject(name: string) : Promise<Project> {
  const file = await fs.readFile(`${process.cwd()}/app/data/projects/${name}.json`, 'utf-8')
  return JSON.parse(file) as Project;
}

export async function getCourse(name: string) : Promise<Course> {
  const file = await fs.readFile(`${process.cwd()}/app/data/courses/${name}.json`, 'utf-8');
  return JSON.parse(file) as Course;
}
