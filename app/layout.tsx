import './globals.css';

export const metadata = {
  title: 'CPE Simulator',
  description: 'Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Add suppressHydrationWarning here
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
