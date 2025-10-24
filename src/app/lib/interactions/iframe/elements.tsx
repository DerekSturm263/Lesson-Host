'use client'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { ComponentMode, InteractionPackage, InteractionProps } from '@/app/lib/types';
import { Type } from '@google/genai';
import * as helpers from '@/app/lib/helpers';

export type InteractionType = {
  source: string
};

const defaultValue: InteractionType = {
  source: ""
}

const schema = {
  type: Type.OBJECT,
  properties: {
    source: {
      type: Type.STRING
    }
  },
  required: [
    "source"
  ],
  propertyOrdering: [
    "source"
  ]
};

function Component(props: InteractionProps) {
  const [ source, setSource ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).source);

  return (
    <Stack
      sx={{ flexGrow: 1 }}
    >
      {props.mode == ComponentMode.Edit && (
        <TextField
          label="Source"
          name="source"
          autoComplete="off"
          disabled={props.isDisabled}
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            helpers.getInteractionValue<InteractionType>(props.elementID).source = e.target.value;
          }}
        />
      )}
      
      <iframe
        id={`interaction${helpers.getAbsoluteIndex(props.elementID)}`}
        className="fullscreenInteraction"
        src={source}
      ></iframe>
    </Stack>
  );
}

const interaction: InteractionPackage = {
  id: "iframe",
  prettyName: "IFrame",
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
