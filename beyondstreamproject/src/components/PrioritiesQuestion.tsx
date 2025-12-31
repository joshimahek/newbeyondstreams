import { motion } from 'motion/react';
import { useState } from 'react';
import { useExplorationStore } from '../store/explorationStore';
import type { SignalKey } from '../store/explorationStore';

interface PrioritiesQuestionProps {
  onNext: () => void;
}

type OptionType = {
  id: string;
  label: string;
  signals: Partial<Record<SignalKey, number>>;
};

export function PrioritiesQuestion({ onNext }: PrioritiesQuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const { addMultipleSignals, completeStep } = useExplorationStore();

  const options: OptionType[] = [
    { 
      id: 'stability', 
      label: 'Stability & income', 
      signals: { structured: 2 }
    },
    { 
      id: 'flexibility', 
      label: 'Time flexibility', 
      signals: { exploratory: 1, creative: 1 }
    },
    { 
      id: 'growth', 
      label: 'Long-term growth', 
      signals: { analytical: 1, structured: 1 }
    },
    { 
      id: 'creative', 
      label: 'Creative freedom', 
      signals: { creative: 2 }
    },
    { 
      id: 'impact', 
      label: 'People impact', 
      signals: { social: 2 }
    },
    { 
      id: 'stress', 
      label: 'Low stress', 
      signals: { structured: 1 }
    },
  ];

  const toggleOption = (id: string) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      // Only allow up to 2 selections
      if (newSelected.size < 2) {
        newSelected.add(id);
      }
    }
    setSelectedOptions(newSelected);
  };

  const handleContinue = () => {
    // Calculate signals from selected options
    const signals: Partial<Record<SignalKey, number>> = {};
    selectedOptions.forEach(optionId => {
      const option = options.find(opt => opt.id === optionId);
      if (option) {
        Object.entries(option.signals).forEach(([key, value]) => {
          const signalKey = key as SignalKey;
          signals[signalKey] = (signals[signalKey] || 0) + value;
        });
      }
    });

    // Save to store
    addMultipleSignals(signals);
    completeStep('priorities-question');
    
    // Proceed to next screen
    onNext();
  };

  const progress = 45; // Third question in pivot flow

  return (
    <div className="min-h-[calc(100vh-96px)] w-full flex flex-col px-8 py-12">
      {/* Progress Bar */}
      <motion.div 
        className="max-w-3xl mx-auto w-full mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div 
          className="w-full h-3 rounded-full overflow-hidden"
          style={{
            backgroundColor: 'rgba(192, 232, 228, 0.25)',
          }}
        >
          <motion.div
            initial={{ width: '30%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, rgba(192, 232, 228, 0.8) 0%, rgba(188, 231, 157, 0.8) 100%)',
              borderRadius: '9999px',
            }}
          />
        </div>
      </motion.div>

      {/* Content Container */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl mx-auto w-full space-y-10">
          {/* Question */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ 
              fontFamily: 'var(--font-heading)',
              color: 'var(--brand-text-primary)',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              lineHeight: '1.3',
              textAlign: 'center',
              marginBottom: '3rem'
            }}
          >
            What matters most right now?
          </motion.h2>

          {/* Multi-select Options */}
          <div className="space-y-4">
            {options.map((option, index) => {
              const isSelected = selectedOptions.has(option.id);
              const isDisabled = !isSelected && selectedOptions.size >= 2;
              const colors = [
                { bg: '#C0E8E4', border: '#C0E8E4' },
                { bg: '#BCE79D', border: '#BCE79D' },
                { bg: '#FFEC6E', border: '#FFEC6E' },
                { bg: '#E28383', border: '#E28383' },
                { bg: '#C0E8E4', border: '#C0E8E4' },
                { bg: '#BCE79D', border: '#BCE79D' },
              ];
              const color = colors[index];

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
                  onClick={() => toggleOption(option.id)}
                  whileHover={!isDisabled ? { 
                    scale: 1.02,
                    x: 8
                  } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-body)',
                    color: isDisabled ? 'var(--brand-text-secondary)' : 'var(--brand-text-primary)',
                    fontSize: '1.125rem',
                    padding: '1.5rem 2rem',
                    borderRadius: '1.25rem',
                    backgroundColor: isSelected ? `${color.bg}40` : `${color.bg}15`,
                    border: isSelected ? `3px solid ${color.border}` : `2px solid ${color.border}${isDisabled ? '30' : '50'}`,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    opacity: isDisabled ? 0.5 : 1
                  }}
                  disabled={isDisabled}
                >
                  {/* Checkbox */}
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: isSelected ? `2px solid ${color.border}` : `2px solid ${color.border}80`,
                      backgroundColor: isSelected ? color.bg : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isSelected && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                        width="14" 
                        height="10" 
                        viewBox="0 0 14 10" 
                        fill="none"
                      >
                        <path 
                          d="M1 5L5 9L13 1" 
                          stroke="var(--brand-text-primary)" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    )}
                  </div>

                  {/* Label */}
                  <div style={{ flex: 1 }}>
                    <span>{option.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Helper text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            style={{ 
              fontFamily: 'var(--font-body)',
              color: 'var(--brand-text-secondary)',
              fontSize: '0.9rem',
              textAlign: 'center',
              marginTop: '1.5rem'
            }}
          >
            Select up to 2
          </motion.p>

          {/* Continue Button */}
          {selectedOptions.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center mt-8"
            >
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  fontFamily: 'var(--font-body)',
                  color: '#ffffff',
                  backgroundColor: 'var(--brand-text-primary)',
                  fontSize: '1.125rem',
                  padding: '1rem 3rem',
                  borderRadius: '2.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 24px rgba(59, 0, 101, 0.2)'
                }}
              >
                Continue
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
