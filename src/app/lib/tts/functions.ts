'use server'

import textToSpeech from '@google-cloud/text-to-speech';

const client = new textToSpeech.TextToSpeechClient();

export default async function speakText(text: string) {
  const request = {
    input: { text: text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' }
  }

  const stream = client.streamingSynthesize();

  stream.on('data', (response) => { console.log(response) });
  stream.on('error', (err) => { throw(err) });
  stream.on('end', () => { });
  stream.write(request);
  stream.end();
}
