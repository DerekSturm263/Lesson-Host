import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import { responseSchema } from './schemas';

const ai = new GoogleGenAI({});

const textModel = 'gemini-2.5-flash-lite';
const ttsModel = 'gemini-2.5-flash-preview-tts';

const globalSystemInstruction =
    `Your response should read like it's being spoken out loud by a professional. The audience is a Video Game Production student. Assume that they have no prior knowledge on the subject since they are a beginner. When using complex or technical jargon, make sure to define it immediately in easy-to-understand terms. Assume that the user reads at a 10th grade level. Keep your response as concise as possible without sacrificing usefulness.

    Wherever applicable, use technical documentation techniques. These should be included to make the text easy to follow and to highlight important information, terminology, formulas, syntaxes, etc. When doing this, use HTML tags, not Markdown formatting. Your response will be directly inserted into a webpage, so it needs to be compatible with HTML. Remember that you need to sound like someone speaking, so don't include tables, headers, or other tags that may seem unnatural for spoken language. Here are some valid tags to use:
    - Bold Text <b></b>
    - Italics <i></i>
    - Underlined Text <u></u>
    - Bulleted Lists <ul><li></li></ul>
    - Numbered Lists <ol><li></li></ul>
    - Line Breaks <br/>
    - Code blocks should always be surrounded by <code></code> tags.

    Math formulas, equations, and variables should always be written using a slightly modified LATEX format that uses two dollar signs ($$) instead of one ($).
                
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

export async function verifyShortAnswer(question: string, userResponse: string): Promise<string> {
    const response = await ai.models.generateContent({
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
            responseSchema: responseSchema,
            systemInstruction: [
                `You are a high school tutor. You determine whether a student's RESPONSE to a QUESTION is VALID or not while giving them proper FEEDBACK.
          
                - If their response is VALID (true), your FEEDBACK should congratulate the user on getting it right and then explain why it's correct.
                - If their answer is NOT VALID (false), your FEEDBACK should tell the user that their answer isn't quite right and then explain why. Afterwards, you should re-explain the original QUESTION in friendlier terms with new examples.
                
                ${globalSystemInstruction}`
            ],
            safetySettings: safetySettings
        }
    });

    return response.text ?? '';
}

export async function verifyCodespace(instructions: string, files: string[], result: {success: boolean, output: string}, correctOutput: string, language: string): Promise<{isValid: boolean, feedback: string}> {
    let isValid = false;
    
    let contents = '';

    if (!result.success) {
        // Code didn't compile
        isValid = false;

        contents =
            `TASK:
            The student's code did not compile. View the attached FILES and USER'S OUTPUT and give the student feedback on what they should do to make their code compile. Afterwards, review the original INSTRUCTIONS with the student to make sure they understand what they're supposed to do.

            FILES:
            ${JSON.stringify(files)}

            USER'S OUTPUT:
            ${result.output}

            INSTRUCTIONS:
            ${instructions}`;
    } else if (!correctOutput) {
        // Code compiled, there was no correct output
        isValid = true;

        contents =
            `TASK:
            The code compiled and ran successfully, although this code wasn't made by the student. It was just an example for the student to run and examine the output. View the attached FILES and explain to the student how they tie back to the INSTRUCTIONS to produce the OUTPUT. Keep your explanation as short as possible, it just needs to introduce the user to the topic.

            FILES:
            ${JSON.stringify(files)}

            INSTRUCTIONS:
            ${instructions}

            OUTPUT:
            ${result.output}`;
    } else if (result.output != correctOutput) {
        // Code compiled, but didn't match the correct output
        isValid = false;

        contents =
            `TASK:
            The student's code compiled successfully, but didn't match the CORRECT OUTPUT. View the attached FILES and USER'S OUTPUT and give the student feedback on what they should do to make their code match the CORRECT OUTPUT. Review the original INSTRUCTIONS with the student and make sure your feedback is accurate. Your feedback should guide them in the right direction without directly telling them exactly what they need to do. If necessary, try using simpler terms and friendlier language than the original INSTRUCTIONS.

            CORRECT OUTPUT:
            ${correctOutput}

            FILES:
            ${JSON.stringify(files)}

            USER'S OUTPUT:
            ${result.output}

            INSTRUCTIONS:
            ${instructions}`;
    } else {
        // Code compiled and matched the correct output
        isValid = true;

        contents =
            `TASK:
            The student's code compiled successfully and matched the CORRECT OUTPUT. Congratulate the student on getting their code right. Review their FILES to recap how they successully follow the INSTRUCTIONS. Finally, give the student feedback on how they could improve their solution even further and advice on how to improve their coding skills in general.
      
            CORRECT OUTPUT:
            ${correctOutput}

            FILES:
            ${JSON.stringify(files)}

            INSTRUCTIONS:
            ${instructions}`;
    }

    const response = await ai.models.generateContent({
        model: textModel,
        contents: contents,
        config: {
            temperature: 0,
            systemInstruction: [
                `You are a computer science tutor for a ${language} programming class. You evaluate one or more of a student's code FILES and give them proper FEEDBACK based on whether or not their code produces a given output. You will be told whether or not the code works and matches the output, all you need to do is give the FEEDBACK.

                ${globalSystemInstruction}`
            ],
            safetySettings: safetySettings
        }
    });

    return {
        isValid: isValid,
        feedback : response.text ?? ''
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

/*export async function readAloudText(text: string): Promise<> {
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

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? '';
    const audioBuffer = Buffer.from(data, 'base64');

    return response;
}*/
