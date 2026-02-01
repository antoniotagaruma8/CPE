import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4">
        <div className="mx-auto max-w-7xl flex justify-end gap-4">
          <Link href="#" className="hover:underline">About Us</Link>
          <Link href="#" className="hover:underline">Careers</Link>
          <Link href="#" className="hover:underline">Contact</Link>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl">
                C
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none">Cambridge Exam</span>
                <span className="text-sm font-medium text-slate-500 tracking-widest uppercase">Simulator</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#" className="text-sm font-semibold text-slate-700 hover:text-blue-600">Practice Tests</Link>
              <Link href="#" className="text-sm font-semibold text-slate-700 hover:text-blue-600">Preparation</Link>
              <Link href="#" className="text-sm font-semibold text-slate-700 hover:text-blue-600">Community</Link>
              <Link href="#" className="text-sm font-semibold text-slate-700 hover:text-blue-600">Support</Link>
            </nav>

            {/* Search & Auth */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2">
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-24 placeholder-slate-500" />
              </div>
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600">Log in</Link>
              <Link
                href="/dashboard"
                className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-blue-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Cambridge Practice Simulations</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Master your English proficiency through interactive simulations. From Reading and Use of English to Listening and Speaking, we provide the tools you need to succeed.
          </p>
        </div>
      </div>

      {/* Intro Text */}
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-slate-700 max-w-4xl mx-auto">
            At Cambridge Exam Simulator, we offer the world&apos;s most trusted range of English practice simulations, supporting every learner at every stage of their journey. All our tools reflect real-life exam scenarios and meet a wide variety of learning goals.
          </p>
        </div>
      </div>

      {/* Alternating Feature Sections */}
      <main className="py-12 space-y-12">
        
        {/* Feature 1 */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="w-full md:w-1/2 h-64 md:h-80 bg-slate-200 relative">
               {/* Placeholder for Image */}
               <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
                  <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
               </div>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Reading & Use of English</h2>
              <p className="text-lg text-slate-600 mb-6">
                Practice with authentic texts and challenging grammar exercises. Improve your vocabulary and comprehension skills with our interactive modules.
              </p>
              <Link href="/dashboard" className="text-blue-600 font-semibold hover:underline text-lg">
                Start Practicing &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="w-full md:w-1/2 h-64 md:h-80 bg-slate-200 relative">
               {/* Placeholder for Image */}
               <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
                  <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
               </div>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Writing Assistant</h2>
              <p className="text-lg text-slate-600 mb-6">
                Write essays, reports, and reviews with real-time feedback. Structure your arguments and refine your style to meet Cambridge standards.
              </p>
              <Link href="/dashboard" className="text-blue-600 font-semibold hover:underline text-lg">
                Start Writing &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="w-full md:w-1/2 h-64 md:h-80 bg-slate-200 relative">
               {/* Placeholder for Image */}
               <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
                  <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
               </div>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Listening & Speaking</h2>
              <p className="text-lg text-slate-600 mb-6">
                Immerse yourself in diverse audio recordings and practice speaking tasks with simulated examiners to build confidence.
              </p>
              <Link href="/dashboard" className="text-blue-600 font-semibold hover:underline text-lg">
                Start Listening &rarr;
              </Link>
            </div>
          </div>
        </div>

      </main>

      {/* "You might also be interested in" Section */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">You might also be interested in...</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="h-40 bg-blue-50 rounded-lg mb-4 flex items-center justify-center text-blue-500">
                 <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">C2 Proficiency</h3>
              <p className="text-slate-600 mb-4">The highest level qualification to prove you have mastered English to an exceptional level.</p>
              <Link href="/dashboard" className="text-blue-600 font-medium hover:underline">Learn more &rarr;</Link>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="h-40 bg-green-50 rounded-lg mb-4 flex items-center justify-center text-green-500">
                 <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">C1 Advanced</h3>
              <p className="text-slate-600 mb-4">The in-depth, high-level qualification that shows you have the language skills employers seek.</p>
              <Link href="/dashboard" className="text-blue-600 font-medium hover:underline">Learn more &rarr;</Link>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="h-40 bg-purple-50 rounded-lg mb-4 flex items-center justify-center text-purple-500">
                 <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">B2 First</h3>
              <p className="text-slate-600 mb-4">A qualification that proves you have the language skills to live and work independently.</p>
              <Link href="/dashboard" className="text-blue-600 font-medium hover:underline">Learn more &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links / Footer Top */}
      <div className="bg-white py-12 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Related links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="#" className="block p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <h3 className="font-bold text-slate-900">Documentation</h3>
              <p className="text-sm text-slate-600 mt-1">Read the full guide.</p>
            </Link>
            <Link href="#" className="block p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <h3 className="font-bold text-slate-900">API Reference</h3>
              <p className="text-sm text-slate-600 mt-1">Integrate with your tools.</p>
            </Link>
            <Link href="#" className="block p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <h3 className="font-bold text-slate-900">Community Forum</h3>
              <p className="text-sm text-slate-600 mt-1">Join the discussion.</p>
            </Link>
            <Link href="#" className="block p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <h3 className="font-bold text-slate-900">Release Notes</h3>
              <p className="text-sm text-slate-600 mt-1">See what's new.</p>
              <p className="text-sm text-slate-600 mt-1">See what&apos;s new.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div>
              <h4 className="text-white font-bold mb-4">On this site</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Practice Tests</Link></li>
                <li><Link href="#" className="hover:text-white">Learners</Link></li>
                <li><Link href="#" className="hover:text-white">Educators</Link></li>
                <li><Link href="#" className="hover:text-white">Support</Link></li>
                <li><Link href="#" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Terms & Conditions</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Accessibility</Link></li>
                <li><Link href="#" className="hover:text-white">Data Protection</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                {/* Social Icons Placeholders */}
                <div className="h-8 w-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 cursor-pointer">
                   <span className="sr-only">Facebook</span>
                   <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                </div>
                <div className="h-8 w-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 cursor-pointer">
                   <span className="sr-only">Twitter</span>
                   <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                </div>
                <div className="h-8 w-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 cursor-pointer">
                   <span className="sr-only">LinkedIn</span>
                   <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-center">
            &copy; {new Date().getFullYear()} Cambridge Exam Simulator. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}