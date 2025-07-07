import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';
import { Sparkles, AudioLines } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI ArtGen - Generate Stunning AI Art',
  description: 'Transform your ideas into beautiful images with the power of artificial intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Shared Header with Navigation */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ansarigen
                  </span>
                </Link>
              </div>
              <nav className="flex gap-4 items-center">
                <Link href="/audio-gen" className="font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1 transition-colors">
                  <AudioLines className="w-4 h-4" /> Audio Gen
                </Link>
              </nav>
            </div>
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}