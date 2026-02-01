export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, Student!</h1>
        <p className="text-slate-600 mt-2">Ready to continue your preparation? Select an exam level below.</p>
      </div>

      {/* Exam Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* C2 Proficiency */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="font-bold text-xl">C2</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">C2 Proficiency</h3>
          <p className="text-slate-600 mb-6 text-sm">
            The highest level qualification. Prove you have mastered English to an exceptional level.
          </p>
          <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Start Practice
          </button>
        </div>
        
        {/* C1 Advanced */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
            <span className="font-bold text-xl">C1</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">C1 Advanced</h3>
          <p className="text-slate-600 mb-6 text-sm">
            The in-depth, high-level qualification that shows you have the language skills employers seek.
          </p>
          <button className="w-full bg-white text-slate-700 border border-slate-300 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            Start Practice
          </button>
        </div>

        {/* B2 First */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <span className="font-bold text-xl">B2</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">B2 First</h3>
          <p className="text-slate-600 mb-6 text-sm">
            A qualification that proves you have the language skills to live and work independently.
          </p>
          <button className="w-full bg-white text-slate-700 border border-slate-300 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            Start Practice
          </button>
        </div>
      </div>

      {/* Recent Activity & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:underline">View all</button>
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Reading & Use of English - Part {item}</p>
                    <p className="text-sm text-slate-500">C2 Proficiency • 2 hours ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">85%</p>
                  <p className="text-xs text-green-600">Passed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Weekly Goal</h3>
          <div className="flex items-center justify-center py-6">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-blue-600"
                  strokeDasharray="75, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">75%</span>
                <span className="text-xs text-slate-500">Completed</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-slate-600 mb-4">
            You've completed 3 out of 4 practice tests this week. Keep it up!
          </p>
          <button className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            Edit Goal
          </button>
        </div>
      </div>
    </div>
  );
}