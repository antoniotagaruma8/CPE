/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\actions\generateAudio.ts */
'use server';

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

    console.log("Attempting to generate audio via ElevenLabs...");
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ElevenLabs API Error:', response.status, errorData);
      return { success: false, error: `ElevenLabs API Error: ${response.statusText}` };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

    return { success: true, audioUrl };
  } catch (error) {
    console.error('Error generating audio:', error);
    return { success: false, error: 'Failed to generate audio' };
  }
}
