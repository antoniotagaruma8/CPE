/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\dashboard\ExamContext.tsx */
'use client';

import React, { createContext, useContext, useState } from 'react';
import { generateExamAction } from '../actions/generateExam';

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
      const mcInstructions = "For each question, provide an 'explanation' field: a quick 1-sentence logical rationale for the correct answer. For each part, provide an 'examinerNotes' field: a precise 1-sentence tip on methods/techniques to answer this type of question.";

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

The ${partCount} parts should follow the Cambridge format. For each part, provide: 'title', 'instructions', 'content' (the audio transcript), and a 'questions' array with ${listeningQuestionCount} questions.
${baseJsonInstructions} ${mcInstructions}
Before finishing, double-check that you have generated exactly ${partCount} parts and a total of ${listeningTotal} questions.`;
          break;
        case 'Speaking':
          partCount = 3;
          const speakingQuestionCount = 7;
          const speakingTotal = partCount * speakingQuestionCount;
          enhancedTopic = `Based on the topic "${topic}", generate a complete Cambridge ${cefrLevel} Speaking exam.
CRITICAL REQUIREMENT: The output MUST be a single JSON array containing EXACTLY ${partCount} part objects.
Each of these ${partCount} part objects MUST contain an array of EXACTLY ${speakingQuestionCount} question objects (prompts for the candidate).
This means the final JSON must contain a TOTAL of ${speakingTotal} questions. Do not stop generating early.

The ${partCount} parts should follow the format of: Part 1 (Interview), Part 2 (Long turn), Part 3 (Collaborative task).
For each part, provide: 'title', 'instructions', 'content' (the interlocutor script and/or visual prompts like photo descriptions), and a 'questions' array with ${speakingQuestionCount} prompts.
For each question object, set 'options' to ["Next"], 'correctOption' to "A", and 'explanation' to "Focus on fluency and coherence.".
${baseJsonInstructions} For each part, provide 'examinerNotes' with a tip for that speaking part.
Before finishing, double-check that you have generated exactly ${partCount} parts and a total of ${speakingTotal} questions.`;
          break;
        case 'Reading':
        default:
          partCount = 8; // C1/C2 Reading & Use of English has 8 parts.
          const readingQuestionCount = 6; // Average questions per part.
          const readingTotal = 52; // Approximate total for C1.
          enhancedTopic = `Based on the topic "${topic}", generate a complete Cambridge ${cefrLevel} Reading & Use of English exam.
CRITICAL REQUIREMENT: The output MUST be a single JSON array containing EXACTLY ${partCount} part objects. The total number of questions across all parts should be approximately ${readingTotal}. Do not stop generating early.

The ${partCount} parts must be varied and follow the Cambridge exam format (e.g., Multiple-choice cloze, Open cloze, Word formation, Key word transformation, Multiple choice, Cross-text multiple matching, Gapped text, Multiple matching).
For each of the ${partCount} parts, provide: 'title', 'instructions', 'content' (the reading text), and a 'questions' array with an appropriate number of questions for that part type.
${baseJsonInstructions} ${mcInstructions}
Before finishing, double-check that you have generated exactly ${partCount} parts and a total number of questions close to ${readingTotal}.`;
          break;
      }

      console.log("Generating exam with enhanced topic:", enhancedTopic);
      const result = await generateExamAction(examType, enhancedTopic, cefrLevel, 300, partCount);
      if (result.success && result.content) {
        setGeneratedExam(result.content);
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
