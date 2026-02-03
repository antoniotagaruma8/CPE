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
      // Requesting 5 parts, 200 words each.
      // Adding instructions for 1 paragraph and 5-7 questions per part via the topic string.
      const enhancedTopic = `${topic}. STRICT REQUIREMENT: Generate exactly 5 distinct exam parts. Each part must have a unique reading text (1 paragraph, approx 200 words) and 5-7 questions. Output must be a JSON array of 5 objects. For each question, provide an 'explanation' field: a quick 1-sentence logical rationale for the correct answer. For each part, provide an 'examinerNotes' field: a precise 1-sentence tip on methods/techniques to answer this type of question.`;
      console.log("Generating exam with enhanced topic:", enhancedTopic);
      const result = await generateExamAction(examType, enhancedTopic, cefrLevel, 200, 5);
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
