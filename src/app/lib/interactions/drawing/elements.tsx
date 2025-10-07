'use client'

import Box from '@mui/material/Box';
import { InteractionProps } from '@/app/lib/types';

type Drawing = {
  placeholder: boolean
};

export default function Drawing({ elementID, isDisabled, mode }: InteractionProps) {
  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      
    </Box>
  );
}
