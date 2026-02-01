/* app/actions/generateExam.ts */
'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateExamAction(type: string, topic: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { success: false, error: "API Key not configured. Please set GEMINI_API_KEY in your environment variables." };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Act as a professional Cambridge English exam content creator. 
    Create a ${type} exam task for C1 Advanced (CAE) or C2 Proficiency (CPE) level.
    The topic of the exam material should be: "${topic}".
    
    Strictly follow the official Cambridge Assessment English rules, format, and standards.
    
    Specific Instructions based on type:
    - If 'Reading': Provide a text (approx. 500-700 words) followed by 5 multiple-choice questions (Part 5 style) or a Gapped Text task (Part 7 style).
    - If 'Writing': Provide a formal task prompt (e.g., Essay, Report, Proposal, or Review). Include the context, the target reader, and specific points to cover.
    - If 'Listening': Provide a script/transcript for a monologue or interaction, followed by comprehension questions (e.g., Multiple Choice or Sentence Completion).
    - If 'Speaking': Provide Part 2 (Long turn) with candidate instructions and descriptions of visual prompts (images), or Part 3 (Collaborative task) with a central question and prompts.
    
    Format the output clearly with Markdown. Include an "Answer Key" section at the very bottom.
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
