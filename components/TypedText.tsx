'use client';

import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

interface TypedTextProps {
  strings: string[];
  className?: string;
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
  showCursor?: boolean;
  cursorChar?: string;
}

export default function TypedText({
  strings,
  className = '',
  typeSpeed = 50,
  backSpeed = 30,
  backDelay = 1000,
  loop = true,
  showCursor = true,
  cursorChar = '|'
}: TypedTextProps) {
  const el = useRef<HTMLSpanElement>(null);
  const typed = useRef<Typed | null>(null);

  useEffect(() => {
    if (!el.current) return;
    
    typed.current = new Typed(el.current, {
      strings,
      typeSpeed,
      backSpeed,
      backDelay,
      loop,
      showCursor,
      cursorChar
    });

    return () => {
      typed.current?.destroy();
    };
  }, [strings, typeSpeed, backSpeed, backDelay, loop, showCursor, cursorChar]);

  return <span ref={el} className={className}></span>;
} 