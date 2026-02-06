/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\actions\generateAudio.ts */
'use server';

export async function generateAudioAction(text: string, index: number = 0) {
  if (!text) return { success: false, error: 'No text provided' };

  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    console.error('HUGGINGFACE_API_KEY is not set');
    return { success: false, error: 'Server configuration error: Missing API Key' };
  }

  try {
    // 1. Parse text to identify speakers and segments (to strip labels)
    const lines = text.split('\n').map(l => l.trim()).filter(line => line !== '');
    const segments: { speaker: string; text: string }[] = [];
    let currentSpeaker = 'Narrator';

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      let isNewSpeaker = false;

      if (colonIndex > 1 && colonIndex < 50) {
        const potentialSpeakerPart = line.substring(0, colonIndex).trim();
        const contentPart = line.substring(colonIndex + 1).trim();
        const cleanSpeaker = potentialSpeakerPart.replace(/[\*_\[\]\(\)\-]/g, '').trim();
        const wordCount = cleanSpeaker.split(/\s+/).length;

        if (cleanSpeaker.length > 0 && cleanSpeaker.length < 35 && wordCount <= 5) {
           let finalContent = contentPart;
           if ((finalContent.startsWith('"') && finalContent.endsWith('"')) || (finalContent.startsWith("'") && finalContent.endsWith("'"))) {
             finalContent = finalContent.slice(1, -1).trim();
           }
           
           if (finalContent.length > 0) {
             segments.push({ speaker: cleanSpeaker, text: finalContent });
             currentSpeaker = cleanSpeaker;
             isNewSpeaker = true;
           }
        }
      }

      if (!isNewSpeaker) {
        if (segments.length > 0) {
          segments[segments.length - 1].text += ' ' + line;
        } else {
          segments.push({ speaker: currentSpeaker, text: line });
        }
      }
    }

    // Reconstruct full text without labels to send as one request
    const textToSpeak = segments.length > 0 ? segments.map(s => s.text).join(' ... ') : text;

    console.log(`Generating audio via Hugging Face for text length: ${textToSpeak.length}`);

    // Using espnet/kan-bayashi_ljspeech_vits for English TTS
    const modelId = "espnet/kan-bayashi_ljspeech_vits";
    const response = await fetch(
      `https://router.huggingface.co/models/${modelId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: textToSpeak }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API Error: ${response.status} - ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');
    
    // MMS usually returns WAV
    const audioUrl = `data:audio/wav;base64,${base64Audio}`;

    return { success: true, audioUrl };
  } catch (error) {
    console.error('Error generating audio:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to generate audio' };
  }
}
