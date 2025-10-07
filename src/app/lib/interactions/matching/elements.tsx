'use client'

import Box from '@mui/material/Box';
import { useState } from 'react';
import { InteractionProps } from "@/app/lib/types";
import * as helpers from "@/app/lib/helpers";

type MatchingItem = {
  leftSide: string,
  rightSide: string
};

type Matching = {
  items: MatchingItem[]
};

export default function Matching({ elementID, isDisabled, mode }: InteractionProps) {
  const [ items, setItems ] = useState(helpers.getInteractionValue<Matching>(elementID).items);
  
  //const shuffledItemsLeft = useState(items.map(item => item.leftSide).sort(item => Math.random() - 0.5))[0];
  //const shuffledItemsRight = useState(items.map(item => item.rightSide).sort(item => Math.random() - 0.5))[0];
  
  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      {/*<Reorder>
        {shuffledItemsLeft.map((item, index) => (
          <li
            key={index}
          >
            {item}
          </li>
        ))}
      </Reorder>

      <Reorder>
        {shuffledItemsRight.map((item, index) => (
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
