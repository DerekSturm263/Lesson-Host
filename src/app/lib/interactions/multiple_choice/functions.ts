import generateText from "@/app/lib/ai/functions";
import { ModelType, Verification } from "@/app/lib/ai/types";
import { InteractionType, MultipleChoiceItem, ChoiceType } from "./elements";

export default async function verify(question: string, userResponse: MultipleChoiceItem[], value: InteractionType): Promise<Verification> {
  const isValid = false;
  const contents = '';

  // if (value.choiceType == ChoiceType.Single) {
  //   if (userResponse[0] == value.items.filter(item => item.isCorrect)[0]) {
  //     // User got the single correct answer.

  //   } else {
  //     // User did not get the single correct answer.

  //   }
  // } else if (value.choiceType == ChoiceType.MultipleNeedsAll) {
  //   if () {
  //     // User got all the correct answers and needed all of them.

  //   } else {
  //     // User didn't get all the correct answers and needed all of them.
      
  //   }
  // } else {
  //   if () {
  //     // User got at least one correct answer and didn't need all of them.

  //   } else {
  //     // User didn't get any correct answers and didn't need all of them.
      
  //   }
  // }

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
