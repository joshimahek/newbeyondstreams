import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useExplorationStore } from '../store/explorationStore';
import type { SignalKey } from '../store/explorationStore';

interface AdviceVoicesGameProps {
  onNext: () => void;
  currentStep?: number;
  totalSteps?: number;
}

type VoiceId = 'mentor' | 'peer' | 'data' | 'inner';

type VoiceCard = {
  id: VoiceId;
  icon: string;
  title: string;
  description: string;
  tone: string;
  color: string;
  signalBoost: SignalKey;
};

const voices: VoiceCard[] = [
  {
    id: 'mentor',
    icon: '🧓',
    title: 'The Experienced Mentor',
    description: '"You\'ve built something solid already. Big shifts come with hidden costs. Stability compounds over time."',
    tone: 'Calm, grounded',
    color: '#C0E8E4',
    signalBoost: 'structured',
  },
  {
    id: 'peer',
    icon: '🧑‍🤝‍🧑',
    title: 'The Peer (Same Stage as You)',
    description: '"Honestly? This is the perfect time. You\'ll figure things out faster once you\'re in motion."',
    tone: 'Energetic, relatable',
    color: '#BCE79D',
    signalBoost: 'social',
  },
  {
    id: 'data',
    icon: '📊',
    title: 'The Data Snapshot',
    description: '"People making similar moves report mixed outcomes. Success depends heavily on preparation and timing."',
    tone: 'Neutral, factual',
    color: '#FFEC6E',
    signalBoost: 'analytical',
  },
  {
    id: 'inner',
    icon: '🌱',
    title: 'Your Inner Voice',
    description: '"This excites you — even if it\'s unclear. You don\'t have all the answers, but staying still feels wrong."',
    tone: 'Personal, intuitive',
    color: '#E28383',
    signalBoost: 'exploratory',
  },
];

const reflectionOptions = [
  { id: 'realistic', label: 'It felt realistic' },
  { id: 'safe', label: 'It felt safe' },
  { id: 'instincts', label: 'It matched my instincts' },
  { id: 'uncertainty', label: 'It reduced uncertainty' },
  { id: 'confidence', label: 'It gave me confidence' },
];

export function AdviceVoicesGame({ onNext, currentStep = 1, totalSteps = 5 }: AdviceVoicesGameProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [phase, setPhase] = useState<'choose' | 'avoid' | 'reflect'>('choose');
  const [chosenVoice, setChosenVoice] = useState<VoiceId | null>(null);
  const [avoidedVoice, setAvoidedVoice] = useState<VoiceId | null>(null);
  const [reflection, setReflection] = useState<string | null>(null);

  const { addMultipleSignals, setDecisionStyle, completeStep } = useExplorationStore();

  const handleChooseVoice = (voiceId: VoiceId) => {
    setChosenVoice(voiceId);
    setTimeout(() => {
      setPhase('avoid');
    }, 800);
  };

  const handleAvoidVoice = (voiceId: VoiceId) => {
    if (voiceId === chosenVoice) return; // Can't avoid the chosen voice
    setAvoidedVoice(voiceId);
    setTimeout(() => {
      setPhase('reflect');
    }, 800);
  };

  const handleReflection = (optionId: string) => {
    setReflection(optionId);
    setTimeout(() => {
      calculateAndSaveResults(optionId);
    }, 600);
  };

  const calculateAndSaveResults = (reflectionChoice: string) => {
    if (!chosenVoice || !avoidedVoice) return;

    // Signal mapping based on chosen voice
    const signals: Partial<Record<SignalKey, number>> = {};
    const chosenCard = voices.find(v => v.id === chosenVoice);
    if (chosenCard) {
      signals[chosenCard.signalBoost] = 3;
    }

    // Additional signals from avoided voice
    const avoidedCard = voices.find(v => v.id === avoidedVoice);
    if (avoidedCard) {
      // Avoiding a voice slightly boosts its opposite
      const oppositeSignals: Record<VoiceId, SignalKey> = {
        mentor: 'exploratory',
        peer: 'structured',
        data: 'social',
        inner: 'analytical',
      };
      const oppositeSignal = oppositeSignals[avoidedVoice];
      signals[oppositeSignal] = (signals[oppositeSignal] || 0) + 1;
    }

    // Decision style metadata
    const riskToleranceMap: Record<VoiceId, 'low' | 'medium-low' | 'medium-high' | 'high'> = {
      mentor: 'low',
      data: 'medium-low',
      peer: 'medium-high',
      inner: 'high',
    };

    const authorityBiasMap: Record<VoiceId, 'low' | 'medium' | 'high'> = {
      inner: 'low',
      peer: 'medium',
      data: 'medium',
      mentor: 'high',
    };

    const decisionModeMap: Record<VoiceId, 'intuition-led' | 'data-driven' | 'experience-driven' | 'action-biased'> = {
      inner: 'intuition-led',
      data: 'data-driven',
      mentor: 'experience-driven',
      peer: 'action-biased',
    };

    // Save to store
    addMultipleSignals(signals);
    setDecisionStyle({
      riskTolerance: riskToleranceMap[chosenVoice],
      authorityBias: authorityBiasMap[chosenVoice],
      decisionMode: decisionModeMap[chosenVoice],
    });
    completeStep('advice-voices-game');

    console.log('Advice Voices Results:', {
      chosen: chosenVoice,
      avoided: avoidedVoice,
      reflection: reflectionChoice,
      signals,
      decisionStyle: {
        riskTolerance: riskToleranceMap[chosenVoice],
        authorityBias: authorityBiasMap[chosenVoice],
        decisionMode: decisionModeMap[chosenVoice],
      },
    });

    onNext();
  };

  if (showIntro) {
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

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-3xl mx-auto w-full space-y-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: '3.5rem',
                marginBottom: '1rem',
              }}
            >
              🎭
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--brand-text-primary)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                lineHeight: '1.3',
                marginBottom: '1.5rem',
              }}
            >
              You're at a crossroads.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--brand-text-secondary)',
                fontSize: '1.125rem',
                lineHeight: '1.8',
                marginBottom: '2rem',
              }}
            >
              <p style={{ marginBottom: '1rem' }}>
                You asked for advice — and now you have too much of it.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                You're considering a career move that could shape the next few years.
              </p>
              <p
                style={{
                  color: 'var(--brand-text-primary)',
                  fontStyle: 'italic',
                  marginTop: '1.5rem',
                }}
              >
                There's no right choice here.
                <br />
                We're observing how you decide when clarity is missing.
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              onClick={() => setShowIntro(false)}
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
                marginTop: '2rem',
                boxShadow: '0 8px 24px rgba(59, 0, 101, 0.2)',
              }}
            >
              See The Advice
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'reflect') {
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
            <div
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--brand-text-primary)',
              }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-2xl mx-auto w-full space-y-8">
            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--brand-text-primary)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                textAlign: 'center',
                marginBottom: '2rem',
              }}
            >
              What made this voice stand out?
            </motion.h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reflectionOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  onClick={() => handleReflection(option.id)}
                  whileHover={{ scale: 1.02, x: 8 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: reflection === option.id ? '#ffffff' : 'var(--brand-text-primary)',
                    backgroundColor:
                      reflection === option.id
                        ? 'var(--brand-text-primary)'
                        : 'rgba(192, 232, 228, 0.15)',
                    fontSize: '1.125rem',
                    padding: '1.25rem 2rem',
                    borderRadius: '1rem',
                    border: `2px solid ${
                      reflection === option.id ? 'var(--brand-text-primary)' : 'rgba(192, 232, 228, 0.4)'
                    }`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div
            style={{
              width: `${(currentStep / totalSteps) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--brand-text-primary)',
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--brand-text-primary)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              marginBottom: '0.75rem',
            }}
          >
            {phase === 'choose'
              ? 'Which voice influences you the most right now?'
              : 'Which voice would you consciously set aside?'}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--brand-text-secondary)',
              fontSize: '1rem',
            }}
          >
            {phase === 'choose' ? 'Tap a card to select it' : 'Tap a card to distance from it'}
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          <AnimatePresence>
            {voices.map((voice, index) => {
              const isChosen = chosenVoice === voice.id;
              const isAvoided = avoidedVoice === voice.id;
              const isDisabled = phase === 'avoid' && chosenVoice === voice.id;

              return (
                <motion.button
                  key={voice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isAvoided ? 0.4 : 1,
                    y: 0,
                    scale: isChosen ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => {
                    if (phase === 'choose') {
                      handleChooseVoice(voice.id);
                    } else if (phase === 'avoid' && !isDisabled) {
                      handleAvoidVoice(voice.id);
                    }
                  }}
                  disabled={isDisabled}
                  whileHover={!isDisabled ? { scale: 1.04, y: -4 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  style={{
                    fontFamily: 'var(--font-body)',
                    backgroundColor: '#ffffff',
                    padding: '1.75rem',
                    borderRadius: '1rem',
                    border: `3px solid ${
                      isChosen ? voice.color : isAvoided ? '#cccccc' : `${voice.color}40`
                    }`,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    boxShadow: isChosen
                      ? `0 12px 32px ${voice.color}60`
                      : '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    opacity: isDisabled ? 0.5 : 1,
                    position: 'relative',
                  }}
                >
                  {/* Icon badge */}
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: `${voice.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {voice.icon}
                  </div>

                  {/* Title */}
                  <h4
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--brand-text-primary)',
                      fontSize: '1.125rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {voice.title}
                  </h4>

                  {/* Tone */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--brand-text-secondary)',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                      marginBottom: '1rem',
                    }}
                  >
                    {voice.tone}
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--brand-text-secondary)',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                    }}
                  >
                    {voice.description}
                  </p>

                  {/* Selected indicator */}
                  {isChosen && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: voice.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--brand-text-primary)',
                        fontSize: '1.125rem',
                      }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
