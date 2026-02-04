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
          partCount = 2;
          enhancedTopic = `${topic}. STRICT REQUIREMENT: Generate exactly ${partCount} distinct writing tasks following the Cambridge ${cefrLevel} exam format. Part 1: Compulsory Essay (summarizing and evaluating two input texts). Part 2: Choice of task (e.g., Report, Review, Proposal, Letter). For each part, provide 'title', 'instructions', and 'content'. The 'content' field must be a single string containing the input text or prompt details. Do NOT generate multiple choice questions about the text. Instead, the 'questions' array must contain exactly one object to allow the user to confirm completion. This question object should have: 'text': 'Have you completed this writing task?', 'options': ['Yes, task completed'], 'correctOption': 'A', 'explanation': 'Writing tasks are assessed on Content, Communicative Achievement, Organisation, and Language.'. ${baseJsonInstructions} For each part, provide 'examinerNotes' with a tip for that specific writing task type.`;
          break;
        case 'Listening':
          partCount = 4;
          enhancedTopic = `${topic}. STRICT REQUIREMENT: Generate exactly ${partCount} distinct listening parts following the Cambridge ${cefrLevel} exam format. Part 1: Three short unrelated extracts (Multiple Choice). Part 2: Monologue (Sentence completion - adapt to Multiple Choice). Part 3: Interview/Discussion (Multiple Choice). Part 4: Five short themed monologues (Multiple Matching - adapt to Multiple Choice). Provide the transcript in the 'content' field. Generate exactly 5 multiple choice questions per part (Total 20 questions). ${baseJsonInstructions} ${mcInstructions}`;
          break;
        case 'Speaking':
          partCount = 3;
          enhancedTopic = `${topic}. STRICT REQUIREMENT: Generate exactly ${partCount} distinct speaking parts following the Cambridge ${cefrLevel} exam format. Part 1: Interview. Part 2: Long turn (comparing photographs - describe them in content). Part 3: Collaborative task/Discussion. Provide the interlocutor script in the 'content' field. The 'questions' array should contain the specific prompts/questions the examiner asks. Generate exactly 7 questions per part (Total 21 questions). For each question object, set 'options' to ['Next'], 'correctOption' to 'A', and 'explanation' to 'Focus on fluency and coherence.'. ${baseJsonInstructions} For each part, provide 'examinerNotes' with a tip for that speaking part.`;
          break;
        case 'Reading':
        default:
          partCount = 5;
          enhancedTopic = `${topic}. STRICT REQUIREMENT: Generate exactly ${partCount} distinct reading parts following the Cambridge ${cefrLevel} exam format (focusing on parts compatible with multiple choice). Part 1: Multiple-choice cloze. Part 5: Multiple choice. Part 6: Cross-text multiple matching. Part 7: Gapped text (paragraph fitting - adapt to Multiple Choice). Part 8: Multiple matching. Each part MUST have a unique reading text. Reading texts must be approximately 300 words. Generate exactly 5 questions per part (Total 25 questions). ${baseJsonInstructions} ${mcInstructions}`;
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
