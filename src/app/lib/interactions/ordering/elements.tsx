'use client'

import Box from '@mui/material/Box';
import { useState } from 'react';
import { InteractionPackage, InteractionProps } from "../../types";
import { Type } from '@google/genai';
import * as helpers from "../../helpers";

export type InteractionType = {
  correctOrder: string[]
};

const defaultValue: InteractionType = {
  correctOrder: [
    "New Item"
  ]
}

const schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      minItems: 2,
      maxItems: 6
    }
  },
  required: [
    "items"
  ],
  propertyOrdering: [
    "items"
  ]
};

function Component(props: InteractionProps) {
  const [ items, setItems ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).correctOrder);

  /*if (mode != types.ComponentMode.Edit) {
    setItems(items.sort(item => Math.random() - 0.5));
  }*/

  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      {/*<Reorder>
        {items.map((item, index) => (
          <li
            key={index}
          >
            {item}
          </li>
        ))}
      </Reorder>*/}
    </Box>
  );
}

const interaction: InteractionPackage = {
  id: "ordering",
  prettyName: "Ordering",
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
