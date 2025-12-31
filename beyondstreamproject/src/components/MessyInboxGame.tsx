import { motion } from 'motion/react';
import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useExplorationStore } from '../store/explorationStore';
import type { SignalKey } from '../store/explorationStore';

interface MessyInboxGameProps {
  onNext: () => void;
  currentStep?: number;
  totalSteps?: number;
}

type MessageType = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  primarySignal: SignalKey | 'execution';
  secondarySignal?: SignalKey | 'empathy' | 'execution';
};

const messages: MessageType[] = [
  {
    id: 'client-escalation',
    sender: 'Paying Client',
    subject: '"Urgent — this is blocking our launch"',
    preview: '"Hey, we\'re stuck and this needs clarity today. Please advise."',
    primarySignal: 'social',
    secondarySignal: 'execution'
  },
  {
    id: 'data-report',
    sender: 'Analytics System',
    subject: '"Weekly performance anomaly detected"',
    preview: '"Conversion dropped 18% in one segment. Requires review."',
    primarySignal: 'analytical',
    secondarySignal: 'structured'
  },
  {
    id: 'teammate-help',
    sender: 'Colleague',
    subject: '"Quick help?"',
    preview: '"Can you review this before I send it out? I\'m unsure."',
    primarySignal: 'social',
    secondarySignal: 'empathy'
  },
  {
    id: 'leadership-update',
    sender: 'Manager',
    subject: '"Need your thoughts"',
    preview: '"Please share your view on the new direction by EOD."',
    primarySignal: 'structured',
    secondarySignal: 'analytical'
  },
  {
    id: 'process-reminder',
    sender: 'Internal Tool',
    subject: '"Pending documentation overdue"',
    preview: '"Two tasks are past their expected update window."',
    primarySignal: 'structured',
    secondarySignal: 'execution'
  },
  {
    id: 'learning-opportunity',
    sender: 'Newsletter',
    subject: '"5 insights you might find useful"',
    preview: '"Curated ideas relevant to your work."',
    primarySignal: 'exploratory',
    secondarySignal: 'analytical'
  },
];

const ItemTypes = {
  MESSAGE: 'message',
};

interface DraggableMessageProps {
  message: MessageType;
  index: number;
  isSelected: boolean;
}

function DraggableMessage({ message, index, isSelected }: DraggableMessageProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.MESSAGE,
    item: { message },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Generate initials from sender
  const getInitials = (sender: string) => {
    const words = sender.split(' ');
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return sender.substring(0, 2);
  };

  const avatarColors = ['#C0E8E4', '#BCE79D', '#FFEC6E', '#E28383', '#C0E8E4', '#BCE79D'];
  const avatarBg = avatarColors[index];

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.875rem 1rem',
        backgroundColor: isSelected ? 'rgba(192, 232, 228, 0.08)' : '#ffffff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        cursor: isSelected ? 'default' : 'grab',
        opacity: isSelected ? 0.35 : 1,
        pointerEvents: isSelected ? 'none' : 'auto',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
      whileHover={!isSelected ? {
        backgroundColor: 'rgba(192, 232, 228, 0.05)',
      } : {}}
    >
      {/* Unread indicator */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#7C3AED',
          flexShrink: 0,
        }}
      />

      {/* Avatar */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: avatarBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--brand-text-primary)',
        }}
      >
        {getInitials(message.sender)}
      </div>

      {/* Message content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--brand-text-primary)',
            }}
          >
            {message.sender}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--brand-text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {message.subject}
          </span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--brand-text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {message.preview}
        </div>
      </div>

      {/* Star icon */}
      <div
        style={{
          flexShrink: 0,
          opacity: 0.4,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    </motion.div>
  );
}

interface DropSlotProps {
  position: number;
  message: MessageType | null;
  onDrop: (message: MessageType, position: number) => void;
  onRemove: (position: number) => void;
}

function DropSlot({ position, message, onDrop, onRemove }: DropSlotProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.MESSAGE,
    drop: (item: { message: MessageType }) => {
      onDrop(item.message, position);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const colors = ['#C0E8E4', '#BCE79D', '#FFEC6E'];
  const color = colors[position - 1];

  return (
    <div
      ref={drop}
      style={{
        minHeight: '140px',
        padding: '1.25rem',
        borderRadius: '1rem',
        backgroundColor: isOver ? `${color}30` : message ? `${color}20` : `${color}08`,
        border: `2px dashed ${isOver ? color : `${color}60`}`,
        transition: 'all 0.2s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Position Badge */}
      <div
        style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          color: 'var(--brand-text-primary)',
        }}
      >
        {position}
      </div>

      {/* Remove button - only show when message exists */}
      {message && (
        <button
          onClick={() => onRemove(position)}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--brand-text-secondary)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {message ? (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--brand-text-secondary)',
              }}
            >
              {message.sender}
            </span>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--brand-text-primary)',
              }}
            >
              {message.subject}
            </span>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--brand-text-secondary)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
            Drop message here
          </span>
        </div>
      )}
    </div>
  );
}

function MessyInboxGameContent({ onNext, currentStep, totalSteps }: MessyInboxGameProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedMessages, setSelectedMessages] = useState<{
    1: MessageType | null;
    2: MessageType | null;
    3: MessageType | null;
  }>({ 1: null, 2: null, 3: null });
  
  const { addMultipleSignals, addBehavioralBias, completeStep } = useExplorationStore();

  const handleDrop = (message: MessageType, position: number) => {
    // Check if message is already selected in another position
    const currentPosition = Object.entries(selectedMessages).find(
      ([_, msg]) => msg?.id === message.id
    )?.[0];

    if (currentPosition) {
      // Remove from current position
      setSelectedMessages(prev => ({
        ...prev,
        [currentPosition]: null,
        [position]: message,
      }));
    } else {
      setSelectedMessages(prev => ({
        ...prev,
        [position]: message,
      }));
    }
  };

  const handleRemove = (position: number) => {
    setSelectedMessages(prev => ({
      ...prev,
      [position]: null,
    }));
  };

  const handleContinue = () => {
    // Calculate signals from selected messages
    const signals: Partial<Record<SignalKey, number>> = {};
    let executionBias = 0;
    let empathyBias = 0;

    // Order-based multipliers
    const multipliers = { 1: 1.5, 2: 1.2, 3: 1.0 };

    Object.entries(selectedMessages).forEach(([position, message]) => {
      if (!message) return;

      const multiplier = multipliers[position as unknown as keyof typeof multipliers];

      // Primary signal
      if (message.primarySignal === 'execution') {
        executionBias += 2 * multiplier;
      } else {
        signals[message.primarySignal] = (signals[message.primarySignal] || 0) + 2 * multiplier;
      }

      // Secondary signal
      if (message.secondarySignal === 'execution') {
        executionBias += 1 * multiplier;
      } else if (message.secondarySignal === 'empathy') {
        empathyBias += 1 * multiplier;
      } else if (message.secondarySignal) {
        signals[message.secondarySignal as SignalKey] = (signals[message.secondarySignal as SignalKey] || 0) + 1 * multiplier;
      }
    });

    // Save to store
    addMultipleSignals(signals);
    addBehavioralBias('executionBias', executionBias);
    addBehavioralBias('empathyBias', empathyBias);
    completeStep('messy-inbox-game');

    // Debug log
    console.log('Inbox Game Results:', { signals, executionBias, empathyBias });

    // Proceed to next screen
    onNext();
  };

  const allSelected = selectedMessages[1] && selectedMessages[2] && selectedMessages[3];
  const selectedIds = new Set(
    Object.values(selectedMessages).filter(Boolean).map(msg => msg!.id)
  );

  if (showIntro) {
    return (
      <div className="min-h-[calc(100vh-96px)] w-full flex flex-col px-8 py-8">
        {/* Progress Bar */}
        {currentStep && totalSteps && (
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
        )}

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-3xl mx-auto w-full space-y-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: '3rem',
                marginBottom: '1rem',
              }}
            >
              📧
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
                marginBottom: '1.5rem'
              }}
            >
              You've just opened your inbox.
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
                You have 25 minutes before your next commitment.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                You can properly handle only 3 messages.
              </p>
              <p style={{ 
                color: 'var(--brand-text-primary)',
                fontStyle: 'italic',
                marginTop: '1.5rem'
              }}>
                There's no "right" answer — we're just observing how you think.
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
              Start
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-96px)] w-full px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Instructions */}
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
              marginBottom: '0.5rem',
            }}
          >
            Pick and arrange the 3 messages you'd handle first.
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--brand-text-secondary)',
              fontSize: '1rem',
            }}
          >
            Drag messages to prioritize them (1 → 2 → 3)
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* Inbox - looks like real email */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                paddingLeft: '1rem',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--brand-text-primary)',
                  fontSize: '1.25rem',
                }}
              >
                Inbox
              </h4>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--brand-text-secondary)',
                  fontSize: '0.875rem',
                }}
              >
                {6 - selectedIds.size} messages
              </span>
            </div>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
            >
              {messages.map((message, index) => (
                <DraggableMessage
                  key={message.id}
                  message={message}
                  index={index}
                  isSelected={selectedIds.has(message.id)}
                />
              ))}
            </div>
          </div>

          {/* Handle First Area */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--brand-text-primary)',
                fontSize: '1.125rem',
                marginBottom: '1.25rem',
                paddingLeft: '0.5rem',
              }}
            >
              Handle First
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <DropSlot
                position={1}
                message={selectedMessages[1]}
                onDrop={handleDrop}
                onRemove={handleRemove}
              />
              <DropSlot
                position={2}
                message={selectedMessages[2]}
                onDrop={handleDrop}
                onRemove={handleRemove}
              />
              <DropSlot
                position={3}
                message={selectedMessages[3]}
                onDrop={handleDrop}
                onRemove={handleRemove}
              />
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {allSelected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mt-12"
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
                boxShadow: '0 8px 24px rgba(59, 0, 101, 0.2)',
              }}
            >
              Continue
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function MessyInboxGame({ onNext, currentStep, totalSteps }: MessyInboxGameProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <MessyInboxGameContent onNext={onNext} currentStep={currentStep} totalSteps={totalSteps} />
    </DndProvider>
  );
}