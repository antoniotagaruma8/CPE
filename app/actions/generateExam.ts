/* app/actions/generateExam.ts */
'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateExamAction(type: string, topic: string, cefrLevel: string) {
  const apiKeyEnv = process.env.GEMINI_API_KEY;

  if (!apiKeyEnv) {
    return { success: false, error: "API Key not configured. Please set GEMINI_API_KEY in your environment variables." };
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
  const models = ["gemini-2.5-pro", "gemini-2.0-flash"];
  let lastError = null;

  for (const modelName of models) {
    for (const apiKey of apiKeys) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        console.log(`Attempting to generate with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = '';
        try {
          text = response.text();
        } catch (e) {
          throw new Error("Generation blocked by safety settings.");
        }
        return { success: true, content: text };
      } catch (error) {
        console.error(`Model ${modelName} failed with key ending ...${apiKey.slice(-4)}:`, error);
        lastError = error;
      }
    }
  }

  const errorMessage = lastError instanceof Error ? lastError.message : "Unknown error";
  return { success: false, error: `Generation failed on all models. Last error: ${errorMessage}` };
}
