'use client'

import Box from '@mui/material/Box';
//import Atrament from 'atrament';
import { InteractionPackage, InteractionProps } from '@/app/lib/types';
import { Type } from '@google/genai';
import { Brush } from '@mui/icons-material';

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

function Component(props: InteractionProps) {
  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      
    </Box>
  );
}

const interaction: InteractionPackage = {
  id: "drawing",
  prettyName: "Drawing",
  category: "Art",
  icon: Brush,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
