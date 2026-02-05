/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\dashboard\ExamContext.tsx */
'use client';

import React, { createContext, useContext, useState } from 'react';
import { generateExamAction } from '../actions/generateExam';
import { generateAudioAction } from '../actions/generateAudio';

interface ExamContextType {
  examType: string;
  setExamType: (type: string) => void;
  cefrLevel: string;
  setCefrLevel: (level: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  generatedExam: string;
  loading: boolean;
  error: string;
  generateExam: () => Promise<void>;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [examType, setExamType] = useState('Reading');
  const [cefrLevel, setCefrLevel] = useState('C1');
  const [topic, setTopic] = useState('');
  const [generatedExam, setGeneratedExam] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateExam = async () => {
    if (!topic) {
      setError('Please enter a topic to generate an exam.');
      return;
    }
    setLoading(true);
    setError('');
    setGeneratedExam('');

    try {
      let enhancedTopic = '';
      let partCount = 5;
      const baseJsonInstructions = "Output must be a valid JSON array of objects. Do not wrap the output in markdown code blocks. Ensure strict JSON syntax. Escape all double quotes within strings. Do not use string concatenation (e.g. '...' + '...') in JSON values. The 'content' field must be a single string.";
      const mcInstructions = "For EVERY question, including those for 'open cloze', 'gapped text', or 'word formation' parts, you MUST generate a multiple-choice question with 4 distinct options (A, B, C, D). One option must be the correct answer. Provide the correct option letter in the 'correctOption' field (e.g., 'A'). Do NOT include the option letter (e.g. 'A)') in the option text. Also provide an 'explanation' field: a quick 1-sentence logical rationale for the correct answer. For each part, provide an 'examinerNotes' field: a precise 1-sentence tip on methods/techniques for that specific question type. For cloze or fill-in-the-blank parts: 1. The 'content' field MUST be the full, original reading text WITHOUT any gaps. Do NOT put the gapped text here. 2. The 'question' field in the 'questions' array MUST contain the sentence with the gap (e.g., 'The cat sat on the ________.'). Do NOT include the question number (e.g. (1)) in the gap. Do not use Markdown or HTML tags.";

      switch (examType) {
        case 'Writing':
          partCount = 5; // C1/C2 has 2 parts, but we generate more for practice variety.
          enhancedTopic = `Based on the topic "${topic}", generate a complete Cambridge ${cefrLevel} Writing exam.
CRITICAL REQUIREMENT: The output MUST be a single JSON array containing EXACTLY ${partCount} distinct writing task objects. Do not stop generating early.

The ${partCount} tasks should follow the format of:
- Part 1: Compulsory Essay (summarizing and evaluating two input texts).
- Parts 2-${partCount}: A choice of different task types (e.g., Report, Review, Proposal, Letter). Ensure these are distinct types.

For each of the ${partCount} parts, provide: 'title', 'instructions', and 'content' (the input text or prompt details).
The 'questions' array for each part MUST contain exactly one object to allow the user to confirm completion. This object should be:
{ "text": "Have you completed this writing task?", "options": ["Yes, task completed"], "correctOption": "A", "explanation": "Writing tasks are assessed on Content, Communicative Achievement, Organisation, and Language." }
${baseJsonInstructions} For each part, provide 'examinerNotes' with a tip for that specific writing task type.
Before finishing, double-check that you have generated exactly ${partCount} writing tasks.`;
          break;
        case 'Listening':
          partCount = 4;
          const listeningQuestionCount = 6; // C1 has 6 questions per part.
          const listeningTotal = partCount * listeningQuestionCount;
          enhancedTopic = `Based on the topic "${topic}", generate a complete Cambridge ${cefrLevel} Listening exam.
CRITICAL REQUIREMENT: The output MUST be a single JSON array containing EXACTLY ${partCount} part objects.
Each of these ${partCount} part objects MUST contain an array of EXACTLY ${listeningQuestionCount} question objects.
This means the final JSON must contain a TOTAL of ${listeningTotal} questions. Do not stop generating early.

The ${partCount} parts should follow the Cambridge format. For each part, provide:
- 'title': Title of the section.
- 'instructions': Instructions for the candidate.
- 'content': The AUDIO TRANSCRIPT. This text will be read aloud to the user.
- 'questions': An array of ${listeningQuestionCount} fill-in-the-blank questions.

For the questions:
- 'question': The sentence with a gap (e.g., "The train departs at ______.").
- 'options': An empty array []. Do NOT provide choices.
- 'correctOption': The correct word or phrase to fill the gap.
- 'explanation': A brief explanation.

${baseJsonInstructions}
Before finishing, double-check that you have generated exactly ${partCount} parts and a total of ${listeningTotal} questions.`;
          break;
        case 'Speaking':
          partCount = 3;
          enhancedTopic = `Based on the topic "${topic}", generate a complete Cambridge ${cefrLevel} Speaking exam.
CRITICAL REQUIREMENT: The output MUST be a single JSON array containing EXACTLY ${partCount} part objects.

The ${partCount} parts should follow the format of:
- Part 1 (Interview): Provide 'title', 'instructions', 'content' (interlocutor script). The 'questions' array MUST contain EXACTLY ONE object. The 'question' field of this object MUST contain a list of 8 distinct interview questions separated by newlines.
- Part 2 (Long turn): Provide 'title', 'instructions', 'content' (describe visual prompts). The 'questions' array MUST contain EXACTLY ONE object with the task prompt.
- Part 3 (Collaborative task): Provide 'title', 'instructions', 'content' (context). The 'questions' array MUST contain EXACTLY ONE object with the discussion prompt.

For each question object, set 'options' to ["Next"], 'correctOption' to "A", and 'explanation' to "Focus on fluency and coherence.".
${baseJsonInstructions} For each part, provide 'examinerNotes' with a tip for that speaking part.
Before finishing, double-check that you have generated exactly ${partCount} parts.`;
          break;
        case 'Reading':
        default:
          partCount = 4; // Reduced from 8 to generate fewer questions.
          const readingQuestionCount = 6; // Aim for 5-6 questions per part.
          const readingTotal = partCount * readingQuestionCount; // Approx 24, within the 20-25 range.
          enhancedTopic = `Based on the topic "${topic}", generate a Cambridge ${cefrLevel} Reading & Use of English practice exam.
CRITICAL REQUIREMENT: The output MUST be a single JSON array containing EXACTLY ${partCount} distinct part objects. The total number of questions across all parts should be approximately ${readingTotal}. Do not stop generating early.

The ${partCount} parts must be varied and follow the Cambridge exam format (e.g., Multiple-choice cloze, Open cloze, Word formation, Multiple choice).
For each of the ${partCount} parts, provide: 'title', 'instructions', 'content' (the reading text), and a 'questions' array with an appropriate number of questions for that part type (around ${readingQuestionCount} each).
${baseJsonInstructions} ${mcInstructions}
Before finishing, double-check that you have generated exactly ${partCount} parts and a total number of questions close to ${readingTotal}.`;
          break;
      }

      console.log("Generating exam with enhanced topic:", enhancedTopic);
      const result = await generateExamAction(examType, enhancedTopic, cefrLevel, 300, partCount);
      if (result.success && result.content) {
        let finalExamContent = result.content;

        // If it's a Listening exam, generate audio for the transcripts
        if (examType === 'Listening') {
          try {
            const examData = JSON.parse(result.content);
            // Handle different structures (array vs object with parts)
            const parts = Array.isArray(examData) ? examData : (examData.parts || []);
            
            // Generate audio for each part
            const partsWithAudio = await Promise.all(parts.map(async (part: any, index: number) => {
              if (part.content) {
                const audioResult = await generateAudioAction(part.content, index);
                if (audioResult.success) {
                  return { ...part, audioUrl: audioResult.audioUrl };
                } else {
                  console.error("Audio generation failed:", audioResult.error);
                  return { ...part, audioError: audioResult.error };
                }
              }
              return part;
            }));

            if (Array.isArray(examData)) {
              finalExamContent = JSON.stringify(partsWithAudio);
            } else {
              finalExamContent = JSON.stringify({ ...examData, parts: partsWithAudio });
            }
          } catch (e) {
            console.error("Error processing listening audio", e);
          }
        }

        setGeneratedExam(finalExamContent);
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Request failed: ${err.message}`);
      } else {
        setError('Failed to connect to the server. An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExamContext.Provider value={{ examType, setExamType, cefrLevel, setCefrLevel, topic, setTopic, generatedExam, loading, error, generateExam }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
}
