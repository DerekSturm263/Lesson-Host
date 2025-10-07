'use client'

import Box from '@mui/material/Box';
import { InteractionProps } from '@/app/lib/types';
import { loadGraph } from '@/app/lib/functions';

type Graph = {
  type: string,
  fileName: string
};

export default function Graph({ elementID, isDisabled, mode }: InteractionProps) {
  return (
    <Box
      sx={{ flexGrow: 1 }}
      onLoad={(e) => loadGraph(elementID)}
    ></Box>
  );
}
