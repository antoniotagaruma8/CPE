/* app/actions/generateExam.ts */
'use server';

import Groq from 'groq-sdk';

export async function generateExamAction(type: string, topic: string, cefrLevel: string) {
  const apiKeyEnv = process.env.GROQ_API_KEY;

  if (!apiKeyEnv) {
    return { success: false, error: "API Key not configured. Please set GROQ_API_KEY in your environment variables." };
  }

  const prompt = `
    You are an expert content creator for Cambridge Assessment English exams (C1 Advanced and C2 Proficiency).
    Your task is to generate a highly realistic, exam-standard task for the ${cefrLevel} level, formatted as a structured JSON object.
    
    Exam Section: ${type}
    Topic: ${topic}
    
    ### Output Format:
    Return ONLY a valid JSON object. Do not include markdown formatting.
    Structure:
    {
      "title": "Title of the text or task",
      "instructions": "Specific instructions for the candidate",
      "content": "The main text (Reading), script (Listening), or input notes (Writing). Use \\n\\n for paragraph breaks.",
      "questions": [
        {
          "id": 1,
          "text": "The question stem",
          "options": [
            { "key": "A", "text": "Option A text" },
            { "key": "B", "text": "Option B text" },
            { "key": "C", "text": "Option C text" },
            { "key": "D", "text": "Option D text" }
          ],
          "correctOption": "A",
          "explanation": "Brief explanation of why this is correct"
        }
      ],
      "examinerNotes": "Brief analysis of vocabulary/grammar used"
    }

    ### General Requirements:
    - **Authenticity**: The content must mirror the complexity, vocabulary range, and style of real Cambridge exams.
    - **Level**: Strictly adhere to ${cefrLevel} standards (C1: Advanced, C2: Proficiency).
    
    ### Specific Task Instructions:
    
    IF READING (Reading & Use of English):
    - Create a **Part 5 (Multiple Choice)** task.
    - **Content**: Write a sophisticated, engaging text (approx. 700 words) on the topic. It should be dense, with nuance, implication, and complex structure. Ensure it is divided into distinct paragraphs using \\n\\n.
    - **Questions**: Provide 6 four-option multiple choice questions.
    
    IF WRITING:
    - Create a **Part 1 (Essay)** task.
    - **Content**: Provide the context paragraph and the two specific points to discuss.
    - **Instructions**: "Write an essay discussing two of the points in your notes..."
    
    IF LISTENING:
    - Create a **Part 3 (Multiple Choice)** script.
    - **Content**: Write the full dialogue (approx. 800 words). It should sound natural but academic.
    - **Questions**: 6 multiple-choice questions.
    
    IF SPEAKING:
    - Create a **Part 2 (Long Turn)** task.
    - **Content**: Description of 3 photographs and the interlocutor script.
    - **Questions**: The specific questions for the candidate.
  `;

  const apiKeys = apiKeyEnv.split(',').map(key => key.trim());
  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
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
          response_format: { type: "json_object" },
        });

        const text = chatCompletion.choices[0]?.message?.content;
        if (!text) {
          const finishReason = chatCompletion.choices[0]?.finish_reason;
          throw new Error(`No content returned from model. Finish reason: ${finishReason || 'unknown'}`);
        }

        try {
          const jsonContent = JSON.parse(text);
          return { success: true, data: jsonContent, content: text };
        } catch (e) {
          console.error("Failed to parse JSON response:", text);
          throw new Error("Model did not return valid JSON.");
        }
      } catch (error) {
        console.error(`Model ${modelName} failed with key ending ...${apiKey.slice(-4)}:`, error);
        lastError = error;
      }
    }
  }

  let finalErrorMessage = "Generation failed after trying all available models and keys.";
  if (lastError) {
    const msg = lastError instanceof Error ? lastError.message : String(lastError);
    if (msg.includes('429')) {
      finalErrorMessage = "API quota exceeded. Please check your Groq plan and billing details, or try again later.";
    } else if (msg.includes('404')) {
      finalErrorMessage = "A model was not found. This may be due to API version or regional restrictions.";
    } else if (msg.includes('401')) {
      finalErrorMessage = "Authentication failed. Please check your GROQ_API_KEY.";
    } else {
      finalErrorMessage = `Generation failed. Last error: ${msg}`;
    }
  }
  return { success: false, error: finalErrorMessage };
}
