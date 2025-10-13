import { SchemaUnion, Type } from '@google/genai';

export enum ModelType {
  Smart = 'gemini-2.5-pro',
  Quick = 'gemini-2.5-flash-lite',
  QuickSpeed = 'gemini-2.5-flash-preview-tts'
}

export type Payload = {
  model: ModelType,
  prompt: string,
  mimeType?: string,
  schema?: SchemaUnion,
  systemInstruction?: string,
  overrideInstruction?: string
}

export type Verification = {
  isValid: boolean;
  feedback: string;
};

export const verificationSchema = {
  type: Type.OBJECT,
  properties: {
    isValid: {
      type: Type.BOOLEAN
    },
    feedback: {
      type: Type.STRING
    }
  },
  required: [
    "isValid",
    "feedback"
  ],
  propertyOrdering: [
    "isValid",
    "feedback"
  ]
};
