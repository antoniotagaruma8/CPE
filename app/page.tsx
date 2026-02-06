"use client";

import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <svg className="h-7 w-7 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.59L7.41 14l1.41-1.41L11 14.17l4.59-4.59L17 11l-6 6z" fill="currentColor"/>
          </svg>
          <span className="font-bold text-lg">CPE Practice</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600">About</Link>
          <Link href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600">Pricing</Link>
          <button 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Log in
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Master the Cambridge English Exams
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
            Experience the most realistic exam simulations, powered by AI. Get detailed feedback and targeted practice to ace your B2 First, C1 Advanced, or C2 Proficiency test.
          </p>
          <div className="mt-10">
            <button 
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="px-8 py-4 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-slate-50 py-20">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto">
                {/* Icon */}
              </div>
              <h3 className="mt-4 text-lg font-bold">Realistic Interface</h3>
              <p className="mt-2 text-slate-600">Practice with a UI that mirrors the official computer-based Cambridge exams.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto">
                {/* Icon */}
              </div>
              <h3 className="mt-4 text-lg font-bold">AI-Powered Feedback</h3>
              <p className="mt-2 text-slate-600">Get instant, detailed analysis on your writing and speaking performance.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto">
                {/* Icon */}
              </div>
              <h3 className="mt-4 text-lg font-bold">Public Sharing</h3>
              <p className="mt-2 text-slate-600">Share your exam results and generated content with a public link.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
          <p className="text-sm text-slate-500">&copy; 2024 CPE Practice. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-slate-500 hover:text-blue-600">Terms</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-blue-600">Privacy</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}