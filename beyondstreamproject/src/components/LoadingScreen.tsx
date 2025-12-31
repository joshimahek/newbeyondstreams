import { motion } from 'motion/react';
import { useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  delay?: number;
}

export function LoadingScreen({ onComplete, delay = 3000 }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, delay);

    return () => clearTimeout(timer);
  }, [onComplete, delay]);

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        padding: '2rem',
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--brand-text-primary)',
          fontSize: '2rem',
          textAlign: 'center',
          marginBottom: '3rem',
        }}
      >
        We are finding patterns in your answers!
      </motion.h2>

      {/* 3 Colored Dots Animation */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 0,
            ease: 'easeInOut',
          }}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#C0E8E4',
          }}
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 0,
            ease: 'easeInOut',
            delay: 0.2,
          }}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#E28383',
          }}
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 0,
            ease: 'easeInOut',
            delay: 0.4,
          }}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#BCE79D',
          }}
        />
      </div>
    </div>
  );
}
