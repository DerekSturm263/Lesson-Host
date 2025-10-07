'use client'

import Box from '@mui/material/Box';
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
    <Box
      sx={{ flexGrow: 1 }}
    >
      
    </Box>
  );
}

const interaction: InteractionPackage = {
  id: "daw",
  prettyName: "Digital Audio Workstation",
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
