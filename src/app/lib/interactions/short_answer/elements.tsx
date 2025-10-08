'use client'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import verify from "./functions";
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

function Component(props: InteractionProps) {
  const [ correctAnswer, setCorrectAnswer ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).correctAnswer);
  const [ userResponse, setUserResponse ] = useState("");

  async function submit() {
    helpers.setThinking(props.elementID, true);
    window.dispatchEvent(new CustomEvent('updatePagination', { detail: false }));

    const feedback = await verify(helpers.getElement(props.elementID).text, userResponse, helpers.getInteractionValue<InteractionType>(props.elementID));
    props.setText(feedback.feedback);
    helpers.setThinking(props.elementID, false);
    window.dispatchEvent(new CustomEvent('updatePagination', { detail: true }));

    if (feedback.isValid) {
      helpers.completeElement(props.elementID);
    }
  }

  return (
    <Box
      sx={{ flexGrow: 1, alignContent: 'center' }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ marginLeft: '150px', marginRight: '150px' }}
      >
        <TextField
          label="Write your response here"
          name="response"
          autoComplete="off"
          disabled={false}
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        <Button
          variant="contained"
          onClick={(e) => submit()}
          sx={{ width: '120px' }}
        >
          Submit
        </Button>
      </Stack>

      {props.mode == ComponentMode.Edit && (
        <TextField
          label="Correct Answer"
          name="correctAnswer"
          autoComplete="off"
          value={correctAnswer}
          onChange={(e) => {
            const value = e.target.value === "" ? null : e.target.value;
            setCorrectAnswer(value);
            helpers.getInteractionValue<InteractionType>(props.elementID).correctAnswer = value;
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
