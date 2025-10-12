'use server'

import { MongoClient, ObjectId } from 'mongodb';
import { Skill, Project, Course, Learn, Practice, Implement, Certify } from '@/app/lib/types';

const client = new MongoClient(process.env.MONGODB_URI ?? '', {
  serverSelectionTimeoutMS: 120000,
  connectTimeoutMS: 120000
});

export async function getSkill(id: string): Promise<Skill> {
  const skill = await client.db('database').collection('skills').findOne(
    { _id: new ObjectId(id) }
  );

  return skill as unknown as Skill;
}

export async function createSkill(): Promise<[ Skill, ObjectId ]> {
  const skill: Skill = {
    title: "New Skill",
    description: "",
    learn: {
      chapters: [
        {
          title: "New Chapter",
          elements: [
            {
              type: "",
              text: "New element",
              value: {
                correctAnswer: ""
              }
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
    certify: {
      link: ""
    }
  };

  const result = await client.db('database').collection('skills').insertOne(skill);

  return [ skill, result.insertedId ];
}

export async function saveSkillLearn(id: string, learn: Learn) {
  const result = await client.db('database').collection('skills').updateOne(
    { _id: new ObjectId(id) },
    { $set: { learn: learn } }
  );
}

export async function getProject(id: string): Promise<Project> {
  const project = await client.db('database').collection('projects').findOne(
    { _id: new ObjectId(id) }
  );

  return project as unknown as Project;
}

export async function createProject(): Promise<[ Project, ObjectId ]> {
  const project: Project = {
    title: "New Project",
    description: ""
  };

  const result = await client.db('database').collection('projects').insertOne(project);

  return [ project, result.insertedId ];
}

export async function saveProject(id: string, project: Project) {
  await client.db('database').collection('projects').updateOne(
    { _id: new ObjectId(id) },
    { $set: project }
  );
}

export async function getCourse(id: string): Promise<Course> {
  const course = await client.db('database').collection('courses').findOne(
    { _id: new ObjectId(id) }
  );

  return course as unknown as Course;
}

export async function createCourse(): Promise<[ Course, ObjectId ] > {
  const course: Course = {
    title: "New Course",
    description: "",
    skills: [],
    projects: []
  };

  const result = await client.db('database').collection('courses').insertOne(course);

  return [ course, result.insertedId ];
}

export async function saveCourse(id: string, course: Course) {
  await client.db('database').collection('courses').updateOne(
    { _id: new ObjectId(id) },
    { $set: course }
  );
}
