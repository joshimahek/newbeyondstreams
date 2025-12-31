import { motion } from 'motion/react';
import illustration from 'figma:asset/26eb864145a951cdf1ae5beec3d0bf485c3aa8c6.png';

interface StartExplorationProps {
  onStart: () => void;
}

export function StartExploration({ onStart }: StartExplorationProps) {
  return (
    <div className="min-h-[calc(100vh-96px)] w-full flex items-center justify-center px-8 py-16 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '120px',
            height: '120px',
            backgroundColor: 'rgba(192, 232, 228, 0.25)',
            top: '15%',
            left: '10%',
            filter: 'blur(25px)'
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'rgba(255, 236, 110, 0.3)',
            top: '60%',
            right: '12%',
            filter: 'blur(20px)'
          }}
          animate={{
            y: [0, 25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '90px',
            height: '90px',
            backgroundColor: 'rgba(188, 231, 157, 0.25)',
            bottom: '20%',
            left: '18%',
            filter: 'blur(18px)'
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <img 
            src={illustration}
            alt="People exploring together"
            className="w-full max-w-md"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 
            style={{ 
              fontFamily: 'var(--font-hero)',
              color: 'var(--brand-text-primary)',
              fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
              lineHeight: '1.2'
            }}
          >
            This isn't a test.
          </h1>
          
          <p 
            style={{ 
              fontFamily: 'var(--font-heading)',
              color: 'var(--brand-text-secondary)',
              fontSize: '1.5rem',
              lineHeight: '1.8',
              maxWidth: '38rem',
              margin: '0 auto'
            }}
          >
            In just 5 minutes, you'll explore patterns in how you think and decide. No right answers. No labels. Just curiosity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-8"
        >
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            style={{
              fontFamily: 'var(--font-body)',
              backgroundColor: 'var(--brand-text-primary)',
              color: '#ffffff',
              padding: '1.125rem 3.5rem',
              borderRadius: '2rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.125rem'
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Let's Explore
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--brand-text-secondary)',
            fontSize: '0.95rem',
            marginTop: '2rem'
          }}
        >
          ⏱ Takes about 5 minutes
        </motion.p>
      </div>
    </div>
  );
}