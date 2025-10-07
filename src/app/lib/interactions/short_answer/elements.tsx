'use client'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import submit from "./functions";
import { useState } from 'react';
import { ComponentMode, InteractionProps, InteractionPackage } from "@/app/lib/types";
import { Type } from '@google/genai';
import * as helpers from "@/app/lib/helpers";

export type InteractionType = {
  correctAnswer: string | undefined
};

const defaultValue: InteractionType = {
  correctAnswer: undefined
}

const schema = {
  type: Type.OBJECT,
  properties: {
    correctAnswer: {
      type: Type.STRING
    }
  },
  propertyOrdering: [
    "correctAnswer"
  ]
};

function Component({ elementID, isDisabled, mode }: InteractionProps) {
  const [ correctAnswer, setCorrectAnswer ] = useState(helpers.getInteractionValue<InteractionType>(elementID).correctAnswer);

  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      <TextField
        label="Write your response here. Press enter to submit"
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        name="response"
        autoComplete="off"
        disabled={isDisabled}
        onSubmit={(e) => submit(e, elementID)}
      />

      <Button
        variant="contained"
      >
        Submit
      </Button>

      {mode == ComponentMode.Edit && (
        <TextField
          label="Correct Answer"
          name="correctAnswer"
          autoComplete="off"
          disabled={isDisabled}
          value={correctAnswer}
          onChange={(e) => {
            setCorrectAnswer(e.target.value)
            helpers.getInteractionValue<InteractionType>(elementID).correctAnswer = e.target.value;
          }}
        />
      )}
    </Box>
  );
}

const interaction: InteractionPackage = {
  id: "shortAnswer",
  prettyName: "Short Answer",
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
