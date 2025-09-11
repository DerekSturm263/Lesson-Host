'use server'

import { MongoClient, ObjectId } from 'mongodb';
import { Skill, Project, Course } from './types';

const uri: string = process.env.MONGODB_URI ?? '';
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 120000,
  connectTimeoutMS: 120000
});

export async function getSkill(id: string): Promise<Skill> {
  await client.connect();

  const skill = await client.db('database').collection('skills').findOne({ _id: new ObjectId(id) });

  await client.close();

  console.log(JSON.stringify(skill));

  return skill as unknown as Skill;
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

  await client.connect();
  await client.db('database').collection('skills').insertOne(skill);
  await client.close();

  return skill;
}

export async function saveSkill(id: string, skill: Skill) {
  await client.connect();

  await client.db('database').collection('skills').updateOne({ _id: new ObjectId(id) }, { $set: skill });

  await client.close();
}

export async function getProject(id: string): Promise<Project> {
  await client.connect();

  const project = await client.db('database').collection('projects').findOne({ _id: new ObjectId(id) });

  await client.close();

  console.log(JSON.stringify(project));

  return project as unknown as Project;
}

export async function createProject(): Promise<Project> {
  const project: Project = {
    title: "New Project",
    description: ""
  };

  await client.connect();
  await client.db('database').collection('projects').insertOne(project);
  await client.close();

  return project;
}

export async function saveProject(id: string, project: Project) {
  await client.connect();

  await client.db('database').collection('projects').updateOne({ _id: new ObjectId(id) }, { $set: project });

  await client.close();
}

export async function getCourse(id: string): Promise<Course> {
  await client.connect();

  const course = await client.db('database').collection('courses').findOne({ _id: new ObjectId(id) });

  await client.close();

  console.log(JSON.stringify(course));

  return course as unknown as Course;
}

export async function createCourse(): Promise<Course> {
  const course: Course = {
    title: "New Course",
    description: "",
    skills: [],
    projects: []
  };

  await client.connect();
  await client.db('database').collection('courses').insertOne(course);
  await client.close();

  return course;
}

export async function saveCourse(id: string, course: Course) {
    await client.connect();

  await client.db('database').collection('courses').updateOne({ _id: new ObjectId(id) }, { $set: course });

  await client.close();
}
