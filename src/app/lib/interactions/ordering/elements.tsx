'use client'

import Box from '@mui/material/Box';
import { useState } from 'react';
import { InteractionProps } from "../../types";
import * as helpers from "../../helpers";

type Ordering = {
  correctOrder: string[]
};

export default function Ordering({ elementID, isDisabled, mode }: InteractionProps) {
  const [ items, setItems ] = useState(helpers.getInteractionValue<Ordering>(elementID).correctOrder);

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
