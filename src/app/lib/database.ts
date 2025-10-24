'use server'

import { MongoClient, ObjectId, UpdateResult, WithId } from 'mongodb';
import { Skill, Project, Course, Learn, Practice, ModuleType } from '@/app/lib/types';
import Codespace from '@/app/lib/interactions/codespace/elements';

const client = new MongoClient(process.env.MONGODB_URI ?? '', {
  serverSelectionTimeoutMS: 120000,
  connectTimeoutMS: 120000
});

export async function getAllSkills(): Promise<WithId<Skill>[]> {
  const courses = await client.db('database').collection('skills').find().toArray();

  return courses.map(item => item as unknown as WithId<Skill>);
}

export async function getAllProjects(): Promise<WithId<Project>[]> {
  const courses = await client.db('database').collection('projects').find().toArray();

  return courses.map(item => item as unknown as WithId<Project>);
}

export async function getAllCourses(): Promise<WithId<Course>[]> {
  const courses = await client.db('database').collection('courses').find().toArray();

  return courses.map(item => item as unknown as WithId<Course>);
}

export async function getSkill(id: string): Promise<Skill> {
  const skill = await client.db('database').collection('skills').findOne(
    { _id: new ObjectId(id) }
  );

  return skill as unknown as Skill;
}

export async function getProject(id: string): Promise<Project> {
  const project = await client.db('database').collection('projects').findOne(
    { _id: new ObjectId(id) }
  );

  return project as unknown as Project;
}

export async function getCourse(id: string): Promise<Course> {
  const course = await client.db('database').collection('courses').findOne(
    { _id: new ObjectId(id) }
  );

  return course as unknown as Course;
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
              type: "shortAnswer",
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
      subSkills: [
        {
          title: "New Sub-Skill"
        }
      ]
    }
  };

  const result = await client.db('database').collection('skills').insertOne(skill);

  return [ skill, result.insertedId ];
}

export async function createProject(): Promise<[ Project, ObjectId ]> {
  const project: Project = {
    title: "New Project",
    description: "",
    checklist: [
      {
        title: "First Item",
        skills: [
          ""
        ]
      },
      {
        title: "Second Item",
        skills: [
          ""
        ]
      },
      {
        title: "Third Item",
        skills: [
          ""
        ]
      }
    ],
    value: {
      type: "codespace",
      text: "",
      value: Codespace.defaultValue
    }
  };

  const result = await client.db('database').collection('projects').insertOne(project);

  return [ project, result.insertedId ];
}

export async function createCourse(): Promise<[ Course, ObjectId ] > {
  const course: Course = {
    title: "New Course",
    description: "",
    units: [
      {
        title: "Unit 1",
        modules: [
          {
            type: ModuleType.Skill,
            id: ""
          }
        ]
      }
    ]
  };

  const result = await client.db('database').collection('courses').insertOne(course);

  return [ course, result.insertedId ];
}

export async function save(id: string, value: Learn | Practice | Project | Course) {
  if ("chapters" in value)
    return saveSkillLearn(id, value);
  else if ("subSkills" in value)
    return saveSkillPractice(id, value);
  else if ("checklist" in value)
    return saveProject(id, value);
  else
    return saveCourse(id, value);
}

async function saveSkillLearn(id: string, learn: Learn): Promise<UpdateResult<Skill>> {
  const result = await client.db('database').collection('skills').updateOne(
    { _id: new ObjectId(id) },
    { $set: { learn: learn } }
  );

  return result;
}

async function saveSkillPractice(id: string, practice: Practice): Promise<UpdateResult<Skill>> {
  const result = await client.db('database').collection('skills').updateOne(
    { _id: new ObjectId(id) },
    { $set: { practice: practice } }
  );

  return result;
}

async function saveProject(id: string, project: Project) {
  await client.db('database').collection('projects').updateOne(
    { _id: new ObjectId(id) },
    { $set: project }
  );
}

async function saveCourse(id: string, course: Course) {
  await client.db('database').collection('courses').updateOne(
    { _id: new ObjectId(id) },
    { $set: course }
  );
}
