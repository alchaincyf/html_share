'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface AnimatedButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function AnimatedButton({
  href,
  onClick,
  children,
  className = '',
  type = 'button',
  disabled = false
}: AnimatedButtonProps) {
  const baseClassName = `${className}`;
  
  const buttonContent = (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      whileTap={{ scale: 0.95 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className={baseClassName}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={baseClassName}
    >
      {buttonContent}
    </button>
  );
} 