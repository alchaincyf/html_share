'use client';

import { useEffect, useRef, ReactNode } from 'react';
// @ts-expect-error animejs导入问题
import anime from 'animejs';

interface AnimatedContentProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedContent({
  children,
  delay = 0,
  duration = 800,
  className = ''
}: AnimatedContentProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    anime({
      targets: elementRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutQuad',
      duration,
      delay
    });
  }, [delay, duration]);

  return (
    <div ref={elementRef} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
} 