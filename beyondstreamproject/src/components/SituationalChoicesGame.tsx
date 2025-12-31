import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useExplorationStore } from '../store/explorationStore';
import type { SignalKey } from '../store/explorationStore';

interface SituationalChoicesGameProps {
  onNext: () => void;
  currentStep?: number;
  totalSteps?: number;
}

type CardId = 'A' | 'B' | 'C' | 'D';

type ChoiceCard = {
  id: CardId;
  text: string;
  emoji: string;
};

const cards: ChoiceCard[] = [
  { id: 'A', text: 'You research before acting', emoji: '🔍' },
  { id: 'B', text: 'You experiment quickly', emoji: '⚡' },
  { id: 'C', text: 'You ask people first', emoji: '💬' },
  { id: 'D', text: 'You create a rough draft', emoji: '✏️' },
];

// Signal mapping based on combinations
type CombinationResult = {
  signals: SignalKey[];
  meaning: string;
};

const combinationSignals: Record<string, CombinationResult> = {
  'A-D': { signals: ['analytical', 'creative'], meaning: 'Think → build' },
  'D-A': { signals: ['analytical', 'creative'], meaning: 'Think → build' },
  'B-D': { signals: ['exploratory'], meaning: 'Try & iterate' },
  'D-B': { signals: ['exploratory'], meaning: 'Try & iterate' },
  'C-A': { signals: ['social', 'analytical'], meaning: 'People-informed logic' },
  'A-C': { signals: ['social', 'analytical'], meaning: 'People-informed logic' },
  'C-D': { signals: ['social', 'creative'], meaning: 'Co-creation' },
  'D-C': { signals: ['social', 'creative'], meaning: 'Co-creation' },
  'A-B': { signals: ['analytical', 'exploratory'], meaning: 'Balanced risk' },
  'B-A': { signals: ['analytical', 'exploratory'], meaning: 'Balanced risk' },
};

export function SituationalChoicesGame({ onNext, currentStep = 4, totalSteps = 5 }: SituationalChoicesGameProps) {
  const [selectedCards, setSelectedCards] = useState<Set<CardId>>(new Set());
  const { addSignal, completeStep } = useExplorationStore();

  const handleCardClick = (cardId: CardId) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else if (newSet.size < 2) {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleContinue = () => {
    if (selectedCards.size !== 2) return;

    const [card1, card2] = Array.from(selectedCards);
    const combinationKey = `${card1}-${card2}`;
    const result = combinationSignals[combinationKey];

    if (result) {
      // Add each signal with weight
      result.signals.forEach(signal => {
        addSignal(signal, 3);
      });
      
      completeStep('situational-choices-game');
      
      console.log('Situational Choices Results:', {
        selected: Array.from(selectedCards),
        signals: result.signals,
        meaning: result.meaning,
      });
    }

    onNext();
  };

  const canContinue = selectedCards.size === 2;

  return (
    <div className="min-h-screen w-full flex flex-col px-8 py-8">
      {/* Progress Bar */}
      <div style={{ marginBottom: '3rem' }}>
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(192, 232, 228, 0.3)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: '100%',
              backgroundColor: 'var(--brand-text-primary)',
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--brand-text-primary)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              }}
            >
              When starting something new, you tend to...
            </h3>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--brand-text-secondary)',
              fontSize: '1rem',
            }}
          >
            Pick the two that feel most like you.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
            maxWidth: '800px',
            width: '100%',
            marginBottom: '3rem',
          }}
        >
          {cards.map((card, index) => {
            const isSelected = selectedCards.has(card.id);
            const isDisabled = !isSelected && selectedCards.size >= 2;

            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isDisabled ? 0.4 : 1,
                  scale: isSelected ? 1.05 : 1,
                }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => !isDisabled && handleCardClick(card.id)}
                whileHover={!isDisabled ? { scale: isSelected ? 1.05 : 1.03, y: -4 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                style={{
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  padding: '2.5rem 2rem',
                  borderRadius: '1.5rem',
                  border: isSelected 
                    ? `4px solid var(--brand-text-primary)` 
                    : '4px solid rgba(192, 232, 228, 0.3)',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.5rem',
                  boxShadow: isSelected
                    ? '0 12px 32px rgba(59, 0, 101, 0.2)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  minHeight: '180px',
                }}
              >
                {/* Card Label */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(192, 232, 228, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    color: 'var(--brand-text-primary)',
                  }}
                >
                  {card.id}
                </div>

                {/* Selected Checkmark */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '1.25rem',
                      }}
                    >
                      ✓
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Emoji Icon */}
                <div
                  style={{
                    fontSize: '3rem',
                    marginTop: '0.5rem',
                  }}
                >
                  {card.emoji}
                </div>

                {/* Card Text */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--brand-text-primary)',
                    fontSize: '1.125rem',
                    textAlign: 'center',
                    lineHeight: '1.5',
                    margin: 0,
                  }}
                >
                  {card.text}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Continue Button */}
        <AnimatePresence>
          {canContinue && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
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
                boxShadow: '0 8px 24px rgba(59, 0, 101, 0.2)',
                zIndex: 10,
              }}
            >
              Continue
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}