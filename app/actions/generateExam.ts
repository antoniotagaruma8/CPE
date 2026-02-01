/* app/actions/generateExam.ts */
'use server';

import Groq from 'groq-sdk';

export async function generateExamAction(type: string, topic: string, cefrLevel: string) {
  const apiKeyEnv = process.env.GROQ_API_KEY;

  if (!apiKeyEnv) {
    return { success: false, error: "API Key not configured. Please set GROQ_API_KEY in your environment variables." };
  }

  const prompt = `
      Role: Professional Cambridge English Exam Content Creator.
      Task: Create a highly authentic ${type} exam task for the ${cefrLevel} level.
      Topic: "${topic}".
      
      Instructions:
      - Strictly follow official Cambridge Assessment English standards, vocabulary range, and grammatical complexity for ${cefrLevel}.
      - If 'Reading': Create a 'Part 5: Multiple Choice' task with a 600-word text and 6 four-option questions, or a 'Part 7: Gapped Text' task.
      - If 'Writing': Create a 'Part 1: Compulsory Essay' prompt with two points to discuss and a third idea of the candidate's own.
      - If 'Listening': Provide a full script for a 'Part 2: Sentence Completion' monologue (approx. 3 minutes of speech) with 10 numbered gaps.
      - If 'Speaking': Provide 'Part 2: Individual Long Turn' instructions with 3 related photographs described in detail and two specific questions for the candidate.
      
      Formatting:
      - Use clear Markdown headings.
      - Include a "Candidate Instructions" section.
      - Include an "Answer Key" or "Model Answer" section at the very end.
    `;

  const apiKeys = apiKeyEnv.split(',').map(key => key.trim());
  const models = ["llama3-70b-8192", "mixtral-8x7b-32768", "gemma-7b-it"];
  let lastError = null;

  for (const modelName of models) {
    for (const apiKey of apiKeys) {
      try {
        const groq = new Groq({ apiKey });
        console.log(`Attempting to generate with model: ${modelName} using key ending in ...${apiKey.slice(-4)}`);
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: modelName,
        });

        const text = chatCompletion.choices[0]?.message?.content;
        if (!text) {
          const finishReason = chatCompletion.choices[0]?.finish_reason;
          throw new Error(`No content returned from model. Finish reason: ${finishReason || 'unknown'}`);
        }

        return { success: true, content: text };
      } catch (error) {
        console.error(`Model ${modelName} failed with key ending ...${apiKey.slice(-4)}:`, error);
        lastError = error;
      }
    }
  }

  let finalErrorMessage = "Generation failed after trying all available models and keys.";
  if (lastError instanceof Error) {
    if (lastError.message.includes('429')) {
      finalErrorMessage = "API quota exceeded. Please check your Groq plan and billing details, or try again later.";
    } else if (lastError.message.includes('404')) {
      finalErrorMessage = "A model was not found. This may be due to API version or regional restrictions.";
    } else if (lastError.message.includes('401')) {
      finalErrorMessage = "Authentication failed. Please check your GROQ_API_KEY.";
    } else {
      finalErrorMessage = `Generation failed. Last error: ${lastError.message}`;
    }
  }
  return { success: false, error: finalErrorMessage };
}
