'use client';

import React, { useState, useEffect } from 'react';
import { useExam } from './ExamContext';
import PublicExamDisplay from '../../components/PublicExamDisplay';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SavedExam {
  id: string;
  topic: string;
  examType: string;
  cefrLevel: string;
  generatedExam: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { 
    examType, setExamType, 
    cefrLevel, setCefrLevel, 
    topic, setTopic, 
    generatedExam, loading, error, generateExam, setGeneratedExam 
  } = useExam();
  
  const { data: session, status } = useSession();
  const router = useRouter();

  const [view, setView] = useState<'list' | 'create' | 'view_exam'>('list');
  const [savedExams, setSavedExams] = useState<SavedExam[]>([]);
  const [currentExam, setCurrentExam] = useState<SavedExam | null>(null);

  const storageKey = session?.user?.id ? `savedExams_${session.user.id}` : null;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
    if (status === 'authenticated' && storageKey) {
      const storedExams = localStorage.getItem(storageKey);
      if (storedExams) {
        setSavedExams(JSON.parse(storedExams));
      }
    }
  }, [status, router, storageKey]);

  useEffect(() => {
    if (generatedExam && storageKey && !loading) {
      const newExam: SavedExam = {
        id: new Date().toISOString(),
        topic,
        examType,
        cefrLevel,
        generatedExam,
        createdAt: new Date().toLocaleString(),
      };

      const updatedExams = [newExam, ...savedExams];
      setSavedExams(updatedExams);
      localStorage.setItem(storageKey, JSON.stringify(updatedExams));
      
      setGeneratedExam(null);
      setCurrentExam(newExam);
      setView('view_exam');
    }
  }, [generatedExam, loading, storageKey]);

  const handleShare = (exam: SavedExam) => {
    if (exam) {
      try {
        const shareableExam = {
          examType: exam.examType,
          cefrLevel: exam.cefrLevel,
          content: JSON.parse(exam.generatedExam)
        };
        const jsonString = JSON.stringify(shareableExam);
        const base64 = btoa(unescape(encodeURIComponent(jsonString)));
        const url = `/public/exam?data=${base64}`;
        
        navigator.clipboard.writeText(window.location.origin + url).then(() => {
          alert('Share link copied to clipboard!');
        });
      } catch (e) {
        alert('Error creating share link.');
        console.error("Share link error:", e);
      }
    }
  };

  const handleDeleteExam = (examId: string) => {
    if (!storageKey || !confirm('Are you sure you want to delete this exam?')) return;
    const updatedExams = savedExams.filter(exam => exam.id !== examId);
    setSavedExams(updatedExams);
    localStorage.setItem(storageKey, JSON.stringify(updatedExams));
  };

  if (status === 'loading' || (status === 'authenticated' && !storageKey)) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading Dashboard...</p></div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-700">Generating your {cefrLevel} {examType} Exam...</h2>
        <p className="text-slate-500 mt-2">This usually takes about 10-20 seconds.</p>
      </div>
    );
  }

  if (view === 'view_exam' && currentExam) {
    const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify({
      examType: currentExam.examType,
      cefrLevel: currentExam.cefrLevel,
      content: JSON.parse(currentExam.generatedExam)
    }))));
    return (
      <div className="min-h-screen bg-slate-100">
         <header className="bg-white border-b border-gray-300 flex items-center justify-between px-6 py-4 shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button onClick={() => setView('list')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  &larr; Back to My Exams
                </button>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">{currentExam.cefrLevel} {currentExam.examType}</span>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => handleShare(currentExam)}
                    className="bg-gray-700 text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    Share Public Link
                </button>
            </div>
         </header>
         <PublicExamDisplay encodedData={encodedData} />
      </div>
    );
  }
  
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <button onClick={() => setView('list')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            &larr; Back to My Exams
          </button>
          <div className="flex items-center gap-4">
              {session?.user?.email && <span className="text-sm text-slate-600">{session.user.email}</span>}
              <button onClick={() => signOut()} className="text-sm font-semibold text-red-600 hover:text-red-700">Sign out</button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto w-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707-.707m12.728 0l.707-.707M12 21v-1m-4-4H7v4h1v-4zm8 0h1v4h-1v-4z"></path></svg>
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-slate-800">Create Your Custom Exam</h3>
                      <p className="text-sm text-slate-500">Fill out the details below to generate a new exam paper.</p>
                  </div>
              </div>
              {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
              <div className="space-y-6">
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
                      <input type="text" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Technology, Climate Change, Travel..." className="w-full rounded-lg border-slate-300 border p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 transition" />
                  </div>
                  <button onClick={generateExam} disabled={!topic.trim()} className="w-full py-3 px-4 rounded-lg text-white font-bold shadow-sm transition-all bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      Generate Exam
                  </button>
              </div>
          </div>
        </div>
      </div>
    );
  }

  // Default list view
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
        <h1 className="font-bold text-lg text-slate-800">My Generated Exams</h1>
        <div className="flex items-center gap-4">
            {session?.user?.email && <span className="text-sm text-slate-600">{session.user.email}</span>}
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm font-semibold text-red-600 hover:text-red-700">Sign out</button>
        </div>
      </header>
      <main className="p-4 sm:p-8">
        <button onClick={() => setView('create')} className="mb-8 w-full py-3 px-4 rounded-lg text-white font-bold shadow-sm transition-all bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Create New Exam
        </button>
        <div className="space-y-4">
          {savedExams.length > 0 ? savedExams.map(exam => (
            <div key={exam.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-slate-800">{exam.topic || 'Untitled Exam'}</p>
                <p className="text-sm text-slate-500">{exam.cefrLevel} - {exam.examType} &bull; Created: {exam.createdAt}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setCurrentExam(exam); setView('view_exam'); }} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-md hover:bg-gray-300">View</button>
                <button onClick={() => handleDeleteExam(exam.id)} className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-md hover:bg-red-200">Delete</button>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-200">
              <p className="text-slate-500 font-medium">You haven't generated any exams yet.</p>
              <p className="text-slate-400 mt-1 text-sm">Click "Create New Exam" to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}