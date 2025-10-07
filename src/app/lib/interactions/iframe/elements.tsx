'use client'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { ComponentMode, InteractionProps } from '@/app/lib/types';
import * as helpers from '@/app/lib/helpers';

type IFrame = {
  source: string
};

export default function IFrame({ elementID, isDisabled, mode }: InteractionProps) {
  const [ source, setSource ] = useState(helpers.getInteractionValue<IFrame>(elementID).source);

  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      <iframe
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        className="fullscreenInteraction"
        src={source}
      ></iframe>

      {mode == ComponentMode.Edit && (
        <TextField
          label="Source"
          name="source"
          autoComplete="off"
          disabled={isDisabled}
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            helpers.getInteractionValue<IFrame>(elementID).source = e.target.value;
          }}
        />
      )}
    </Box>
  );
}
