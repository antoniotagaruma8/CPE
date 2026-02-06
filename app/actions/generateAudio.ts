/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\actions\generateAudio.ts */
'use server';

import { ElevenLabsClient } from "elevenlabs";

// Curated list of high-quality voices for Cambridge exam simulation
// Alternating accents to provide variety (British, American, etc.)
const EXAM_VOICES = [
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", accent: "British", gender: "male" },   // 0: British Male
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", accent: "American", gender: "female" },  // 1: American Female
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", accent: "British", gender: "female" },// 2: British Female
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", accent: "American", gender: "male" },  // 3: American Male
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel", accent: "British", gender: "male" },   // 4: British Male
  { id: "nPczCjz82INmrbartXRg", name: "Brian", accent: "American", gender: "male" },   // 5: American Male
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", accent: "British", gender: "female" },     // 6: British Female
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", accent: "American", gender: "male" },   // 7: American Male
];

export async function generateAudioAction(text: string, index: number = 0) {
  if (!text) return { success: false, error: 'No text provided' };

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('ELEVENLABS_API_KEY is not set');
    return { success: false, error: 'Server configuration error: Missing API Key' };
  }

  try {
    const modelId = 'eleven_turbo_v2'; // Faster and lower latency
    const client = new ElevenLabsClient({ apiKey });

    // 1. Parse text to identify speakers and segments
    // Regex to capture "Speaker Name: Content" (e.g. "Person A: Hello", "Man: Hi")
    const speakerRegex = /^([A-Za-z0-9\s\(\)]{1,20}):\s+(.*)/;
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const segments: { speaker: string; text: string }[] = [];
    let currentSpeaker = 'Narrator';

    for (const line of lines) {
      const match = line.match(speakerRegex);
      if (match) {
        segments.push({ speaker: match[1].trim(), text: match[2].trim() });
        currentSpeaker = match[1].trim();
      } else {
        if (segments.length > 0) {
          segments[segments.length - 1].text += ' ' + line.trim();
        } else {
          segments.push({ speaker: currentSpeaker, text: line.trim() });
        }
      }
    }

    if (segments.length === 0) return { success: false, error: 'No text to generate' };

    // 2. Assign voices to speakers
    const uniqueSpeakers = Array.from(new Set(segments.map(s => s.speaker)));
    const speakerVoiceMap = new Map<string, typeof EXAM_VOICES[0]>();
    
    // Rotate available voices based on index to ensure variety across exam parts
    const rotation = index % EXAM_VOICES.length;
    const availableVoices = [...EXAM_VOICES.slice(rotation), ...EXAM_VOICES.slice(0, rotation)];

    uniqueSpeakers.forEach((speaker, i) => {
      // If it's a monologue (only 1 speaker found), just use the first available voice
      if (uniqueSpeakers.length === 1) {
        speakerVoiceMap.set(speaker, availableVoices[0]);
        return;
      }

      const lowerSpeaker = speaker.toLowerCase();
      let gender: 'male' | 'female' | undefined;

      // Infer gender from label
      if (lowerSpeaker.match(/woman|female|girl|mother|mrs|ms|lady/)) {
        gender = 'female';
      } else if (lowerSpeaker.match(/man|male|boy|father|mr|sir/)) {
        gender = 'male';
      } else if (i === 1 && uniqueSpeakers.length === 2) {
        // If 2 speakers and gender unknown for 2nd, try to alternate from 1st
        const firstVoice = speakerVoiceMap.get(uniqueSpeakers[0]);
        if (firstVoice) gender = firstVoice.gender === 'male' ? 'female' : 'male';
      }

      // Find a voice that matches gender (if set) and hasn't been used yet if possible
      const usedIds = Array.from(speakerVoiceMap.values()).map(v => v.id);
      const voice = availableVoices.find(v => 
        (!gender || v.gender === gender) && !usedIds.includes(v.id)
      ) || availableVoices.find(v => !usedIds.includes(v.id)) || availableVoices[0];

      speakerVoiceMap.set(speaker, voice);
    });

    // 3. Generate audio for each segment
    console.log(`Generating audio for ${segments.length} segments with ${uniqueSpeakers.length} speakers.`);
    
    const audioPromises = segments.map(async (segment) => {
      const voice = speakerVoiceMap.get(segment.speaker) || availableVoices[0];
      const audioStream = await client.textToSpeech.convert(voice.id, {
        text: segment.text,
        model_id: modelId,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      });
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
    });

    const audioBuffers = await Promise.all(audioPromises);
    const buffer = Buffer.concat(audioBuffers);
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
