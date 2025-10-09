'use server'

import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient({ apiKey: process.env.GOOGLE_TTS_API_KEY });

export default async function speakText(text: string) {
  const request = {
    input: { text: text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' }
  };

  const response = client.synthesizeSpeech(request);
  console.log(response);
}
