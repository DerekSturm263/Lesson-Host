'use server'

import { readFile } from 'fs/promises';
import { Skill, Course, Project } from './types';

export async function getSkill(name: string) : Promise<Skill> {
  return JSON.parse(await readFile(`${process.cwd()}/app/data/skills/${name}.json`, 'utf-8')) as Skill;
}

export async function getProject(name: string) : Promise<Project> {
  return JSON.parse(await readFile(`${process.cwd()}/app/data/projects/${name}.json`, 'utf-8')) as Project;
}

export async function getCourse(name: string) : Promise<Course> {
  return JSON.parse(await readFile(`${process.cwd()}/app/data/courses/${name}.json`, 'utf-8')) as Course;
}
