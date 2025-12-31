import { motion } from 'motion/react';
import { useState } from 'react';
import illustration from 'figma:asset/c96b0e44f9cc532eccb13f54fcddc09445af5d39.png';

interface UserIntentScreenProps {
  onNext: (intent: string) => void;
}

export function UserIntentScreen({ onNext }: UserIntentScreenProps) {
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);

  const options = [
    { id: 'starting', label: "I'm starting out / exploring" },
    { id: 'shifting', label: "I'm considering a career shift" },
    { id: 'growing', label: "I'm growing in my current path" },
    { id: 'curious', label: "Just curious for now" }
  ];

  const handleSelect = (id: string) => {
    setSelectedIntent(id);
    // Auto-advance after a brief moment to show selection
    setTimeout(() => {
      onNext(id);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-96px)] w-full flex items-center justify-center px-8 py-16 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'rgba(192, 232, 228, 0.25)',
            top: '12%',
            left: '8%',
            filter: 'blur(20px)'
          }}
          animate={{
            y: [0, -25, 0],
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
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(226, 131, 131, 0.2)',
            top: '65%',
            right: '10%',
            filter: 'blur(18px)'
          }}
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <img 
            src={illustration}
            alt="People working together"
            className="w-full max-w-lg"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--brand-text-primary)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: '1.3',
            marginBottom: '3rem'
          }}
        >
          Which best describes you right now?
        </motion.h2>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {options.map((option, index) => {
            const isSelected = selectedIntent === option.id;
            const colors = [
              { bg: '#C0E8E4', border: '#C0E8E4' },
              { bg: '#BCE79D', border: '#BCE79D' },
              { bg: '#FFEC6E', border: '#FFEC6E' },
              { bg: '#E28383', border: '#E28383' }
            ];
            const color = colors[index];

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                onClick={() => handleSelect(option.id)}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: `0 12px 35px ${color.bg}50`
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--brand-text-primary)',
                  fontSize: '1.125rem',
                  padding: '2rem 1.5rem',
                  borderRadius: '1.5rem',
                  backgroundColor: isSelected ? `${color.bg}50` : `${color.bg}20`,
                  border: isSelected ? `3px solid ${color.border}` : `2px solid ${color.border}60`,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: color.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg 
                      width="14" 
                      height="10" 
                      viewBox="0 0 14 10" 
                      fill="none"
                      style={{ marginTop: '1px' }}
                    >
                      <path 
                        d="M1 5L5 9L13 1" 
                        stroke="var(--brand-text-primary)" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
                
                <span style={{ display: 'block', position: 'relative', zIndex: 1 }}>
                  {option.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--brand-text-secondary)',
            fontSize: '0.95rem',
            marginTop: '2rem'
          }}
        >
          Select one to continue
        </motion.p>
      </div>
    </div>
  );
}