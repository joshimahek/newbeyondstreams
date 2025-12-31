import { motion } from 'motion/react';
import { ArrowLeft, X } from 'lucide-react';
import logo from 'figma:asset/a6b8ce640962a17bd33cdd447ae70c2d8244dd6c.png';

interface ExplorationNavProps {
  onBack?: () => void;
  onExit: () => void;
  showBack?: boolean;
}

export function ExplorationNav({ onBack, onExit, showBack = false }: ExplorationNavProps) {
  return (
    <nav 
      className="w-full px-8 py-6"
      style={{
        backgroundColor: 'rgba(226, 131, 131, 0.12)',
        borderBottom: '1px solid rgba(226, 131, 131, 0.3)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Back button */}
        <div className="w-24">
          {showBack && onBack && (
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--brand-text-secondary)',
                backgroundColor: 'transparent',
                border: `2px solid var(--brand-text-secondary)`,
                borderRadius: '2rem',
                padding: '0.5rem 1.25rem',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
              className="hover:opacity-80 transition-opacity"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </motion.button>
          )}
        </div>

        {/* Centered logo */}
        <div className="flex-1 flex justify-center">
          <img 
            src={logo}
            alt="BeyondStreams"
            className="h-16 w-auto"
          />
        </div>

        {/* Exit button */}
        <div className="w-24 flex justify-end">
          <motion.button
            onClick={onExit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-body)',
              color: 'var(--brand-text-secondary)',
              backgroundColor: 'transparent',
              border: `2px solid var(--brand-text-secondary)`,
              borderRadius: '2rem',
              padding: '0.5rem 1.25rem',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
            className="hover:opacity-80 transition-opacity"
          >
            <span>Exit</span>
            <X size={18} />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}