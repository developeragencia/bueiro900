"use client";

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import { Providers } from '@/components/providers';
import ClientBody from './ClientBody';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bueiro Digital - Rastreamento de UTM',
  description: 'A plataforma mais completa para rastreamento de UTMs e gestão de campanhas de marketing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <ClientBody>{children}</ClientBody>
          </Providers>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
