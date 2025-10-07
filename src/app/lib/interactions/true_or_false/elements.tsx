'use client'

import Box from '@mui/material/Box';
import submit from './functions';
import { useState } from 'react';
import { ComponentMode, InteractionProps } from '@/app/lib/types';
import * as helpers from '@/app/lib/helpers';

type TrueOrFalse = {
  isCorrect: boolean
};

export default function TrueOrFalse({ elementID, isDisabled, mode }: InteractionProps) {
  const [ isCorrect, setIsCorrect ] = useState(helpers.getInteractionValue<TrueOrFalse>(elementID).isCorrect);

  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      <form
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        className='multipleOptions'
        action={(e) => submit(e, elementID)}
      >
        <label>
          <input
            type="radio"
            name="response"
            id="true"
            value="true"
            disabled={isDisabled}
            checked={mode == ComponentMode.Edit && isCorrect}
            onChange={(e) => {
              setIsCorrect(true);

              if (mode == ComponentMode.Edit) {
                helpers.getInteractionValue<TrueOrFalse>(elementID).isCorrect = true;
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
            disabled={isDisabled}
            checked={mode == ComponentMode.Edit && !isCorrect}
            onChange={(e) => {
              setIsCorrect(false);
              
              if (mode == ComponentMode.Edit) {
                helpers.getInteractionValue<TrueOrFalse>(elementID).isCorrect = false;
              }
            }}
          />

          False
        </label>

        <input
          type="submit"
          name="submit"
          disabled={isDisabled}
        />
      </form>
    </Box>
  );
}
