import generateText, { ModelType, Verification, verificationSchema } from "@/app/lib/ai";
import { ElementID } from "@/app/lib/types";
import { FormEvent } from "react";
import { InteractionType } from "./elements";
import { complete, readAloud } from "@/app/lib/functions";
import * as helpers from '@/app/lib/helpers';

export default async function submit(formData: FormEvent<HTMLDivElement>, elementID: ElementID) {
  helpers.setThinking(elementID, true);
  const feedback = await verify(helpers.getElement(elementID).text, formData.target.value ?? '', helpers.getInteractionValue<InteractionType>(elementID));
  helpers.setText(elementID, feedback.feedback);
  helpers.setThinking(elementID, false);

  readAloud(elementID);

  if (feedback.isValid) {
    window.dispatchEvent(new CustomEvent(`updateAssessment${helpers.getAbsoluteIndex(elementID)}`, { detail: true }));
    complete(elementID);
  }
}

async function verify(question: string, userResponse: string, value: InteractionType): Promise<Verification> {
  let response: string;
  
  if (value.correctAnswer == null || value.correctAnswer == "") {
    response = await generateText({
      model: ModelType.Quick,
      prompt: 
      `TASK:
      Decide whether a given RESPONSE is a valid answer to a given QUESTION and give appropriate feedback.
      
      QUESTION:
      ${question}

      RESPONSE:
      ${userResponse}`,
      mimeType: 'application/json',
      schema: verificationSchema,
      systemInstruction:
      `You are a high school tutor. You determine whether a student's RESPONSE to a QUESTION is VALID or not while giving them proper FEEDBACK.
        
      - If their response is VALID (true), your FEEDBACK should congratulate the user on getting it right and then explain why it's correct.
      - If their answer is NOT VALID (false), your FEEDBACK should tell the user that their answer isn't quite right and then explain why. Afterwards, you should re-explain the original QUESTION in friendlier terms with new examples.`
    });
    
    return JSON.parse(response ?? '') as Verification;
  } else {
    const isValid = userResponse == value.correctAnswer;

    response = await generateText({
      model: ModelType.Quick,
      prompt: isValid ?
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
      ${value.correctAnswer}`,
      systemInstruction: `You are a high school tutor. You evaluate a student's RESPONSE to a short answer QUESTION and give them proper FEEDBACK based on whether or not their response matches the CORRECT ANSWER. You will be told whether or not the response is correct, all you need to do is give the FEEDBACK.`
    });
    
    return {
      isValid: isValid,
      feedback: response
    };
  }
}
