import React from 'react';
import { ExamProvider } from './ExamContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ExamProvider>
      {children}
    </ExamProvider>
  );
}
