import generateText from "@/app/lib/ai/functions";
import { ModelType, Verification } from "@/app/lib/ai/types";
import { ElementID } from "@/app/lib/types";
import { FormEvent } from "react";
import { InteractionType } from "./elements";
import { complete, readAloud } from "@/app/lib/functions";
import * as helpers from '@/app/lib/helpers';

// Todo: Try making function and have return bool for if correct or not
export default async function submit(formData: FormEvent<HTMLDivElement>, elementID: ElementID) {
  /*console.log(JSON.stringify(formData.get('response')));

  helpers.setThinking(elementID, true);
  const feedback = await verify(helpers.getElement(elementID).text, formData.get('response')?.toString().toLowerCase() == "true", helpers.getInteractionValue<InteractionType>(elementID));
  helpers.setText(elementID, feedback.feedback);
  helpers.setThinking(elementID, false);

  readAloud(elementID);

  if (feedback.isValid) {
    window.dispatchEvent(new CustomEvent(`updateAssessment${helpers.getAbsoluteIndex(elementID)}`, { detail: true }));
    complete(elementID);
  }*/
}

async function verify(question: string, userResponse: boolean, value: InteractionType): Promise<Verification> {
  const isCorrect = userResponse == value.isCorrect;

  const response = await generateText({
    model: ModelType.Quick,
    prompt:
    `TASK:
    ${isCorrect ?
      `The student's response was correct. Congratulate the student on getting their answer right. Review how the QUESTION was solved and why the user's RESPONSE was correct.` :
      `The student's response aws incorrect. View the student's RESPONSE and the original QUESTION and give the student feedback on why their answer isn't correct. Give the student some guidance on how they should work towards getting the CORRECT ANSWER.`}

    QUESTION:
    ${question}

    RESPONSE:
    ${userResponse}

    CORRECT ANSWER:
    ${value.isCorrect}`,
    systemInstruction: `You are a high school tutor. You evaluate a student's RESPONSE to a true/false QUESTION and give them proper FEEDBACK based on whether or not their response is correct. You will be told whether or not the response is correct, all you need to do is give the FEEDBACK.`
  });

  return {
    isValid: isCorrect,
    feedback: response
  };
}
