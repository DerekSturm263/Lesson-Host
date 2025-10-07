export async function submitShortAnswer(formData: FormEvent<HTMLDivElement>, elementID: types.ElementID) {
  /*helpers.setThinking(elementID, true);
  const feedback = await verifyShortAnswer(helpers.getElement(elementID).text, formData.target.value ?? '', helpers.getInteractionValue<types.ShortAnswer>(elementID));
  helpers.setText(elementID, feedback.feedback);
  helpers.setThinking(elementID, false);

  readAloud(elementID);

  if (feedback.isValid) {
    window.dispatchEvent(new CustomEvent(`updateAssessment${helpers.getAbsoluteIndex(elementID)}`, { detail: true }));
    complete(elementID);
  }*/
}

export async function verifyShortAnswer(question: string, userResponse: string, value: types.ShortAnswer): Promise<Verification> {
  let response;
  
  if (value.correctAnswer == null || value.correctAnswer == "") {
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

