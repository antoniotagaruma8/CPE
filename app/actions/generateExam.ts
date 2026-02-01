/* app/actions/generateExam.ts */
'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateExamAction(type: string, topic: string, cefrLevel: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, error: "API Key not configured. Please set GEMINI_API_KEY in your environment variables." };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return { success: true, content: text };
  } catch (error) {
    console.error("Generation error:", error);
    return { success: false, error: "Failed to generate exam content. Please try again." };
  }
}
