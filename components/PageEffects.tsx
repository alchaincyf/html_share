'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageEffects() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0, borderRadius: '100%' }}
            animate={{ 
              scale: 4,
              borderRadius: '0%'
            }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
            className="w-16 h-16 bg-indigo-600 bg-opacity-10 backdrop-blur-sm"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 