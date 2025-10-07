'use client'

import { InteractionPackage, InteractionProps } from '@/app/lib/types';
import { Type } from '@google/genai';

export type InteractionType = {
  placeholder: boolean
};

const defaultValue: InteractionType = {
  placeholder: false
}

const schema = {
  type: Type.OBJECT,
  properties: {

  },
  required: [

  ],
  propertyOrdering: [

  ]
};

function Component({ elementID, isDisabled, mode }: InteractionProps) {
  return (
    <iframe
      className="fullscreenInteraction"
      src="https://editor.godotengine.org/releases/latest/"
    ></iframe>
  );
}

const interaction: InteractionPackage = {
  id: "engine",
  prettyName: "Engine",
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
