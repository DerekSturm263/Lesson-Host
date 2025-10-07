'use client'

import { InteractionProps } from '@/app/lib/types';

type Engine = {
  placeholder: boolean
};

function Engine({ elementID, isDisabled, mode }: InteractionProps) {
  return (
    <iframe
      className="fullscreenInteraction"
      src="https://editor.godotengine.org/releases/latest/"
    ></iframe>
  );
}

export default Engine;
