'use client'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import submit from "./functions";
import { useState } from 'react';
import { ElementID, ComponentMode, InteractionProps } from "../../types";
import * as helpers from "../../helpers";

type ShortAnswer = {
  correctAnswer: string | undefined
};

export default function ShortAnswer({ elementID, isDisabled, mode }: InteractionProps) {
  const [ correctAnswer, setCorrectAnswer ] = useState(helpers.getInteractionValue<ShortAnswer>(elementID).correctAnswer);

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

      <Button>
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
            helpers.getInteractionValue<ShortAnswer>(elementID).correctAnswer = e.target.value;
          }}
        />
      )}
    </Box>
  );
}
