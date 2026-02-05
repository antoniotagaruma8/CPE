/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\actions\generateImageHF.ts */
'use server';

export async function generateImageAction(prompt: string) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'Missing HUGGINGFACE_API_KEY in .env.local' };
  }

  try {
    // Using Stable Diffusion XL Base 1.0
    const modelId = "stabilityai/stable-diffusion-xl-base-1.0";
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API Error: ${response.status} - ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    return { success: true, imageUrl: dataUrl };
  } catch (error) {
    console.error('Image generation error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to generate image' };
  }
}