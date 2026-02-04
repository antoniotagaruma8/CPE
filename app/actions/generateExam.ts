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

  const MAX_RETRIES = 5;
  let lastError: string | null = 'Generation did not start.';

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`--- Exam Generation Attempt ${attempt}/${MAX_RETRIES} ---`);
    try {
      const apiKey = getNextApiKey();
      const model = getNextModel();
      const keyIndex = (currentKeyIndex - 1 + apiKeys.length) % apiKeys.length;
      console.log(`Using API Key index: ${keyIndex}, Model: ${model}`);
      
      const groq = new Groq({ apiKey });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an expert in creating Cambridge English Qualification exams. Your output must be a valid JSON object, specifically a JSON array of exam parts.' },
          { role: 'user', content: prompt },
        ],
        model: model,
        temperature: 0.7,
        max_tokens: 8192, // Increased max_tokens to reduce 'length' finish_reason
        response_format: { type: 'json_object' },
      });

      const choice = chatCompletion.choices[0];
      const content = choice?.message?.content;
      const finishReason = choice?.finish_reason;

      // Quality Check 1: Ensure generation wasn't cut off
      if (finishReason === 'length') {
        lastError = `Generation stopped because it reached the maximum token limit.`;
        console.warn(`${lastError} Retrying...`);
        continue;
      }

      // Quality Check 2: Ensure content exists
      if (!content) {
        lastError = 'No content was received from the API.';
        console.warn(`${lastError} Retrying...`);
        continue;
      }

      // Quality Check 3: Validate JSON and structure
      try {
        const rawData = JSON.parse(content);
        let partsArray = null;

        // The prompt strictly asks for a JSON array. Let's first check for that.
        if (Array.isArray(rawData)) {
          partsArray = rawData;
        } else if (rawData && typeof rawData === 'object') {
          // As a fallback, handle cases where the model wraps the array in an object, e.g., {"exam": [...]}
          const keys = Object.keys(rawData);
          if (keys.length === 1 && Array.isArray(rawData[keys[0]])) {
            partsArray = rawData[keys[0]];
          }
        }

        if (!partsArray) {
          lastError = `Generated content was not in the expected format (a JSON array of parts).`;
          console.warn(`${lastError} Retrying...`);
          continue;
        }

        // Quality Check 4: Ensure the correct number of parts were generated
        if (partsArray.length !== partCount) {
          lastError = `Generated exam has ${partsArray.length} parts, but exactly ${partCount} were requested.`;
          console.warn(`${lastError} Retrying...`);
          continue;
        }

        // All checks passed, return the successful result
        console.log(`--- Generation successful on attempt ${attempt} ---`);
        return { success: true, content };

      } catch (jsonError) {
        lastError = 'Failed to parse the generated content as valid JSON.';
        console.warn(`${lastError} Retrying... Raw content preview:`, content.substring(0, 200));
        continue;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      lastError = `API call failed: ${errorMessage}`;
      console.error(`Error on attempt ${attempt}:`, lastError);
      // Continue to next attempt, which will use a different key/model
    }
  }

  // If all retries fail
  console.error(`Failed to generate a valid exam after ${MAX_RETRIES} attempts.`);
  return { success: false, error: `Failed to generate a high-quality exam after multiple attempts. Last known issue: ${lastError}` };
}