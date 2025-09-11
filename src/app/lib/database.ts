'use server'

import { MongoClient, ObjectId } from 'mongodb';
import * as types from './types';

const uri: string = process.env.MONGODB_URI ?? '';
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 120000,
  connectTimeoutMS: 120000
});

export async function getSkill(id: string): Promise<types.Skill> {
  await client.connect();

  const skill = await client.db('database').collection('skills').findOne(
    { _id: new ObjectId(id) }
  );

  await client.close();

  return skill as unknown as types.Skill;
}

export async function createSkill(): Promise<[ types.Skill, ObjectId ]> {
  const skill: types.Skill = {
    title: "New Skill",
    description: "",
    learn: {
      chapters: [
        {
          title: "New Chapter",
          elements: [
            {
              type: types.ElementType.ShortAnswer,
              text: "New element",
              value: {
                correctAnswer: ""
              },
              state: types.ElementState.Complete
            }
          ]
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
  const result = await client.db('database').collection('skills').insertOne(skill);
  await client.close();

  return [ skill, result.insertedId ];
}

export async function saveSkillLearn(id: string, learn: types.Learn) {
  await client.connect();

  const result = await client.db('database').collection('skills').updateOne(
    { _id: new ObjectId(id) },
    { $set: { learn: learn } }
  );

  await client.close();
}

export async function getProject(id: string): Promise<types.Project> {
  await client.connect();

  const project = await client.db('database').collection('projects').findOne(
    { _id: new ObjectId(id) }
  );

  await client.close();

  return project as unknown as types.Project;
}

export async function createProject(): Promise<[ types.Project, ObjectId ]> {
  const project: types.Project = {
    title: "New Project",
    description: ""
  };

  await client.connect();
  const result = await client.db('database').collection('projects').insertOne(project);
  await client.close();

  return [ project, result.insertedId ];
}

export async function saveProject(id: string, project: types.Project) {
  await client.connect();

  await client.db('database').collection('projects').updateOne(
    { _id: new ObjectId(id) },
    { $set: project }
  );

  await client.close();
}

export async function getCourse(id: string): Promise<types.Course> {
  await client.connect();

  const course = await client.db('database').collection('courses').findOne(
    { _id: new ObjectId(id) }
  );

  await client.close();

  return course as unknown as types.Course;
}

export async function createCourse(): Promise<[ types.Course, ObjectId ] > {
  const course: types.Course = {
    title: "New Course",
    description: "",
    skills: [],
    projects: []
  };

  await client.connect();
  const result = await client.db('database').collection('courses').insertOne(course);
  await client.close();

  return [ course, result.insertedId ];
}

export async function saveCourse(id: string, course: types.Course) {
    await client.connect();

  await client.db('database').collection('courses').updateOne(
    { _id: new ObjectId(id) },
    { $set: course }
  );

  await client.close();
}
