import React from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg mb-2">Recent Activity</h3>
          <p className="text-slate-600">No recent activity.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg mb-2">Your Progress</h3>
          <p className="text-slate-600">Start a test to see your progress.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg mb-2">Recommended</h3>
          <p className="text-slate-600">C1 Advanced Practice Test 1</p>
        </div>
      </div>
    </div>
  );
}
