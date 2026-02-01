/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\dashboard\page.tsx */
'use client';

import React from 'react';
import { useExam } from './ExamContext';

export default function DashboardPage() {
  const { generatedExam, loading, error, examType, cefrLevel } = useExam();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard! (Simulation)');
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedExam);
    alert('Exam content copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-8">
        {/* Results Panel - Full Width */}
        <div className="col-span-1">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            {!generatedExam && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                <svg className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg">Use the sidebar to generate a new exam.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-600">Creating Cambridge-standard materials...</p>
              </div>
            )}

            {generatedExam && (
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900">{cefrLevel} {examType} Exam</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopyContent}
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Copy content"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    <button 
                      onClick={handleShare}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-800">
                    {generatedExam}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
