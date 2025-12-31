import { motion } from 'motion/react';
import heroIllustration from 'figma:asset/3a7bdd222cf887f8f5d8169c55261dcce5901f8a.png';

interface HeroSectionProps {
  onTryNow: () => void;
}

export function HeroSection({ onTryNow }: HeroSectionProps) {
  return (
    <section className="w-full px-8 py-24 relative overflow-hidden">
      {/* Floating bubbles background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'rgba(192, 232, 228, 0.3)',
            top: '10%',
            left: '10%',
            filter: 'blur(20px)'
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
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
            width: '150px',
            height: '150px',
            backgroundColor: 'rgba(188, 231, 157, 0.25)',
            top: '60%',
            right: '15%',
            filter: 'blur(25px)'
          }}
          animate={{
            y: [0, 40, 0],
            x: [0, -25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 236, 110, 0.3)',
            bottom: '20%',
            left: '20%',
            filter: 'blur(15px)'
          }}
          animate={{
            y: [0, -25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left space-y-8"
        >
          <h1 
            style={{ 
              fontFamily: 'var(--font-hero)',
              color: 'var(--brand-text-primary)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: '1.2',
              marginBottom: '2rem'
            }}
          >
            Discover patterns in your curiosity
          </h1>
          
          <p 
            style={{ 
              fontFamily: 'var(--font-heading)',
              color: 'var(--brand-text-secondary)',
              fontSize: '1.5rem',
              lineHeight: '1.8'
            }}
          >
            This isn't a test. It's a 5-minute exploration of the signals that point toward your next direction.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-6 pt-8">
            <motion.button
              onClick={onTryNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              style={{
                fontFamily: 'var(--font-body)',
                backgroundColor: 'var(--brand-text-primary)',
                color: '#ffffff',
                padding: '1rem 3rem',
                borderRadius: '2rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              className="hover:opacity-90"
            >
              TRY NOW
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <img 
            src={heroIllustration}
            alt="Person exploring"
            className="w-full max-w-md lg:max-w-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}