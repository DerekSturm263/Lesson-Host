'use client'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import submit from "./functions";
import { useState } from 'react';
import { ComponentMode, InteractionProps, InteractionPackage } from "@/app/lib/types";
import { Type } from '@google/genai';
import * as helpers from "@/app/lib/helpers";

export type InteractionType = {
  correctAnswer: string | null
};

const defaultValue: InteractionType = {
  correctAnswer: null
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
  const [ userResponse, setUserResponse ] = useState("");

  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      <Stack
        direction="row"
      >
        <TextField
          label="Write your response here. Press enter to submit"
          id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
          name="response"
          autoComplete="off"
          disabled={isDisabled}
          onChange={(e) => setUserResponse(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={(e) => submit(userResponse, elementID)}
        >
          Submit
        </Button>
      </Stack>

      {mode == ComponentMode.Edit && (
        <TextField
          label="Correct Answer"
          name="correctAnswer"
          autoComplete="off"
          disabled={isDisabled}
          value={correctAnswer}
          onChange={(e) => {
            const value = e.target.value === "" ? null : e.target.value;
            setCorrectAnswer(value);
            helpers.getInteractionValue<InteractionType>(elementID).correctAnswer = value;
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
