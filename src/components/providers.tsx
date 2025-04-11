"use client";

import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';
import { AuthGuard } from '@/components/auth-guard';

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <Toaster richColors position="top-right" />
      <AuthGuard>{children}</AuthGuard>
    </>
  );
}
