import generateText from "@/app/lib/ai/functions";
import { ModelType, Verification } from "@/app/lib/ai/types";
import { InteractionType } from "./elements";

export default async function verify(question: string, userResponse: string[], value: InteractionType): Promise<Verification> {
  let isValid = false;
  let contents = '';
  
  const correctAnswers = value.items.filter(item => item.isCorrect).map(item => item.value);
  /*if ((!value.choiceType && userResponse.some(item => correctAnswers.includes(item))) || areArraysEqual(userResponse, correctAnswers)) {
    // Got at least one right answer, and either doesn't need all correct or got them all correct.
    isValid = true;

    contents =
      `TASK:
      The student's selections were correct. Congratulate the student on getting their answer right. Review their SELECTION(S) to recap how the QUESTION was solved and why their selections were correct.

      QUESTION:
      ${question}

      SELECTION(S):
      ${userResponse.join(', ')}

      CORRECT ANSWER(S):
      ${correctAnswers.join(', ')}
      `;
  } else {
    // Didn't get any right answers.
    isValid = false;
    
    contents =
      `TASK:
      The student's selections were incorrect. View the student's SELECTION(S) and the original QUESTION and give the student feedback on why their selections aren't correct. Give the student some guidance on how they should work towards getting the CORRECT ANSWER(S).

      QUESTION:
      ${question}

      SELECTION(S):
      ${userResponse.join(', ')}

      CORRECT ANSWER(S):
      ${correctAnswers.join(', ')}
      `;
  }*/

  const response = await generateText({
    model: ModelType.Quick,
    prompt: contents,
    systemInstruction: `You are a high school tutor. You evaluate a student's SELECTIONS on a multiple choice QUESTION and give them proper FEEDBACK based on whether or not their selections are correct. You will be told whether or not the student is correct, all you need to do is give the FEEDBACK.`
  });

  return {
    isValid: isValid,
    feedback: response
  };
}

function areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length)
    return false;

  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i])
      return false;
  }

  return true;
}
