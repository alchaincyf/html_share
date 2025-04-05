'use client';

import { ReactNode } from 'react';
import PageTransition from '@/components/PageTransition';
import PageEffects from '@/components/PageEffects';
import { Toaster } from 'react-hot-toast';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <>
      <PageEffects />
      <PageTransition>{children}</PageTransition>
      <Toaster position="top-right" />
    </>
  );
} 