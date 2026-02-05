/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\actions\generateAudio.ts */
'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAudioAction(text: string) {
  if (!text) return { success: false, error: 'No text provided' };

  try {
    // Use OpenAI's TTS model for realistic audio
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy", // Options: alloy, echo, fable, onyx, nova, shimmer
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const base64Audio = buffer.toString('base64');
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

    return { success: true, audioUrl };
  } catch (error) {
    console.error('Error generating audio:', error);
    return { success: false, error: 'Failed to generate audio' };
  }
}
