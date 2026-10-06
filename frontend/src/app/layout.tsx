import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Typeform — Conversational Forms & Surveys',
  description: 'Create beautiful, interactive forms and surveys that people love answering.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white text-neutral-900 antialiased">
      <body className="min-h-full flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
