/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\actions\generateImage.ts */
'use server';

import OpenAI from 'openai';

async function generateWithPollinations(prompt: string) {
  try {
    const cleanPrompt = prompt.replace(/[^a-zA-Z0-9\s,.-]/g, '').trim() || 'scene';
    const safePrompt = encodeURIComponent(cleanPrompt.slice(0, 500));
    const seed = Math.floor(Math.random() * 1000000);
    // Using 'flux' model which is generally good
    const url = `https://image.pollinations.ai/prompt/${safePrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;

    console.log(`Generating image with Pollinations.ai (Fallback): ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Pollinations.ai API Error: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    return { success: true, imageUrl: dataUrl };
  } catch (error) {
    console.error('Pollinations fallback error:', error);
    return { success: false, error: 'Failed to generate image with fallback provider.' };
  }
}

export async function generateImageAction(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log("No OpenAI API key found, using fallback.");
    return generateWithPollinations(prompt);
  }

  const openai = new OpenAI({ apiKey });

  try {
    console.log(`Generating image with DALL-E 3 for prompt: "${prompt}"`);
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A realistic, high-quality photograph style image for a language exam. The prompt is: ${prompt}`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
        throw new Error('No image URL returned from API.');
    }

    return { success: true, imageUrl: imageUrl };
  } catch (error) {
    console.error('DALL-E Image generation error:', error);
    console.log("Falling back to Pollinations due to OpenAI error.");
    return generateWithPollinations(prompt);
  }
}