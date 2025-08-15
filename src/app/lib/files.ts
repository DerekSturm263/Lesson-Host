'use server'

import fs from 'fs';
import { Skill, Course, Project } from './types';

export function getSkill(name: string) : Skill {
  return JSON.parse(fs.readFileSync(`./skills/${name}.json`, 'utf-8')) as Skill;
}

export function getProject(name: string) : Project {
  return JSON.parse(fs.readFileSync(`./projects/${name}.json`, 'utf-8')) as Project;
}

export function getCourse(name: string) : Course {
  return JSON.parse(fs.readFileSync(`./courses/${name}.json`, 'utf-8')) as Course;
}
