'use client'

import Box from '@mui/material/Box';
//import Desmos from 'desmos';
import { InteractionPackage, InteractionProps } from '@/app/lib/types';
import { Type } from '@google/genai';
import { createElement } from 'react';

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
  /*const elt = createElement('div');

  const calculator = Desmos.GraphingCalculator(elt);
  calculator.setExpression({ id: "", latex: "y=x^2" });*/

  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      
    </Box>
  );
}

const interaction: InteractionPackage = {
  id: "graph",
  prettyName: "Graph",
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
