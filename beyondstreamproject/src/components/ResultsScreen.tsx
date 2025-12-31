import { useExplorationStore } from '../store/explorationStore';

interface ResultsScreenProps {
  onBack?: () => void;
}

export function ResultsScreen({ onBack }: ResultsScreenProps) {
  const { signals } = useExplorationStore();

  // Convert signals object to array and sort by score
  const sortedSignals = Object.entries(signals)
    .map(([key, value]) => ({ name: key, score: value }))
    .sort((a, b) => b.score - a.score);

  // Get top 3
  const top3 = sortedSignals.slice(0, 3);

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--brand-text-primary)',
          fontSize: '2.5rem',
          marginBottom: '3rem',
          textAlign: 'center',
        }}
      >
        Your Top Patterns
      </h1>

      <div
        style={{
          maxWidth: '600px',
          width: '100%',
        }}
      >
        {top3.map((signal, index) => (
          <div
            key={signal.name}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '1.5rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--brand-text-secondary)',
                  fontSize: '0.875rem',
                }}
              >
                #{index + 1}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--brand-text-primary)',
                  fontSize: '1.25rem',
                  margin: '0.5rem 0 0 0',
                  textTransform: 'capitalize',
                }}
              >
                {signal.name}
              </h3>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--brand-text-primary)',
                fontSize: '2rem',
              }}
            >
              {signal.score}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--brand-text-secondary)',
            fontSize: '0.875rem',
          }}
        >
          Debug: All Signals
        </p>
        <pre
          style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px',
            marginTop: '0.5rem',
          }}
        >
          {JSON.stringify(signals, null, 2)}
        </pre>
      </div>

      {onBack && (
        <button
          onClick={onBack}
          style={{
            marginTop: '2rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--brand-text-primary)',
            backgroundColor: 'transparent',
            border: '2px solid var(--brand-text-primary)',
            padding: '0.75rem 2rem',
            borderRadius: '2rem',
            cursor: 'pointer',
          }}
        >
          Back to Home
        </button>
      )}
    </div>
  );
}
