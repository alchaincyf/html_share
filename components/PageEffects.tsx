'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageEffects() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [pathname, isFirstLoad]);

  if (isFirstLoad) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0, borderRadius: '100%' }}
            animate={{ 
              scale: 3,
              borderRadius: '0%'
            }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="w-16 h-16 bg-indigo-600 bg-opacity-5 backdrop-blur-sm"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 