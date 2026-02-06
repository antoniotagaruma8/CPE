/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\actions\generateAudio.ts */
'use server';

import { ElevenLabsClient } from "elevenlabs";

export async function generateAudioAction(text: string, index: number = 0) {
  if (!text) return { success: false, error: 'No text provided' };

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('ELEVENLABS_API_KEY is not set');
    return { success: false, error: 'Server configuration error: Missing API Key' };
  }

  try {
    const client = new ElevenLabsClient({ apiKey });
    
    // Rotate voices to provide variety across exam parts
    const voices = [
        "JBFqnCBsd6RMkjVDRZzb", // George
        "21m00Tcm4TlvDq8ikWAM", // Rachel
        "XB0fDUnXU5powFXDhCwa", // Charlotte
        "ErXwobaYiN019PkySvjV", // Antoni
    ];
    const voiceId = voices[index % voices.length];

    const audioStream = await client.textToSpeech.convert(voiceId, {
      text,
      model_id: "eleven_turbo_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    const base64Audio = buffer.toString('base64');
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

    return { success: true, audioUrl };
  } catch (error) {
    console.error('Error generating audio:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to generate audio' };
  }
}
