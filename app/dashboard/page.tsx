"use client";

import React, { useState, useEffect } from 'react';
import { useExam } from './ExamContext';
import CliLoader from '../../components/CliLoader';

interface Question {
  id: number;
  part: number;
  topic: string;
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

interface ExamPart {
  part: number;
  title: string;
  instructions: string;
  content: string;
  examinerNotes?: string;
  audioUrl?: string;
}

const AudioPlayer = ({ text, audioUrl }: { text: string; audioUrl?: string }) => {
  const [playing, setPlaying] = useState(false);

  if (audioUrl) {
    return (
      <div className="w-full p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
        <div className="text-sm font-bold text-blue-900 mb-2">Audio Track</div>
        <audio controls src={audioUrl} className="w-full focus:outline-none" />
      </div>
    );
  }

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const togglePlay = () => {
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setPlaying(false);
      window.speechSynthesis.speak(utterance);
      setPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
      <button
        onClick={togglePlay}
        className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        title={playing ? "Stop Audio" : "Play Audio"}
      >
        {playing ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
        ) : (
          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
      <div>
        <div className="text-sm font-bold text-blue-900">Audio Track (TTS)</div>
        <div className="text-xs text-blue-600">{playing ? 'Playing...' : 'Click to listen'}</div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { 
    generatedExam, 
    loading, 
    error, 
    examType, 
    setExamType, 
    cefrLevel, 
    setCefrLevel, 
    topic, 
    setTopic,
    generateExam 
  } = useExam();

  const [examParts, setExamParts] = useState<ExamPart[]>([]);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 1 hour 30 mins in seconds
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());
  const [localError, setLocalError] = useState('');
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  useEffect(() => {
    if (generatedExam) {
      // Reset all exam-specific state when a new exam is generated
      setCurrentQuestion(1);
      setAnswers({});
      setFlagged(new Set());
      setSubmittedQuestions(new Set());
      setLocalError('');
      // Optional: Reset timer as well
      // setTimeLeft(90 * 60);

      try {
        const rawData = JSON.parse(generatedExam);
        let data: any;
        let processedData = rawData;

        // Drill down if we have a single-key object wrapper like {"Writing": ...} or similar
        if (processedData && typeof processedData === 'object' && !Array.isArray(processedData) && Object.keys(processedData).length === 1) {
            const key = Object.keys(processedData)[0];
            if (typeof processedData[key] === 'object') {
              processedData = processedData[key];
            }
        }

        // Handle potential wrapper objects or direct arrays
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
          // Check if the object is a map of parts (e.g. { part1: {...}, part2: {...} })
          const values = processedData && typeof processedData === 'object' ? Object.values(processedData) : [];
          const flattenedValues = values.flat(); // Handles cases like { Part1: [{}], Part2: [{}] }
          const looksLikeParts = flattenedValues.length > 0 && flattenedValues.every((v: any) => v && typeof v === 'object' && (v.title || v.questions));
          data = looksLikeParts ? flattenedValues : processedData;
        }

        // Normalize data to always be an array
        const partsArray = Array.isArray(data) ? data : [data];
        
        const allParts: ExamPart[] = [];
        const allQuestions: Question[] = [];
        let questionIdCounter = 1;
        let validPartsFound = false;

        partsArray.forEach((item: any, index: number) => {
          // Attempt to unwrap if the object has a single key that looks like a part identifier
          let partData = item;
          if (partData && !partData.title && !partData.questions && Object.keys(partData).length === 1) {
            const key = Object.keys(partData)[0];
            if (partData[key] && typeof partData[key] === 'object') {
              partData = partData[key];
            }
          }

          // Validate essential fields
          if (partData && partData.title && (partData.content || partData.text) && Array.isArray(partData.questions)) {
            validPartsFound = true;
            const partNumber = index + 1;
            // Clean up title to remove duplicated "Part X:" prefix from AI generation
            const cleanedTitle = (partData.title || '').replace(/^Part\s*\d+\s*:\s*/i, '').trim();
            
            allParts.push({
              part: partNumber,
              title: cleanedTitle,
              instructions: partData.instructions || '',
              content: partData.content || partData.text || '',
              examinerNotes: partData.examinerNotes || '',
              audioUrl: partData.audioUrl,
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
              });
            });
          }
        });

        if (validPartsFound) {
          setExamParts(allParts);
          setExamQuestions(allQuestions);
        } else {
          setExamParts([]);
          setExamQuestions([]);
          setLocalError("Generated exam data is not in the expected format. It should be an array of exam parts, or a single valid exam object.");
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setExamParts([]);
        setExamQuestions([]);
        setLocalError(`Failed to parse the generated exam: ${errorMessage}. Displaying raw content instead.`);
      }
    } else {
      // When generatedExam is cleared (e.g., on new generation), clear parsed data
      setExamParts([]);
      setExamQuestions([]);
      setLocalError('');
    }
  }, [generatedExam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateExam();
  };

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmitAnswer = () => {
    if (!answers[currentQuestion]) {
      // Do not submit if no answer is selected
      return;
    }
    setSubmittedQuestions(prev => new Set(prev).add(currentQuestion));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (question: number, option: string) => {
    setAnswers(prev => ({ ...prev, [question]: option }));
  };

  const toggleFlag = (question: number) => {
    setFlagged(prev => {
      const newSet = new Set(prev);
      if (newSet.has(question)) {
        newSet.delete(question);
      } else {
        newSet.add(question);
      }
      return newSet;
    });
  };

  const getQuestionNavClass = (q: number) => {
    if (currentQuestion === q) {
      return 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-[#2d2d2d]';
    }
    if (answers[q]) {
      return 'bg-gray-500 text-white';
    }
    return 'bg-[#3d3d3d] text-gray-300 hover:bg-[#4d4d4d]';
  };

  // Show loader if loading from server OR if we have the raw data but haven't parsed it yet
  const isProcessing = !!generatedExam && examQuestions.length === 0 && examParts.length === 0 && !localError && !error;

  useEffect(() => {
    if (loading || isProcessing) {
      setIsLoaderVisible(true);
    }
  }, [loading, isProcessing]);

  if (loading || isProcessing || isLoaderVisible) {
    return (
      <CliLoader 
        finished={!loading && !isProcessing} 
        onComplete={() => setIsLoaderVisible(false)} 
      />
    );
  }

  const anyError = error || localError;
  if (anyError) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">An error occurred!</strong>
          <span className="block sm:inline"> {anyError}</span>
          {localError && !error && <pre className="mt-4 text-left bg-red-50 p-2 rounded text-xs">{generatedExam}</pre>}
        </div>
      </div>
    );
  }

  if (!generatedExam || examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707-.707m12.728 0l.707-.707M12 21v-1m-4-4H7v4h1v-4zm8 0h1v4h-1v-4z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Create Your Custom Exam (Updated)</h3>
              <p className="text-sm text-slate-500">Fill out the details below to generate a new exam paper.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="examType" className="block text-sm font-bold text-slate-600 mb-2">Exam Skill</label>
              <select id="examType" value={examType} onChange={(e) => setExamType(e.target.value)} className="w-full rounded-lg border-slate-300 border p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 transition">
                <option value="Reading">Reading & Use of English</option>
                <option value="Writing">Writing</option>
                <option value="Listening">Listening</option>
                <option value="Speaking">Speaking</option>
              </select>
            </div>
            <div>
              <label htmlFor="cefrLevel" className="block text-sm font-bold text-slate-600 mb-2">CEFR Level</label>
              <select id="cefrLevel" value={cefrLevel} onChange={(e) => setCefrLevel(e.target.value)} className="w-full rounded-lg border-slate-300 border p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 transition">
                <option value="A1">A1 Beginner</option>
                <option value="A2">A2 Elementary</option>
                <option value="B1">B1 Intermediate</option>
                <option value="B2">B2 Upper Intermediate</option>
                <option value="C1">C1 Advanced</option>
                <option value="C2">C2 Proficiency</option>
              </select>
            </div>
            <div>
              <label htmlFor="topic" className="block text-sm font-bold text-slate-600 mb-2">Topic / Theme</label>
              <input type="text" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Technology, Climate Change..." className="w-full rounded-lg border-slate-300 border p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 transition" required />
            </div>
            <button type="submit" disabled={loading} className={`w-full py-3 px-4 rounded-lg text-white font-bold shadow-sm transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}>
              {loading ? 'Generating...' : 'Generate Exam'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalQuestions = examQuestions.length;
  const activeQuestionData = examQuestions.find(q => q.id === currentQuestion);
  const activePartData = examParts.find(p => p.part === activeQuestionData?.part);

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'A1': return 'A1 Beginner';
      case 'A2': return 'A2 Elementary';
      case 'B1': return 'B1 Intermediate';
      case 'B2': return 'B2 Upper Intermediate';
      case 'C1': return 'C1 Advanced';
      case 'C2': return 'C2 Proficiency';
      default: return level;
    }
  };

  const getExamTypeLabel = (type: string) => {
    return type === 'Reading' ? 'Reading & Use of English' : type;
  };

  return (
    <div className="flex flex-col h-screen bg-[#e9e9e9] font-sans text-[#333]">
      <header className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-700">{getLevelLabel(cefrLevel)}: {getExamTypeLabel(examType)}</h1>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="text-sm text-gray-600">Candidate: <span className="font-bold text-black">Guest User</span></div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Time Remaining</span>
            <span className="text-xl font-mono font-bold text-gray-900">{formatTime(timeLeft)}</span>
          </div>
          <button className="bg-gray-700 text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Share Public Link
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-2 sm:p-4 gap-2 sm:gap-4">
        <div className="flex-1 bg-white rounded-md shadow-sm border border-gray-200 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-3">
              Part {activePartData?.part}: {activePartData?.title}
            </h2>
            <div className="prose prose-slate max-w-none text-gray-800 leading-relaxed">
              {(activePartData?.instructions || '').split('\n').filter(line => line.trim()).map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            {activePartData?.content && (
              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-slate-600 mb-2 text-sm uppercase tracking-wider">
                  {examType === 'Listening' ? 'Audio Context' : 'Context'}
                </h4>
                
                {examType === 'Listening' ? (
                  <>
                    <AudioPlayer text={activePartData.content} audioUrl={activePartData.audioUrl} />
                    <details className="text-xs text-slate-400 mt-2">
                      <summary className="cursor-pointer hover:text-slate-600 transition-colors">Show Transcript</summary>
                      <p className="mt-2 p-2 bg-white rounded border border-slate-100 italic">{activePartData.content}</p>
                    </details>
                  </>
                ) : (
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                    {(activePartData.content || '').split('\n').filter(line => line.trim()).map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
            {examType === 'Writing' && submittedQuestions.has(currentQuestion) && activePartData?.examinerNotes && (
              <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg animate-fade-in">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707-.707m12.728 0l.707-.707M12 21v-1m-4-4H7v4h1v-4zm8 0h1v4h-1v-4z" /></svg>
                  <div>
                    <h4 className="font-bold text-green-800">Tip</h4>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{activePartData.examinerNotes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {examType !== 'Writing' && (
          <div className="flex-1 bg-white rounded-md shadow-sm border border-gray-200 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-4 text-gray-800 bg-gray-100 p-3 rounded border-l-4 border-blue-500">
              Question {currentQuestion}
            </h3>
            
            {activeQuestionData && (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-800 mb-4">{activeQuestionData.question}</p>
                  
                  {activeQuestionData.options && activeQuestionData.options.length > 0 ? (
                    <div className="space-y-3">
                    {activeQuestionData.options.map((opt, index) => {
                      const letter = String.fromCharCode('A'.charCodeAt(0) + index);
                      const isSubmitted = submittedQuestions.has(currentQuestion);
                      const correctOption = activeQuestionData.correctOption;
                      const isCorrectAnswer = letter === correctOption;
                      const isSelected = answers[currentQuestion] === letter;

                      let optionClass = "border-gray-200 hover:bg-blue-50 hover:border-blue-400";
                      if (isSubmitted) {
                        if (isCorrectAnswer) {
                          optionClass = "border-green-500 bg-green-50 ring-2 ring-green-500";
                        } else if (isSelected && !isCorrectAnswer) {
                          optionClass = "border-red-500 bg-red-50 ring-2 ring-red-500";
                        } else {
                          optionClass = "border-gray-200 opacity-60";
                        }
                      }

                      return (
                        <label key={opt} className={`flex items-center gap-3 p-3 bg-white rounded-md border transition-all group ${isSubmitted ? '' : 'cursor-pointer'} ${optionClass}`}>
                          <input
                            type="radio"
                            name={`q${currentQuestion}`}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            checked={isSelected}
                            onChange={() => handleAnswer(currentQuestion, letter)}
                            disabled={isSubmitted}
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            <span className="font-bold mr-2 text-gray-900">{letter}</span>
                            {opt}
                          </span>
                        </label>
                      );
                    })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={answers[currentQuestion] || ''}
                        onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
                        disabled={submittedQuestions.has(currentQuestion)}
                        placeholder="Type your answer here..."
                        className={`w-full p-3 rounded-md border outline-none transition-all ${
                          submittedQuestions.has(currentQuestion)
                            ? (answers[currentQuestion] || '').trim().toLowerCase() === activeQuestionData.correctOption.trim().toLowerCase()
                              ? 'border-green-500 bg-green-50 text-green-900'
                              : 'border-red-500 bg-red-50 text-red-900'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        }`}
                      />
                      {submittedQuestions.has(currentQuestion) && (answers[currentQuestion] || '').trim().toLowerCase() !== activeQuestionData.correctOption.trim().toLowerCase() && (
                         <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                           <span className="font-bold">Correct Answer:</span> {activeQuestionData.correctOption}
                         </div>
                      )}
                    </div>
                  )}
                </div>

                {submittedQuestions.has(currentQuestion) && (
                  <div className="mt-6 space-y-4 animate-fade-in">
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <div>
                          <h4 className="font-bold text-blue-800">Rationale</h4>
                          <p className="text-sm text-gray-700 mt-1">{activeQuestionData.explanation}</p>
                        </div>
                      </div>
                    </div>
                    {activePartData?.examinerNotes && (
                      <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                        <div className="flex items-start gap-3">
                          <svg className="w-6 h-6 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707-.707m12.728 0l.707-.707M12 21v-1m-4-4H7v4h1v-4zm8 0h1v4h-1v-4z" /></svg>
                          <div>
                            <h4 className="font-bold text-green-800">Tip</h4>
                            <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{activePartData.examinerNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        )}
      </main>

      <footer className="h-20 bg-[#2d2d2d] text-white flex items-center justify-between px-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentQuestion(q => Math.max(1, q - 1))}
            disabled={currentQuestion === 1}
            className="px-4 py-2 rounded bg-[#3d3d3d] hover:bg-[#4d4d4d] text-sm font-medium transition-colors text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button 
            onClick={() => toggleFlag(currentQuestion)}
            className="px-4 py-2 rounded bg-[#3d3d3d] hover:bg-[#4d4d4d] text-sm font-medium transition-colors text-gray-300 hover:text-white flex items-center gap-2"
          >
            <svg className={`w-4 h-4 ${flagged.has(currentQuestion) ? 'text-yellow-400 fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-2l9-9 4 4-9 9H3zm12.3-12.3l-4-4 1.4-1.4c.4-.4 1-.4 1.4 0l1.2 1.2c.4.4.4 1 0 1.4l-1.4 1.4z" /></svg>
            Review
          </button>
          <button 
            onClick={() => {
              const isSubmitted = submittedQuestions.has(currentQuestion);
              if (isSubmitted) {
                if (currentQuestion < totalQuestions) {
                  setCurrentQuestion(q => q + 1);
                }
              } else {
                handleSubmitAnswer();
              }
            }}
            disabled={(!submittedQuestions.has(currentQuestion) && !answers[currentQuestion]) || (submittedQuestions.has(currentQuestion) && currentQuestion === totalQuestions)}
            className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-sm font-bold transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submittedQuestions.has(currentQuestion) ? 'Next' : 'Submit'}
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto py-2 no-scrollbar mx-4">
          {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((q) => (
            <button
              key={q}
              onClick={() => setCurrentQuestion(q)}
              className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-sm text-xs font-bold transition-all relative ${getQuestionNavClass(q)}`}
            >
              {flagged.has(q) && <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>}
              {q}
            </button>
          ))}
        </div>
        
        <button className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-colors">
          Finish Test
        </button>
      </footer>
    </div>
  );
}