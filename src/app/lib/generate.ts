'use server'

import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import * as schemas from './schemas';
import * as types from './types'

const ai = new GoogleGenAI({});

const textModel = 'gemini-2.5-flash-lite';
const ttsModel = 'gemini-2.5-flash-preview-tts';

const globalSystemInstruction =
  `Your response should read like it's being spoken out loud by a professional. The audience is a Video Game Production student. Assume that they have no prior knowledge on the subject since they are a beginner. When using complex or technical jargon, make sure to define it immediately in easy-to-understand terms. Assume that the user reads at a 10th grade level. Keep your response as concise as possible without sacrificing usefulness.

  Wherever applicable, use technical documentation techniques. These should be included to make the text easy to follow and to highlight important information, terminology, formulas, syntaxes, etc. When doing this, use Markdown formatting. Remember that you need to sound like someone speaking, so don't include tables, headers, or other tags that may seem unnatural for spoken language. Here are some valid techniques to use:
  - Bold Text
  - Italics
  - Ordered Lists
  - Unordered Lists

  Code blocks should always be surrounded by triple backticks. Short pieces of code (including types and keywords) should always be surrounded by single backticks.
  Math formulas, equations, and variables should always be written using LATEX formatting.
                
  Do not include any greetings or salutations with your response.`;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  }
];

type Verification = {
  isValid: boolean;
  feedback: string;
};

export async function verifyShortAnswer(question: string, userResponse: string, value: types.ShortAnswer): Promise<Verification> {
  let response;
  
  if (value.correctAnswer == null) {
    response = await ai.models.generateContent({
      model: textModel,
      contents: 
        `TASK:
        Decide whether a given RESPONSE is a valid answer to a given QUESTION and give appropriate feedback.
      
        QUESTION:
        ${question}

        RESPONSE:
        ${userResponse}`
      ,
      config: {
        temperature: 0,
        responseMimeType: 'application/json',
        responseSchema: schemas.responseSchema,
        systemInstruction: [
          `You are a high school tutor. You determine whether a student's RESPONSE to a QUESTION is VALID or not while giving them proper FEEDBACK.
        
          - If their response is VALID (true), your FEEDBACK should congratulate the user on getting it right and then explain why it's correct.
          - If their answer is NOT VALID (false), your FEEDBACK should tell the user that their answer isn't quite right and then explain why. Afterwards, you should re-explain the original QUESTION in friendlier terms with new examples.
        
          ${globalSystemInstruction}`
        ],
        safetySettings: safetySettings
      }
    });
    
    return JSON.parse(response.text ?? '') as Verification;
  } else {
    const isValid = userResponse == value.correctAnswer;
    const contents = isValid ?
      `TASK:
      The student's response was correct. Congratulate the student on getting their answer right. Review their RESPONSE to recap how the QUESTION was solved and why it was correct.

      QUESTION:
      ${question}

      RESPONSE:
      ${userResponse}
      
      CORRECT ANSWER:
      ${value.correctAnswer}` :
      `TASK:
      The student's response was incorrect. View the student's RESPONSE and the original QUESTION and give the student feedback on why their answer isn't correct. Give the student some guidance on how they should work towards getting the CORRECT ANSWER.

      QUESTION:
      ${question}

      RESPONSE:
      ${userResponse}
      
      CORRECT ANSWER:
      ${value.correctAnswer}`;

    response = await ai.models.generateContent({
      model: textModel,
      contents: contents,
      config: {
        temperature: 0,
        systemInstruction: [
          `You are a high school tutor. You evaluate a student's RESPONSE to a short answer QUESTION and give them proper FEEDBACK based on whether or not their response matches the CORRECT ANSWER. You will be told whether or not the response is correct, all you need to do is give the FEEDBACK.
        
          ${globalSystemInstruction}`
        ],
        safetySettings: safetySettings
      }
    });
    
    return {
      isValid: isValid,
      feedback: response.text ?? ''
    };
  }
}

export async function verifyMultipleChoice(question: string, userResponse: string[], value: types.MultipleChoice): Promise<Verification> {
  let isValid = false;
  let contents = '';
  
  /*if (value.type == types.MultipleChoiceType.Radio) {
    if () {
      // One correct answer, radio, correct.

    } else if () {
      // Multiple correct answers, radio, correct.

    } else if () {
      // One correct answer, radio, incorrect.

    } else if () {
      // Multiple correct answers, radio, incorrect.
    
    }
  } else {
    if () {
      // One correct answer, checkbox, correct.

    } else if () {
      // Multiple correct answers, checkbox, correct.

    } else if () {
      // One correct answer, checkbox, incorrect.

    } else if () {
      // Multiple correct answers, checkbox, incorrect.
    
    }
  }*/

  const response = await ai.models.generateContent({
    model: textModel,
    contents: contents,
    config: {
      temperature: 0,
      systemInstruction: [
        `You are a high school tutor. You evaluate a student's SELECTIONS on a multiple choice QUESTION and give them proper FEEDBACK based on whether or not their selections are correct. You will be told whether or not the student is correct, all you need to do is give the FEEDBACK.
        
        ${globalSystemInstruction}`
      ],
      safetySettings: safetySettings
    }
  });

  return { isValid: isValid, feedback: response.text ?? '' } as Verification
}

export async function verifyTrueOrFalse(question: string, userResponse: boolean, value: types.TrueOrFalse): Promise<Verification> {
  const isCorrect = userResponse == value.isCorrect;

  const response = await ai.models.generateContent({
    model: textModel,
    contents:
    `TASK:
    ${isCorrect ?
      `The student's response was correct. Congratulate the student on getting their answer right. Review their RESPONSE to recap how the QUESTION was solved and why it was correct.` :
      `The student's response aws incorrect. View the student's RESPONSE and the original QUESTION and give the student feedback on why their answer isn't correct. Give the student some guidance on how they should work towards getting the CORRECT ANSWER.`}

    QUESTION:
    ${question}

    RESPONSE:
    ${userResponse}

    CORRECT ANSWER:
    ${value.isCorrect}`,
    config: {
      temperature: 0,
      systemInstruction: [
        `You are a high school tutor. You evaluate a student's RESPONSE to a true/false QUESTION and give them proper FEEDBACK based on whether or not their response is correct. You will be told whether or not the response is correct, all you need to do is give the FEEDBACK.
        
        ${globalSystemInstruction}`
      ],
      safetySettings: safetySettings
    }
  });

  return { isValid: isCorrect, feedback: response.text ?? '' } as Verification
}

export async function verifyCodespace(instructions: string, content: string, result: types.CodeResult, value: types.Codespace): Promise<Verification> {
  let isValid = false;
  let contents = '';

  if (result.stderr != null) {
    // Code didn't compile
    isValid = false;

    contents =
      `TASK:
      The student's code did not compile. View the attached FILE and ERROR(S) and give the student feedback on what they should do to make their code compile. Afterwards, review the original INSTRUCTIONS with the student to make sure they understand what they're supposed to do.

      FILE:
      ${content}

      ERROR(S):
      ${result.stderr}

      INSTRUCTIONS:
      ${instructions}`;
  } else if (!value.correctOutput) {
    // Code compiled, there was no correct output
    isValid = true;

    contents =
      `TASK:
      The code compiled and ran successfully, although this code wasn't made by the student. It was just an example for the student to run and examine the output. View the attached FILE and explain to the student how they tie back to the INSTRUCTIONS to produce the OUTPUT. Keep your explanation as short as possible, it just needs to introduce the user to the topic.

      FILE:
      ${content}

      INSTRUCTIONS:
      ${instructions}

      OUTPUT:
      ${result.stdout}`;
  } else if (result.stdout != value.correctOutput) {
    // Code compiled, but didn't match the correct output
    isValid = false;

    contents =
      `TASK:
      The student's code compiled successfully, but didn't match the CORRECT OUTPUT. View the attached FILE and USER'S OUTPUT and give the student feedback on what they should do to make their code match the CORRECT OUTPUT. Review the original INSTRUCTIONS with the student and make sure your feedback is accurate. Your feedback should guide them in the right direction without directly telling them exactly what they need to do. If necessary, try using simpler terms and friendlier language than the original INSTRUCTIONS.

      CORRECT OUTPUT:
      ${value.correctOutput}

      FILE:
      ${content}

      USER'S OUTPUT:
      ${result.stdout}

      INSTRUCTIONS:
      ${instructions}`;
  } else {
    // Code compiled and matched the correct output
    isValid = true;

    contents =
      `TASK:
      The student's code compiled successfully and matched the CORRECT OUTPUT. Congratulate the student on getting their code right. Review their FILE to recap how they successully followed the INSTRUCTIONS. Finally, give the student feedback on how they could improve their solution even further and advice on how to improve their coding skills in general.
      
      CORRECT OUTPUT:
      ${value.correctOutput}

      FILE:
      ${content}

      INSTRUCTIONS:
      ${instructions}`;
  }

  const response = await ai.models.generateContent({
    model: textModel,
    contents: contents,
    config: {
      temperature: 0,
      systemInstruction: [
        `You are a computer science tutor for a ${value.language} programming class. You evaluate one or more of a student's code FILE and give them proper FEEDBACK based on whether or not their code produces a given output. You will be told whether or not the code works and matches the output, all you need to do is give the FEEDBACK.

        ${globalSystemInstruction}`
      ],
      safetySettings: safetySettings
    }
  });

  return {
    isValid: isValid,
    feedback: response.text ?? ''
  };
}

export async function rephraseText(text: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: textModel,
    contents:
      `TASK:
      Rephrase a given TEXT. 
            
      TEXT:
      ${text}`,
    config: {
      temperature: 0,
      systemInstruction: [
        `You are an expert at rephrasing things in a more understandable way. When you rephrase things, it should become easier to understand, but not much longer. If it's possible to make it easier to understand while keeping it short, do so. Use new examples and friendlier language than the original text.
  
        ${globalSystemInstruction}`
      ],
      safetySettings: safetySettings
    }
  });

  return response.text ?? '';
}

/*export async function readTextAloud(text: string): Promise<Buffer<ArrayBufferLike>> {
    const response = await ai.models.generateContent({
        model: ttsModel,
        contents:
            `TASK:
            Say the given TEXT.
            
            TEXT:
            ${text}`,
        config: {
            temperature: 0.5,
            systemInstruction: [
                `You are a high school tutor. You say TEXT out loud for the user to listen to. You should always speak in a professional and engaging tone.`
            ],
            safetySettings: safetySettings,
            responseModalities: [ 'AUDIO' ],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: {
                        voiceName: "Kore"
                    }
                }
            }
        }
    });

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const audioBuffer = Buffer.from(data, 'base64');

    return audioBuffer;
}*/
