"use client";

import React, { useState, useEffect } from 'react';
import { generateImageAction } from '../app/actions/generateImage';

// NOTE: The following interfaces and components are copied and adapted from the main dashboard page.

interface Question {
  id: number;
  part: number;
  topic: string;
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
  imagePrompts?: string[];
  possibleAnswers?: string[];
  tips?: string;
  part1Questions?: { question: string; answer: string; tip: string }[];
}

interface ExamPart {
  part: number;
  title: string;
  instructions: string;
  content: string;
  examinerNotes?: string;
  audioUrl?: string;
  audioError?: string;
  tips?: string;
  modelAnswer?: string;
  howToApproach?: string;
}

const AudioPlayer = ({ text, audioUrl, audioError, examType }: { text: string; audioUrl?: string, audioError?: string, examType: string }) => {
  if (audioUrl) {
    return (
      <div className="w-full p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
        <div className="text-sm font-bold text-blue-900 mb-2">Audio Track</div>
        <audio controls src={audioUrl} className="w-full focus:outline-none" />
      </div>
    );
  }
  return (
    <div className="w-full p-4 bg-gray-100 rounded-lg border border-gray-200 mb-4 text-gray-600">
      <p className="text-xs italic">Audio track (TTS or pre-recorded) would be available here.</p>
    </div>
  );
};

const AIImage = ({ prompt }: { prompt: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    const result = await generateImageAction(prompt);
    if (result.success && result.imageUrl) {
      setImageUrl(result.imageUrl);
    } else {
      setError(result.error || 'Failed to generate image.');
    }
    setLoading(false);
  };

  if (imageUrl) {
    return (
      <div className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
        <img src={imageUrl} alt={prompt} className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
        <p className="p-2 text-xs text-gray-500 bg-gray-50 italic border-t border-gray-100">{prompt}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[250px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center">
      <p className="text-sm text-gray-600 mb-4 italic max-w-xs">{prompt}</p>
      {error && <p className="text-xs text-red-500 mb-3 font-bold">{error}</p>}
      <button onClick={generate} disabled={loading} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
    </div>
  );
};


export default function PublicExamDisplay({ encodedData }: { encodedData: string }) {
  const [examParts, setExamParts] = useState<ExamPart[]>([]);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examType, setExamType] = useState('');
  const [cefrLevel, setCefrLevel] = useState('');
  const [error, setError] = useState('');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (!encodedData) {
      setError('No exam data provided in the link.');
      return;
    }

    try {
      const decodedString = decodeURIComponent(escape(atob(encodedData)));
      const fullExamData = JSON.parse(decodedString);
      
      setExamType(fullExamData.examType || 'Unknown Exam');
      setCefrLevel(fullExamData.cefrLevel || 'Unknown Level');

      const rawData = fullExamData.content;
      let data: any;
      let processedData = rawData;

      if (processedData && typeof processedData === 'object' && !Array.isArray(processedData) && Object.keys(processedData).length === 1) {
          const key = Object.keys(processedData)[0];
          if (typeof processedData[key] === 'object') {
            processedData = processedData[key];
          }
      }

      if (Array.isArray(processedData)) {
        data = processedData;
      } else if (processedData?.parts && Array.isArray(processedData.parts)) {
        data = processedData.parts;
      } else if (processedData?.exam && Array.isArray(processedData.exam)) {
        data = processedData.exam;
      } else if (processedData?.tasks && Array.isArray(processedData.tasks)) {
        data = processedData.tasks;
      } else if (processedData?.writingTasks && Array.isArray(processedData.writingTasks)) {
        data = processedData.writingTasks;
      } else if (processedData?.title && processedData?.content && processedData?.questions) {
        data = [processedData];
      } else {
        const values = processedData && typeof processedData === 'object' ? Object.values(processedData) : [];
        const flattenedValues = values.flat();
        const looksLikeParts = flattenedValues.length > 0 && flattenedValues.every((v: any) => v && typeof v === 'object' && (v.title || v.questions));
        data = looksLikeParts ? flattenedValues : processedData;
      }

      const partsArray = Array.isArray(data) ? data : [data];
      
      const allParts: ExamPart[] = [];
      const allQuestions: Question[] = [];
      let questionIdCounter = 1;
      let validPartsFound = false;

      partsArray.forEach((item: any, index: number) => {
        let partData = item;
        if (partData && !partData.title && !partData.questions && Object.keys(partData).length === 1) {
          const key = Object.keys(partData)[0];
          if (partData[key] && typeof partData[key] === 'object') {
            partData = partData[key];
          }
        }

        if (partData && partData.title && (partData.content || partData.text) && Array.isArray(partData.questions)) {
          validPartsFound = true;
          const partNumber = index + 1;
          const cleanedTitle = (partData.title || '').replace(/^Part\s*\d+\s*[:.]?\s*/i, '').trim();
          
          allParts.push({
            part: partNumber,
            title: cleanedTitle,
            instructions: partData.instructions || '',
            content: partData.content || partData.text || '',
            examinerNotes: partData.examinerNotes || '',
            audioUrl: partData.audioUrl,
            audioError: partData.audioError,
            tips: partData.tips,
            modelAnswer: partData.modelAnswer,
            howToApproach: partData.howToApproach,
          });

          partData.questions.forEach((q: any) => {
            allQuestions.push({
              id: questionIdCounter++,
              part: partNumber,
              topic: partData.title,
              question: q.text || q.question || q.prompt || '',
              options: Array.isArray(q.options)
                ? q.options.map((opt: any) => {
                    if (typeof opt === 'string') return opt;
                    if (typeof opt === 'object' && opt !== null) return opt.text || opt.value;
                    return null;
                  }).filter((o): o is string => o !== null)
                : [],
              correctOption: q.correctOption,
              explanation: q.explanation,
              imagePrompts: (Array.isArray(q.imagePrompts) 
                ? q.imagePrompts 
                : (typeof q.imagePrompts === 'string' ? [q.imagePrompts] : [])
              ).map((p: any) => {
                    if (typeof p === 'string') return p;
                    if (typeof p === 'object' && p !== null) return p.description || p.text || p.prompt || '';
                    return '';
                  }).filter((s: string) => s && s.trim().length > 0),
              possibleAnswers: q.possibleAnswers,
              tips: q.tips,
              part1Questions: q.part1Questions,
            });
          });
        }
      });

      if (validPartsFound) {
        setExamParts(allParts);
        setExamQuestions(allQuestions);
      } else {
        setError("Generated exam data is not in the expected format.");
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Failed to parse exam data: ${errorMessage}. The link may be invalid or corrupted.`);
    }
  }, [encodedData]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md" role="alert">
          <strong className="font-bold text-lg">Error Loading Exam</strong>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (examQuestions.length === 0) {
    return <div className="flex h-screen items-center justify-center">Loading and Preparing Exam...</div>;
  }

  const getLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = { A1: 'A1 Beginner', A2: 'A2 Elementary', B1: 'B1 Intermediate', B2: 'B2 Upper Intermediate', C1: 'C1 Advanced', C2: 'C2 Proficiency' };
    return labels[level] || level;
  };

  const getExamTypeLabel = (type: string) => type === 'Reading' ? 'Reading & Use of English' : type;

  const handleOptionSelect = (questionId: number, option: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleInputChange = (questionId: number, value: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentQuestion = examQuestions[currentQuestionIndex];
  const currentPart = examParts.find(p => p.part === currentQuestion?.part);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <header className="bg-white p-6 rounded-lg shadow-md mb-8 border-b-4 border-blue-600">
        <h1 className="text-3xl font-bold text-slate-800">Public Exam View</h1>
        <p className="text-slate-600 mt-1">{getLevelLabel(cefrLevel)}: {getExamTypeLabel(examType)}</p>
      </header>

      {currentPart && currentQuestion && (
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
              Part {currentPart.part}{currentPart.title ? `: ${currentPart.title}` : ''}
            </h2>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Question {currentQuestionIndex + 1} of {examQuestions.length}
              </span>
            </div>
            
            <div className="prose prose-slate max-w-none text-gray-800 leading-relaxed mb-6">
              {currentPart.instructions.split('\n').filter(line => line.trim()).map((line, index) => <p key={index}>{line}</p>)}
            </div>

            {currentPart.content && (
              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg mb-6">
                <h4 className="font-semibold text-slate-600 mb-2 text-sm uppercase tracking-wider">{examType === 'Listening' ? 'Audio Context' : 'Context'}</h4>
                {examType === 'Listening' ? <AudioPlayer text={currentPart.content} audioUrl={currentPart.audioUrl} audioError={currentPart.audioError} examType={examType} /> : null}
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">{currentPart.content}</div>
              </div>
            )}

            {currentPart.howToApproach && (
              <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg shadow-sm mb-4">
                <h4 className="font-bold text-purple-800 mb-2">🚀 How to Approach</h4>
                <div className="text-sm text-purple-800 leading-relaxed whitespace-pre-line">{currentPart.howToApproach}</div>
              </div>
            )}

            {isSubmitted && currentPart.tips && (
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg shadow-sm mb-4">
                <h4 className="font-bold text-yellow-800 mb-2">💡 Tips & Strategies</h4>
                <div className="text-sm text-yellow-800 leading-relaxed whitespace-pre-line">{currentPart.tips}</div>
              </div>
            )}

            {isSubmitted && currentPart.modelAnswer && (
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg shadow-sm mb-4">
                <h4 className="font-bold text-blue-800 mb-2">📝 Model Answer</h4>
                <div className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">{currentPart.modelAnswer.replace(/\n{3,}/g, '\n\n')}</div>
              </div>
            )}

              <div key={currentQuestion.id} className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800 bg-gray-100 p-3 rounded border-l-4 border-blue-500">
                  Question {currentQuestion.id}
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                  <div className="font-semibold text-gray-800 whitespace-pre-line">{currentQuestion.question}</div>

                  {currentQuestion.imagePrompts && currentQuestion.imagePrompts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                      {currentQuestion.imagePrompts.map((prompt, idx) => <AIImage key={idx} prompt={prompt} />)}
                    </div>
                  )}

                  {currentQuestion.options && currentQuestion.options.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {currentQuestion.options.map((opt, index) => {
                        const letter = String.fromCharCode('A'.charCodeAt(0) + index);
                        const isSelected = userAnswers[currentQuestion.id] === letter;
                        let optionClass = "bg-white border-gray-200";
                        
                        if (isSubmitted) {
                          if (letter === currentQuestion.correctOption) optionClass = "bg-green-100 border-green-400 font-bold";
                          else if (isSelected) optionClass = "bg-red-100 border-red-400";
                        } else if (isSelected) {
                          optionClass = "bg-blue-50 border-blue-500 ring-1 ring-blue-500";
                        }

                        return (
                          <div 
                            key={opt} 
                            onClick={() => handleOptionSelect(currentQuestion.id, letter)}
                            className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all ${optionClass}`}
                          >
                            <span className="font-bold text-gray-900">{letter}</span>
                            <span className="text-sm text-gray-700">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!currentQuestion.options?.length && currentQuestion.correctOption && (
                    <div className="mt-2">
                      <input 
                        type="text" 
                        placeholder="Type your answer..." 
                        value={userAnswers[currentQuestion.id] || ''}
                        onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                        disabled={isSubmitted}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                      />
                      {isSubmitted && (
                        <div className="mt-2 text-sm text-green-700 bg-green-50 p-3 rounded border border-green-200">
                          <span className="font-bold">Correct Answer:</span> {currentQuestion.correctOption}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isSubmitted && <div className="mt-4 space-y-4">
                  {currentQuestion.explanation && (
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                      <h4 className="font-bold text-blue-800">Rationale</h4>
                      <p className="text-sm text-gray-700 mt-1">{currentQuestion.explanation}</p>
                    </div>
                  )}
                  {currentQuestion.tips && (
                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                      <h4 className="font-bold text-yellow-800">💡 Tips</h4>
                      <p className="text-sm text-yellow-800 leading-relaxed">{currentQuestion.tips}</p>
                    </div>
                  )}
                  {currentQuestion.possibleAnswers && currentQuestion.possibleAnswers.length > 0 && (
                    <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg">
                      <h4 className="font-bold text-indigo-800">🗣️ Possible Answers / Useful Language</h4>
                      <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1 mt-2">
                        {currentQuestion.possibleAnswers?.map((ans, idx) => <li key={idx}>{ans}</li>)}
                      </ul>
                    </div>
                  )}
                </div>}
              </div>
          </section>
      )}

      {!isSubmitted ? (
        <div className="flex justify-between mt-8 pb-8">
          <button 
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestionIndex < examQuestions.length - 1 ? (
            <button 
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
          <button 
            onClick={() => setIsSubmitted(true)}
            className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-transform hover:scale-105"
          >
            Submit Answers
          </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-8 pb-8 gap-4">
           <div className="flex gap-4">
              <button 
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                onClick={handleNext}
                disabled={currentQuestionIndex === examQuestions.length - 1}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
           </div>
           <div className="text-center p-4 bg-gray-100 rounded-lg">
              <p className="font-bold text-lg mb-2">Exam Submitted</p>
              <button 
                onClick={() => { setIsSubmitted(false); setUserAnswers({}); setCurrentQuestionIndex(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
              >
                Reset / Try Again
              </button>
           </div>
        </div>
      )}
    </div>
  );
}