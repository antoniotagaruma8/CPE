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
            <option value="B2">B2 First</option>
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
