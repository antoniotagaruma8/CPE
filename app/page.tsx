"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-gray-100">
        <div className="text-2xl font-bold text-blue-600 tracking-tight">CPE Simulator</div>
        <Link 
          href="/dashboard" 
          className="text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          Log in
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto">
        <div className="mb-8 inline-flex items-center justify-center p-3 bg-blue-50 rounded-full">
          <span className="text-4xl">🎓</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
          Master the Cambridge <br/>
          <span className="text-blue-600">C2 Proficiency Exam</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
          Generate realistic exam papers, practice with strict timing, and get instant AI-powered grading based on official assessment scales.
        </p>

        {/* Google Sign Up Button */}
        <button 
          onClick={handleGoogleLogin}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign up with Google
        </button>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
          <FeatureCard 
            icon="⚡" 
            title="Instant Generation" 
            desc="Create unique exam papers for Writing, Speaking, and Use of English in seconds." 
          />
          <FeatureCard 
            icon="🤖" 
            title="AI Examiner" 
            desc="Get detailed feedback and band scores (C1-C2) immediately after submission." 
          />
          <FeatureCard 
            icon="🔗" 
            title="Shareable Links" 
            desc="Generate public links for your exams to share with students or teachers." 
          />
        </div>
      </main>

      <footer className="py-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} CPE Simulator. Not affiliated with Cambridge Assessment English.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-100 transition-colors">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}