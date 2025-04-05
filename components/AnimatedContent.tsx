'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { fadeIn } from '@/lib/animeUtils';

interface AnimatedContentProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedContent({
  children,
  delay = 0,
  className = ''
}: AnimatedContentProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;
    fadeIn(elementRef.current, delay);
  }, [delay]);

  return (
    <div ref={elementRef} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
} 