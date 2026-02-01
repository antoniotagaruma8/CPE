/* c:\Users\Anton\Desktop\OLD FILES\GOALS\AI\GitHub 2025\CPE\app\dashboard\SidebarConfig.tsx */
'use client';

import React from 'react';
import { useExam } from './ExamContext';

export default function SidebarConfig() {
  const { examType, setExamType, cefrLevel, setCefrLevel, topic, setTopic, generateExam, loading } = useExam();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateExam();
  };

  return (
    <div className="px-6 py-2">
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Configuration</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="examType" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Exam Skill
          </label>
          <select
            id="examType"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="w-full rounded-lg border-slate-300 border p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
          >
            <option value="Reading">Reading & Use of English</option>
            <option value="Writing">Writing</option>
            <option value="Listening">Listening</option>
            <option value="Speaking">Speaking</option>
          </select>
        </div>

        <div>
          <label htmlFor="cefrLevel" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            CEFR Level
          </label>
          <select
            id="cefrLevel"
            value={cefrLevel}
            onChange={(e) => setCefrLevel(e.target.value)}
            className="w-full rounded-lg border-slate-300 border p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
          >
            <option value="A1">A1 Beginner</option>
            <option value="A2">A2 Elementary</option>
            <option value="B1">B1 Intermediate</option>
            <option value="B2">B2 Upper Intermediate</option>
            <option value="C1">C1 Advanced</option>
            <option value="C2">C2 Proficiency</option>
          </select>
        </div>

        <div>
          <label htmlFor="topic" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Topic / Theme
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Technology..."
            className="w-full rounded-lg border-slate-300 border p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 px-4 rounded-lg text-white text-sm font-bold shadow-sm transition-all ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Exam'}
        </button>
      </form>
    </div>
  );
}
