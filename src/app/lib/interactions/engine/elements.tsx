'use client'

import { InteractionProps } from '@/app/lib/types';

type Engine = {
  placeholder: boolean
};

export default function Engine({ elementID, isDisabled, mode }: InteractionProps) {
  return (
    <iframe
      className="fullscreenInteraction"
      src="https://editor.godotengine.org/releases/latest/"
    ></iframe>
  );
}
