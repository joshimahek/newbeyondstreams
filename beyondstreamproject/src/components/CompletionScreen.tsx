import { motion } from 'motion/react';

interface CompletionScreenProps {
  onContinue: () => void;
}

export function CompletionScreen({ onContinue }: CompletionScreenProps) {
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          maxWidth: '600px',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          style={{
            fontSize: '4rem',
            marginBottom: '2rem',
          }}
        >
          ✨
        </motion.div>

        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--brand-text-primary)',
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
          }}
        >
          All done!
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--brand-text-secondary)',
            fontSize: '1.125rem',
            marginBottom: '3rem',
            lineHeight: '1.6',
          }}
        >
          You've completed the exploration. Ready to see what patterns emerged from your choices?
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          style={{
            fontFamily: 'var(--font-body)',
            color: '#ffffff',
            backgroundColor: 'var(--brand-text-primary)',
            fontSize: '1.125rem',
            padding: '1rem 3rem',
            borderRadius: '2.5rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(59, 0, 101, 0.2)',
          }}
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  );
}
