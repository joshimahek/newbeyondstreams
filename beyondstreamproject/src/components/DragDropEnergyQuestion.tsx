import { motion } from 'motion/react';
import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useExplorationStore } from '../store/explorationStore';
import type { SignalKey } from '../store/explorationStore';

interface DragDropEnergyQuestionProps {
  onNext: () => void;
}

type CardType = {
  id: string;
  label: string;
  energizingSignals: Partial<Record<SignalKey, number>>;
  drainingSignals: Partial<Record<SignalKey, number>>;
};

const cards: CardType[] = [
  {
    id: 'meetings',
    label: 'Meetings',
    energizingSignals: { social: 2 },
    drainingSignals: { structured: 1 }
  },
  {
    id: 'deep-focus',
    label: 'Deep focus work',
    energizingSignals: { analytical: 2 },
    drainingSignals: { social: -1 }
  },
  {
    id: 'repetitive',
    label: 'Repetitive tasks',
    energizingSignals: { structured: 2 },
    drainingSignals: { exploratory: -1 }
  },
  {
    id: 'helping',
    label: 'Helping someone understand',
    energizingSignals: { social: 2 },
    drainingSignals: {}
  },
  {
    id: 'deadlines',
    label: 'Managing deadlines',
    energizingSignals: { structured: 2 },
    drainingSignals: {}
  },
  {
    id: 'creating',
    label: 'Creating something new',
    energizingSignals: { creative: 2, exploratory: 1 },
    drainingSignals: {}
  },
  {
    id: 'conflict',
    label: 'Handling conflict',
    energizingSignals: { social: 1, analytical: 1 },
    drainingSignals: { social: -1 }
  },
];

interface DraggableCardProps {
  card: CardType;
  zone: 'unassigned' | 'energizing' | 'draining';
}

function DraggableCard({ card, zone }: DraggableCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { id: card.id, fromZone: zone },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getCardColor = () => {
    if (zone === 'energizing') return { bg: '#BCE79D', border: '#BCE79D' };
    if (zone === 'draining') return { bg: '#E28383', border: '#E28383' };
    return { bg: '#C0E8E4', border: '#C0E8E4' };
  };

  const color = getCardColor();

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: isDragging ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--brand-text-primary)',
        fontSize: '1rem',
        padding: '1rem 1.5rem',
        borderRadius: '1rem',
        backgroundColor: zone === 'unassigned' ? `${color.bg}15` : `${color.bg}40`,
        border: `2px solid ${color.border}${zone === 'unassigned' ? '50' : ''}`,
        cursor: 'grab',
        userSelect: 'none',
        textAlign: 'center',
        boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      {card.label}
    </motion.div>
  );
}

interface DropZoneProps {
  zone: 'energizing' | 'draining';
  label: string;
  cards: string[];
  allCards: CardType[];
  onDrop: (cardId: string, fromZone: string) => void;
}

function DropZone({ zone, label, cards, allCards, onDrop }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item: { id: string; fromZone: string }) => {
      onDrop(item.id, item.fromZone);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const zoneColor = zone === 'energizing' 
    ? { bg: '#BCE79D', text: '#2C5F2D' } 
    : { bg: '#E28383', text: '#8B3A3A' };

  return (
    <div
      ref={drop}
      style={{
        flex: 1,
        minHeight: '280px',
        padding: '1.5rem',
        borderRadius: '1.25rem',
        backgroundColor: isOver ? `${zoneColor.bg}30` : `${zoneColor.bg}15`,
        border: `3px dashed ${isOver ? zoneColor.bg : `${zoneColor.bg}60`}`,
        transition: 'all 0.3s ease',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          color: zoneColor.text,
          fontSize: '1.125rem',
          marginBottom: '1.25rem',
          textAlign: 'center',
        }}
      >
        {label}
      </p>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem',
        minHeight: '200px'
      }}>
        {cards.length === 0 && (
          <div
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--brand-text-secondary)',
              fontSize: '0.9rem',
              textAlign: 'center',
              padding: '2rem 1rem',
              fontStyle: 'italic',
            }}
          >
            Drag cards here
          </div>
        )}
        {cards.map(cardId => {
          const card = allCards.find(c => c.id === cardId);
          if (!card) return null;
          return <DraggableCard key={cardId} card={card} zone={zone} />;
        })}
      </div>
    </div>
  );
}

function DragDropEnergyContent({ onNext }: DragDropEnergyQuestionProps) {
  const [cardZones, setCardZones] = useState<Record<string, 'unassigned' | 'energizing' | 'draining'>>(() => {
    const initial: Record<string, 'unassigned' | 'energizing' | 'draining'> = {};
    cards.forEach(card => {
      initial[card.id] = 'unassigned';
    });
    return initial;
  });

  const { addMultipleSignals, completeStep } = useExplorationStore();

  const handleDrop = (zone: 'energizing' | 'draining') => (cardId: string, fromZone: string) => {
    setCardZones(prev => ({
      ...prev,
      [cardId]: zone,
    }));
  };

  const handleContinue = () => {
    // Calculate signals
    const signals: Partial<Record<SignalKey, number>> = {};
    
    Object.entries(cardZones).forEach(([cardId, zone]) => {
      const card = cards.find(c => c.id === cardId);
      if (!card || zone === 'unassigned') return;

      const relevantSignals = zone === 'energizing' 
        ? card.energizingSignals 
        : card.drainingSignals;

      Object.entries(relevantSignals).forEach(([key, value]) => {
        const signalKey = key as SignalKey;
        signals[signalKey] = (signals[signalKey] || 0) + value;
      });
    });

    // Save to store
    addMultipleSignals(signals);
    completeStep('energy-question');
    
    // Proceed to next screen
    onNext();
  };

  const unassignedCards = Object.entries(cardZones)
    .filter(([_, zone]) => zone === 'unassigned')
    .map(([id]) => id);
  
  const energizingCards = Object.entries(cardZones)
    .filter(([_, zone]) => zone === 'energizing')
    .map(([id]) => id);
  
  const drainingCards = Object.entries(cardZones)
    .filter(([_, zone]) => zone === 'draining')
    .map(([id]) => id);

  const hasPlacedCards = energizingCards.length > 0 || drainingCards.length > 0;
  const progress = 30; // Second question in pivot flow

  return (
    <div className="min-h-[calc(100vh-96px)] w-full flex flex-col px-8 py-12">
      {/* Progress Bar */}
      <motion.div 
        className="max-w-5xl mx-auto w-full mb-12"
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
            initial={{ width: '15%' }}
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
      <div className="flex-1 flex flex-col">
        <div className="max-w-5xl mx-auto w-full space-y-8">
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
            In your recent work, what felt energizing vs draining?
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
              marginBottom: '2rem'
            }}
          >
            Drag cards into the zones that feel right
          </motion.p>

          {/* Drag and Drop Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}
          >
            <DropZone 
              zone="energizing" 
              label="Energizing ⚡" 
              cards={energizingCards}
              allCards={cards}
              onDrop={handleDrop('energizing')}
            />
            <DropZone 
              zone="draining" 
              label="Draining 🔋" 
              cards={drainingCards}
              allCards={cards}
              onDrop={handleDrop('draining')}
            />
          </motion.div>

          {/* Unassigned Cards */}
          {unassignedCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                padding: '1.5rem',
                borderRadius: '1.25rem',
                backgroundColor: 'rgba(192, 232, 228, 0.08)',
              }}
            >
              {unassignedCards.map(cardId => {
                const card = cards.find(c => c.id === cardId);
                if (!card) return null;
                return <DraggableCard key={cardId} card={card} zone="unassigned" />;
              })}
            </motion.div>
          )}

          {/* Continue Button */}
          {hasPlacedCards && (
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

export function DragDropEnergyQuestion(props: DragDropEnergyQuestionProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragDropEnergyContent {...props} />
    </DndProvider>
  );
}