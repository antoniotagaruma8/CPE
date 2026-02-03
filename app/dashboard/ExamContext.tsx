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
      const commonInstructions = "Output must be a valid JSON array of objects. Do not wrap the output in markdown code blocks. Ensure strict JSON syntax. Escape all double quotes within strings. For each question, provide an 'explanation' field: a quick 1-sentence logical rationale for the correct answer. For each part, provide an 'examinerNotes' field: a precise 1-sentence tip on methods/techniques to answer this type of question.";

      switch (examType) {
        case 'Writing':
          partCount = 2;
          enhancedTopic = `${topic}. STRICT REQUIREMENT: Generate exactly ${partCount} distinct writing tasks (Part 1 Essay, Part 2 Choice). For each part, provide 'title', 'instructions', and 'content'. The 'content' field must be a single string containing the input text or prompt details. Generate 5-7 multiple choice questions that test understanding of the writing task, appropriate vocabulary, or structure. ${commonInstructions}`;
          break;
        case 'Listening':
          partCount = 4;
          enhancedTopic = `${topic}. STRICT REQUIREMENT: Generate exactly ${partCount} distinct listening parts. Provide the transcript in the 'content' field. Generate 5-7 multiple choice questions per part based on the transcript. ${commonInstructions}`;
          break;
        case 'Speaking':
          partCount = 3;
          enhancedTopic = `${topic}. STRICT REQUIREMENT: Generate exactly ${partCount} distinct speaking parts. Provide the interlocutor script in the 'content' field. Generate 5-7 multiple choice questions testing useful phrases or strategies for this part. ${commonInstructions}`;
          break;
        case 'Reading':
        default:
          partCount = 5;
          enhancedTopic = `${topic}. STRICT REQUIREMENT: Generate exactly ${partCount} distinct exam parts. Each part must have a unique reading text (1 paragraph, approx 200 words) and 5-7 questions. ${commonInstructions}`;
          break;
      }

      console.log("Generating exam with enhanced topic:", enhancedTopic);
      const result = await generateExamAction(examType, enhancedTopic, cefrLevel, 200, partCount);
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
