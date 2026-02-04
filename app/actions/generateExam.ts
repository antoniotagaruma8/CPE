'use server';

import Groq from 'groq-sdk';

// 1. Retrieve all API keys from environment variables.
const apiKeys = Object.keys(process.env)
  .filter(key => key.startsWith('GROQ_API_KEY_'))
  .map(key => process.env[key])
  .filter((key): key is string => !!key);

if (apiKeys.length === 0) {
  console.error('No Groq API keys found. Please set GROQ_API_KEY_1, GROQ_API_KEY_2, etc. in your .env.local file.');
}

// 2. Define models to rotate through. These are large, capable models suitable for complex generation.
const models = [
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768',
];

let currentKeyIndex = 0;
let currentModelIndex = 0;

/**
 * Gets the next available API key in a round-robin fashion.
 * This helps distribute requests across multiple keys to avoid rate limits.
 */
function getNextApiKey() {
  if (apiKeys.length === 0) {
    throw new Error('No Groq API keys configured.');
  }
  const key = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  return key;
}

/**
 * Gets the next available model in a round-robin fashion.
 * This helps distribute requests across different models to avoid model-specific rate limits.
 */
function getNextModel() {
  const model = models[currentModelIndex];
  currentModelIndex = (currentModelIndex + 1) % models.length;
  return model;
}

export async function generateExamAction(
  examType: string,
  prompt: string,
  cefrLevel: string,
  max_tokens: number,
  partCount: number
) {
  if (apiKeys.length === 0) {
    return { success: false, error: 'Server is not configured with any API keys.' };
  }

  try {
    const apiKey = getNextApiKey();
    const model = getNextModel();
    const keyIndex = (currentKeyIndex - 1 + apiKeys.length) % apiKeys.length;
    console.log(`Using API Key index: ${keyIndex}, Model: ${model}`);
    
    const groq = new Groq({ apiKey });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert in creating Cambridge English Qualification exams. Your output must be a valid JSON object.' },
        { role: 'user', content: prompt },
      ],
      model: model,
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    return content ? { success: true, content } : { success: false, error: 'No content received from API.' };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('Error generating exam with Groq:', errorMessage);
    return { success: false, error: `API call failed: ${errorMessage}` };
  }
}