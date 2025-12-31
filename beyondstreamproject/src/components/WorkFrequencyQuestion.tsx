import { motion } from 'motion/react';
import { useState } from 'react';
import { useExplorationStore } from '../store/explorationStore';
import type { SignalKey } from '../store/explorationStore';

interface WorkFrequencyQuestionProps {
  onNext: () => void;
}

type Frequency = 'often' | 'sometimes' | 'rarely';

type ActivityType = {
  id: string;
  label: string;
  signals: Record<Frequency, Partial<Record<SignalKey, number>>>;
};

const activities: ActivityType[] = [
  {
    id: 'communicating',
    label: 'Communicating ideas',
    signals: {
      often: { social: 2 },
      sometimes: { social: 1 },
      rarely: {}
    }
  },
  {
    id: 'planning',
    label: 'Planning & organizing',
    signals: {
      often: { structured: 2 },
      sometimes: { structured: 1 },
      rarely: {}
    }
  },
  {
    id: 'solving',
    label: 'Solving unclear problems',
    signals: {
      often: { analytical: 2 },
      sometimes: { analytical: 1 },
      rarely: {}
    }
  },
  {
    id: 'collaborating',
    label: 'Collaborating with others',
    signals: {
      often: { social: 2 },
      sometimes: { social: 1 },
      rarely: {}
    }
  },
  {
    id: 'learning',
    label: 'Learning new tools',
    signals: {
      often: { exploratory: 2 },
      sometimes: { exploratory: 1 },
      rarely: {}
    }
  },
];

export function WorkFrequencyQuestion({ onNext }: WorkFrequencyQuestionProps) {
  const [selections, setSelections] = useState<Record<string, Frequency>>({});
  const { addMultipleSignals, completeStep } = useExplorationStore();

  const handleSelect = (activityId: string, frequency: Frequency) => {
    setSelections(prev => ({
      ...prev,
      [activityId]: frequency
    }));
  };

  const handleContinue = () => {
    // Calculate signals from selections
    const signals: Partial<Record<SignalKey, number>> = {};
    
    Object.entries(selections).forEach(([activityId, frequency]) => {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      const relevantSignals = activity.signals[frequency];
      Object.entries(relevantSignals).forEach(([key, value]) => {
        const signalKey = key as SignalKey;
        signals[signalKey] = (signals[signalKey] || 0) + value;
      });
    });

    // Save to store
    addMultipleSignals(signals);
    completeStep('work-frequency-question');
    
    // Proceed to next screen
    onNext();
  };

  const allAnswered = activities.every(activity => selections[activity.id]);
  const progress = 15; // First question in growth flow

  return (
    <div className="min-h-[calc(100vh-96px)] w-full flex flex-col px-8 py-12">
      {/* Progress Bar */}
      <motion.div 
        className="max-w-4xl mx-auto w-full mb-12"
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
            initial={{ width: 0 }}
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
        <div className="max-w-4xl mx-auto w-full space-y-10">
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
              marginBottom: '1rem'
            }}
          >
            Which of these show up most in your work?
          </motion.h2>

          {/* Helper text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ 
              fontFamily: 'var(--font-body)',
              color: 'var(--brand-text-secondary)',
              fontSize: '0.95rem',
              textAlign: 'center',
              marginBottom: '3rem'
            }}
          >
            Rate each activity
          </motion.p>

          {/* Rating Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              backgroundColor: 'rgba(192, 232, 228, 0.08)',
              borderRadius: '1.5rem',
              padding: '2rem',
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid rgba(192, 232, 228, 0.3)',
              }}
            >
              <div></div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--brand-text-primary)',
                  fontSize: '0.95rem',
                  textAlign: 'center',
                }}
              >
                Often
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--brand-text-primary)',
                  fontSize: '0.95rem',
                  textAlign: 'center',
                }}
              >
                Sometimes
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--brand-text-primary)',
                  fontSize: '0.95rem',
                  textAlign: 'center',
                }}
              >
                Rarely
              </div>
            </div>

            {/* Activity Rows */}
            {activities.map((activity, index) => {
              const colors = [
                '#C0E8E4',
                '#BCE79D',
                '#FFEC6E',
                '#E28383',
                '#C0E8E4',
              ];
              const color = colors[index];

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    gap: '1rem',
                    alignItems: 'center',
                    padding: '1.25rem 0',
                    borderBottom: index < activities.length - 1 ? '1px solid rgba(192, 232, 228, 0.2)' : 'none',
                  }}
                >
                  {/* Activity Label */}
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--brand-text-primary)',
                      fontSize: '1.05rem',
                    }}
                  >
                    {activity.label}
                  </div>

                  {/* Radio Buttons */}
                  {(['often', 'sometimes', 'rarely'] as Frequency[]).map((frequency) => {
                    const isSelected = selections[activity.id] === frequency;
                    
                    return (
                      <div
                        key={frequency}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <motion.button
                          onClick={() => handleSelect(activity.id, frequency)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: isSelected ? `3px solid ${color}` : `2px solid ${color}80`,
                            backgroundColor: isSelected ? `${color}60` : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: color,
                              }}
                            />
                          )}
                        </motion.button>
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Continue Button */}
          {allAnswered && (
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
