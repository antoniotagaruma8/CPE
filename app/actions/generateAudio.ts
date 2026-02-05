/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\actions\generateAudio.ts */
'use server';

import { ElevenLabsClient } from "elevenlabs";

// Curated list of high-quality voices for Cambridge exam simulation
// Alternating accents to provide variety (British, American, etc.)
const EXAM_VOICES = [
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", accent: "British" },   // 0: British Male
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", accent: "American" },  // 1: American Female
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", accent: "British" },// 2: British Female
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", accent: "American" },  // 3: American Male
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel", accent: "British" },   // 4: British Male
  { id: "nPczCjz82INmrbartXRg", name: "Brian", accent: "American" },   // 5: American Male
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", accent: "British" },     // 6: British Female
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", accent: "American" },   // 7: American Male
];

export async function generateAudioAction(text: string, index: number = 0) {
  if (!text) return { success: false, error: 'No text provided' };

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('ELEVENLABS_API_KEY is not set');
    return { success: false, error: 'Server configuration error: Missing API Key' };
  }

  try {
    // Select voice based on index to ensure rotation/variety across exam parts
    // Use modulo to wrap around if there are more parts than voices
    const voiceIndex = index % EXAM_VOICES.length;
    const selectedVoice = EXAM_VOICES[voiceIndex];
    
    const modelId = 'eleven_turbo_v2'; // Faster and lower latency

    console.log(`Generating audio using voice: ${selectedVoice.name} (${selectedVoice.accent})`);
    const client = new ElevenLabsClient({ apiKey });

    const audioStream = await client.textToSpeech.convert(selectedVoice.id, {
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
    let errorMessage = error instanceof Error ? error.message : 'Failed to generate audio';
    
    if (errorMessage.includes("401")) {
      errorMessage = "Invalid API Key. Please check your ELEVENLABS_API_KEY.";
    } else if (errorMessage.includes("429")) {
      errorMessage = "ElevenLabs quota exceeded or rate limit reached.";
    }
    
    return { success: false, error: errorMessage };
  }
}
