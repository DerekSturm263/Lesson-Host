import generateText from "@/app/lib/ai/functions";
import { ModelType } from "@/app/lib/ai/types";
import * as schemas from '@/app/lib/schemas';
import * as types from '@/app/lib/types';

enum InteractionType {
  Drawing = 'Drawing',
  Graph = 'Graph',
  DAW = 'DAW',
  Codespace = 'Codespace',
  Engine = 'Engine'
};

type SkillPrompt = {
  topic: string,
  chapters: string[]
};

async function chooseSkillType(skillPrompt: SkillPrompt): Promise<InteractionType> {
  const response = await generateText({
    model: ModelType.Smart,
    prompt:
    `TASK:
    Pick an interaction type based on a lesson's given TOPIC and CHAPTERS.
      
    TOPIC:
    ${skillPrompt.topic}
      
    CHAPTERS:
    ${skillPrompt.chapters.join(', ')}`,
    mimeType: 'text/x.enum',
    schema: schemas.embedTypeSchema,
    overrideInstruction:
    `You are an lesson plan classifier. You take lesson topics and decide which of the following interaction types they should use: 'Drawing', 'Graph', 'DAW', 'Codespace', or 'Engine'.
        
    - For art-related topics (such as Color Theory, The Principles of Animation, etc.), you should pick 'Drawing'.
    - For math-related topics (such as The Distance Formula, Logarithms, etc.), you should pick 'Graph'.
    - For audio-related topics (such as Chord Progressions, Scales, etc.), you should pick 'DAW'.
    - For programming-related topics (such as Functions, Console I/O, etc.), you should pick 'Codespace'.
    - For game design-related topics (such as Level Pacing, Design Pillars, etc.), you should pick 'Engine'.`
  });

  return response as InteractionType;
}

async function generateSkillLearn(skillPrompt: SkillPrompt, type: InteractionType): Promise<types.Learn> {
  const response = await generateText({
    model: ModelType.Smart,
    prompt:
    `TASK:
    Create an interactive self-paced lesson based on the <INPUT> section. The <INPUT> section defines this lesson's TOPIC and CHAPTERS.
    Refer to the <INSTRUCTIONS> section to see exactly how this lesson should be structured.
    Refer to the <EXAMPLE> section to see an example INPUT and OUTPUT.
      
    <INPUT>

      TOPIC:
      ${skillPrompt.topic}

      CHAPTERS:
      Introduction, ${skillPrompt.chapters.join(', ')}, Recap, Exit Ticket

    </INPUT>

    <INSTRUCTIONS>
        
      ${generateLearnInstructions(skillPrompt, type)}

    </INSTRUCTIONS>

    <EXAMPLE>

      <INPUT>

        ${getExampleInput(type)}

      </INPUT>

      <OUTPUT>

        ${await getExampleLearnOutput(type)}

      </OUTPUT>

    </EXAMPLE>`,
    mimeType: 'application/json',
    schema: schemas.skillSchema,
    overrideInstruction:
    `You are an expert lesson planner.
        
    Your lesson should read like it's being spoken out loud by a professional. The audience is a Video Game Production student. Assume that they have no prior knowledge on the subject since they are a beginner. When using complex or technical jargon, make sure to define it immediately in easy-to-understand terms. Assume that the user reads at a 10th grade level.
        
    Wherever applicable, use technical documentation techniques. These should be included to make the text easy to follow and to highlight important information, terminology, formulas, syntaxes, etc. When doing this, use Markdown formatting. Remember that you need to sound like someone speaking, so don't include tables, headers, or other tags that may seem unnatural for spoken language. Here are some valid techniques to use:
    - Bold Text
    - Italics
    - Unordered Lists
    - Ordered Lists
    - Line Breaks

    Code blocks should always be surrounded by triple backticks. Short pieces of code (including types and keywords) should always be surrounded by single backticks.
    Math formulas, equations, and variables should always be written using LATEX formatting.`
  });

  return JSON.parse(response) as types.Learn;
}

function generateLearnInstructions(skillPrompt: SkillPrompt, type: InteractionType): string {
  // Introduction.
  let prompt = `
  CHAPTER 1: 'Introduction' - 2 Elements

  - 1 ${type} with 5 sentences of text. The first sentence tells the user that they will be learning about ${skillPrompt.topic} in this lesson. The second sentence should introduce ${skillPrompt.topic} in simple terms to the user. The third sentence introduces to the user what each of the unique chapters in the lesson are (${skillPrompt.chapters.join(', ')}). The fourth sentence tells the user that they should experiment with the ${type} on their screen. Finally, the fifth sentence tells the use that it's okay if they don't understand it yet and to still experiment. ${getInteractionPrompt(type)}. This element should have comments or text explaining how it works.

  - 1 short answer question with 2 sentences of text. The first sentence should be a single open-ended question related to ${skillPrompt.topic} that gives the user a fundamental understanding of why they need to learn it. This question should have multiple possible answers since it's open-ended and the user should have to give it some thought. The second sentence should give the user a few examples of possible answers to push the in the right direction.
  `;

  // Unique Chapters.
  for (let i = 0; i < skillPrompt.chapters.length; ++i) {
    const chapter = skillPrompt.chapters[i];

    prompt += `
    CHAPTER ${i + 2}: '${chapter}' - 5-7 Elements

    - 1 ${type} with 2 sentences of text. The first sentence should tell the user that they'll be learning about ${chapter}. The second sentence should briefly describe ${chapter} in an easy-to-understand way and explain what it's used for. ${getInteractionPrompt(type)}. This element should have comments or text explaining how it works.

    - 3-5 ${type}s, each with 2-4 sentences of text. These will be used to teach the user about ${chapter} in an interactive way. Make sure to include relevant equations, formulas, syntaxes, definitions, theorems, etc. that are necessary to fully understand ${chapter}. Each element in this chapter should build on from the previous one to teach the user in small steps. ${getInteractionPrompt(type)}. This element should have a correct output that the user needs to get to move onto the next element.
    
    - 1 ${type} summative assessment with 2 sentences of text. The first sentence should tell the user that now that they know about ${chapter}, it's time to demonstrate their knowledge by completing the assessment. The second sentence should explain the assessment's instructions to the user. ${getInteractionPrompt(type)}. This element should have a correct output that the user needs to get to move onto the next chapter.
    `;
  }

  // Recap.
  prompt += `
  CHAPTER ${skillPrompt.chapters.length + 2}: 'Recap' - ${1 + skillPrompt.chapters.length} Elements

  - 1 ${type} with 2 sentences of text. The first sentence should congratulate the user for finishing the lesson. The second sentence should lead into a quick recap of the lesson, which will be broken into several paragraphs. ${getInteractionPrompt(type)}. This element should have comments or text explaining how it works.

  ${skillPrompt.chapters.map((chapter) => {
    return `
    - 1 ${type} with 1 sentence of text. The sentence should should be a quick recap of ${chapter}. Don't go into too much detail, just say enough to keep the information fresh in the user's brain. ${getInteractionPrompt(type)}. This element should have comments or text explaining how it works.
    `;
  })}
  `;

  // Exit Ticket.
  prompt += `
  CHAPTER ${skillPrompt.chapters.length + 3}: 'Exit Ticket' - 1 Element

  - 1 ${type} formative assessment with 2 sentences of text. The first sentence should introduce the assessment to the user, the assessment being a problem that the user has to solve about ${skillPrompt.topic}. The user should have to use everything that they learned in the lesson to solve the problem, which should include: ${skillPrompt.chapters.join(', ')}. The problem should require a solution useful enough that they may want to save it for future use. The user may have some creative freedom in how they solve the problem, but their solution must be accurate. The second sentence should tell the user what their solution should produce when it's correct so they know what they're aiming for. ${getInteractionPrompt(type)}. This element should have a correct output that the user needs to get to move onto the next section.
  `;

  return prompt;
}

function getInteractionPrompt(type: InteractionType): string {
  switch (type) {
    case InteractionType.Drawing:
      return  `Create a drawing environment with this element.`;
      
    case InteractionType.Graph:
      return  `Create a graph environment with this element.`;
      
    case InteractionType.DAW:
      return  `Create a DAW environment with this element.`;
      
    case InteractionType.Codespace:
      return  `Create a codespace environment with this element. The codespace needs a defined programming language and file content to demonstrate whatever concept is being taught.`;
      
    case InteractionType.Engine:
      return  `Create an engine environment with this element.`;
  }
}

async function generateSkillPractice(skillPrompt: SkillPrompt): Promise<types.Practice> {
  const response = '';
  
  return JSON.parse(response ?? '') as types.Practice;
}

function getExampleInput(type: InteractionType): string {
  switch (type) {
    case InteractionType.Drawing:
      return  `TOPIC:
              The Principles of Design

              CHAPTERS:
              Introduction, Balance, Contrast, Emphasis, Movement, Rhythm, Hierarchy, White Space, Unity, Variety, Alignment, Proportion, Repetition, Recap, Exit Ticket`;
      
    case InteractionType.Graph:
      return  `TOPIC:
              The Distance Formula

              CHAPTERS:
              Introduction, The Pythagorean Theorem, Distance Between 2D Points, Distance Between 3D Points, Recap, Exit Ticket`;
      
    case InteractionType.DAW:
      return  `TOPIC:
              Y

              CHAPTERS:
              Introduction, X, Recap, Exit Ticket`;
      
    case InteractionType.Codespace:
      return  `TOPIC:
              C# Variables

              CHAPTERS:
              Introduction, Numeric Types, Alphanumeric Types, Logical Types, Recap, Exit Ticket`;
      
    case InteractionType.Engine:
      return  `TOPIC:
              Unity Particle Systems

              CHAPTERS:
              Introduction, Particle System Component, Particle System Modules, Scripting Particle Systems, Recap, Exit Ticket`;
  }
}

async function getExampleLearnOutput(type: InteractionType): Promise<types.Learn> {
  switch (type) {
    case InteractionType.Drawing:
      return {} as types.Learn;
      
    case InteractionType.Graph:
      return {} as types.Learn;
      
    case InteractionType.DAW:
      return {} as types.Learn;
      
    case InteractionType.Codespace:
      return {} as types.Learn;
      
    case InteractionType.Engine:
      return {} as types.Learn;
  }
}
