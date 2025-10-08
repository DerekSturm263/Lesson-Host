'use client'

import Box from '@mui/material/Box';
import verify from './functions';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import { ComponentMode, InteractionPackage, InteractionProps } from '@/app/lib/types';
import { Type } from '@google/genai';
import * as helpers from '@/app/lib/helpers';

export type InteractionType = {
  isCorrect: boolean
};

const defaultValue: InteractionType = {
  isCorrect: true
}

const schema = {
  type: Type.OBJECT,
  properties: {
    isCorrect: {
      type: Type.BOOLEAN
    }
  },
  required: [
    "isCorrect"
  ],
  propertyOrdering: [
    "isCorrect"
  ]
};

function Component(props: InteractionProps) {
  const [ isCorrect, setIsCorrect ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).isCorrect);

  async function submit() {
    helpers.setThinking(props.elementID, true);
    window.dispatchEvent(new CustomEvent('updatePagination', { detail: false }));

    const feedback = await verify(helpers.getElement(props.elementID).text, isCorrect, helpers.getInteractionValue<InteractionType>(props.elementID));
    props.setText(feedback.feedback);
    helpers.setThinking(props.elementID, false);
    window.dispatchEvent(new CustomEvent('updatePagination', { detail: true }));

    if (feedback.isValid) {
      window.dispatchEvent(new CustomEvent(`updateInteraction`, { detail: true }));
      helpers.completeElement(props.elementID);
    }
  }

  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      <FormControl
        id={`interaction${helpers.getAbsoluteIndex(props.elementID)}`}
        className='multipleOptions'
        onSubmit={(e) => submit()}
      >
        <label>
          <input
            type="radio"
            name="response"
            id="true"
            value="true"
            disabled={props.isDisabled}
            checked={props.mode == ComponentMode.Edit && isCorrect}
            onChange={(e) => {
              setIsCorrect(true);

              if (props.mode == ComponentMode.Edit) {
                helpers.getInteractionValue<InteractionType>(props.elementID).isCorrect = true;
              }
            }}
          />

          True
        </label>

        <label>
          <input
            type="radio"
            name="response"
            id="false"
            value="false"
            disabled={props.isDisabled}
            checked={props.mode == ComponentMode.Edit && !isCorrect}
            onChange={(e) => {
              setIsCorrect(false);
              
              if (props.mode == ComponentMode.Edit) {
                helpers.getInteractionValue<InteractionType>(props.elementID).isCorrect = false;
              }
            }}
          />

          False
        </label>

        <input
          type="submit"
          name="submit"
          disabled={props.isDisabled}
        />
      </FormControl>
    </Box>
  );
}

const interaction: InteractionPackage = {
  id: "trueOrFalse",
  prettyName: "True or False",
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
