/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\actions\generateAudio.ts */
'use server';

import { ElevenLabsClient } from "elevenlabs";

export async function generateAudioAction(text: string) {
  if (!text) return { success: false, error: 'No text provided' };

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('ELEVENLABS_API_KEY is not set');
    return { success: false, error: 'Server configuration error: Missing API Key' };
  }

  try {
    // Voice ID for "Rachel" (American, Clear) - Replace with any voice ID you prefer
    // See https://api.elevenlabs.io/v1/voices for a list if needed
    const voiceId = '21m00Tcm4TlvDq8ikWAM'; 
    const modelId = 'eleven_monolingual_v1'; // or 'eleven_turbo_v2' for lower latency

    console.log("Attempting to generate audio via ElevenLabs SDK...");
    const client = new ElevenLabsClient({ apiKey });

    const audioStream = await client.textToSpeech.convert(voiceId, {
      text,
      model_id: modelId,
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
    return { success: false, error: 'Failed to generate audio' };
  }
}
