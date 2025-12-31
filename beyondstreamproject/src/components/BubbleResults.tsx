import { motion, AnimatePresence } from 'motion/react';
import { useExplorationStore } from '../store/explorationStore';
import { useMemo, useState } from 'react';
import { ClusterRoles } from './ClusterRoles';

// Signal display names and overviews
const signalInfo: Record<string, { name: string; overview: string }> = {
  analytical: {
    name: 'Data & Insights',
    overview: 'Roles in this space focus on understanding complexity, finding patterns, and solving problems through careful analysis and systematic thinking.',
  },
  creative: {
    name: 'Expression & Creation',
    overview: 'Roles in this space focus on bringing ideas to life, designing experiences, and communicating through visual, written, or conceptual forms.',
  },
  social: {
    name: 'People & Community',
    overview: 'Roles in this space focus on supporting others, building connections, and helping people grow through collaboration and communication.',
  },
  structured: {
    name: 'Systems & Operations',
    overview: 'Roles in this space focus on organizing work, maintaining systems, and ensuring projects and operations run smoothly and reliably.',
  },
  exploratory: {
    name: 'Innovation & Growth',
    overview: 'Roles in this space focus on discovering new possibilities, testing ideas, and navigating uncertainty with curiosity and adaptability.',
  },
};

// Career cluster definitions organized by dominant signal
type ClusterDetail = {
  name: string;
  description: string;
  secondarySignal: string;
};

type DominantSignalClusters = {
  [key: string]: {
    title: string;
    clusters: ClusterDetail[];
    exampleFields: string[];
  };
};

const clustersBySignal: DominantSignalClusters = {
  analytical: {
    title: 'Career Clusters (Analytical)',
    clusters: [
      { name: 'Data & Insight', description: 'Turning information into meaning', secondarySignal: 'structured' },
      { name: 'Systems Thinking', description: 'Understanding complex systems', secondarySignal: 'exploratory' },
      { name: 'Research & Analysis', description: 'Asking precise questions', secondarySignal: 'exploratory' },
      { name: 'Financial & Risk', description: 'Evaluating outcomes', secondarySignal: 'structured' },
      { name: 'Optimization', description: 'Improving performance', secondarySignal: 'structured' },
    ],
    exampleFields: ['Data analysis', 'Market research', 'Policy analysis', 'Business intelligence'],
  },
  creative: {
    title: 'Career Clusters (Creative)',
    clusters: [
      { name: 'Visual Expression', description: 'Communicating through visuals', secondarySignal: 'exploratory' },
      { name: 'Content & Story', description: 'Narratives, messaging', secondarySignal: 'social' },
      { name: 'Product Creation', description: 'Making things people use', secondarySignal: 'structured' },
      { name: 'Concept Design', description: 'Turning ideas into forms', secondarySignal: 'analytical' },
      { name: 'Artistic Practice', description: 'Personal expression', secondarySignal: 'exploratory' },
    ],
    exampleFields: ['Content creation', 'UX / UI', 'Writing', 'Film, art, design'],
  },
  social: {
    title: 'Career Clusters (Social)',
    clusters: [
      { name: 'People Development', description: 'Helping others grow', secondarySignal: 'structured' },
      { name: 'Community & Culture', description: 'Building belonging', secondarySignal: 'creative' },
      { name: 'Guidance & Support', description: 'Emotional or practical help', secondarySignal: 'analytical' },
      { name: 'Influence & Advocacy', description: 'Persuasion, communication', secondarySignal: 'creative' },
      { name: 'Collaboration', description: 'Coordinating teams', secondarySignal: 'structured' },
    ],
    exampleFields: ['HR', 'Coaching', 'Community management', 'Teaching', 'Counseling'],
  },
  structured: {
    title: 'Career Clusters (Structured)',
    clusters: [
      { name: 'Operations', description: 'Keeping systems running', secondarySignal: 'analytical' },
      { name: 'Project Delivery', description: 'Moving work to completion', secondarySignal: 'social' },
      { name: 'Compliance & Quality', description: 'Accuracy and standards', secondarySignal: 'analytical' },
      { name: 'Infrastructure', description: 'Foundational systems', secondarySignal: 'exploratory' },
      { name: 'Process Design', description: 'Making workflows efficient', secondarySignal: 'creative' },
    ],
    exampleFields: ['Operations', 'Project management', 'QA', 'Supply chain', 'Admin leadership'],
  },
  exploratory: {
    title: 'Career Clusters (Exploratory)',
    clusters: [
      { name: 'Innovation', description: 'New ideas & approaches', secondarySignal: 'creative' },
      { name: 'Entrepreneurship', description: 'Building from uncertainty', secondarySignal: 'analytical' },
      { name: 'Research Frontiers', description: 'Pushing boundaries', secondarySignal: 'analytical' },
      { name: 'Growth & Experimentation', description: 'Testing what works', secondarySignal: 'structured' },
      { name: 'Strategy & Foresight', description: 'Thinking ahead', secondarySignal: 'analytical' },
    ],
    exampleFields: ['Startups', 'Growth roles', 'Product strategy', 'AI businesses', 'Research labs'],
  },
};

// Career cluster definitions with signal weights
type ClusterProfile = {
  name: string;
  signals: {
    social?: number;
    analytical?: number;
    creative?: number;
    structured?: number;
    exploratory?: number;
  };
  dominantSignal: 'analytical' | 'social' | 'creative' | 'structured' | 'exploratory';
};

const careerClusters: ClusterProfile[] = [
  {
    name: "Data & Insights",
    signals: { analytical: 0.9, structured: 0.5, exploratory: 0.4, creative: 0.2 },
    dominantSignal: 'analytical',
  },
  {
    name: "Expression & Creation",
    signals: { creative: 0.9, exploratory: 0.6, social: 0.4, analytical: 0.2 },
    dominantSignal: 'creative',
  },
  {
    name: "People & Community",
    signals: { social: 0.9, creative: 0.4, exploratory: 0.6, analytical: 0.3 },
    dominantSignal: 'social',
  },
  {
    name: "Systems & Operations",
    signals: { structured: 0.9, analytical: 0.6, social: 0.3, exploratory: 0.2 },
    dominantSignal: 'structured',
  },
  {
    name: "Innovation & Growth",
    signals: { exploratory: 0.9, analytical: 0.7, creative: 0.5, structured: 0.4 },
    dominantSignal: 'exploratory',
  },
];

// Color mapping for dominant signals
const signalColors: Record<string, string> = {
  analytical: '#4A90E2', // Blue
  social: '#7ED321', // Green
  creative: '#F5A623', // Yellow/Orange
  structured: '#FF6B35', // Orange
  exploratory: '#9013FE', // Purple
};

type BubbleData = {
  cluster: string;
  score: number;
  size: number;
  color: string;
  motionType: 'stable' | 'drift' | 'orbit';
  position: { x: number; y: number };
  dominantSignal: string;
};

export function BubbleResults({ onBack }: { onBack?: () => void }) {
  const { signals } = useExplorationStore();
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);
  const [showRolesPage, setShowRolesPage] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const bubbles = useMemo(() => {
    // Normalize user signals
    const totalSignals = Object.values(signals).reduce((sum, val) => sum + val, 0);
    const normalizedSignals: Record<string, number> = {};
    
    Object.keys(signals).forEach(key => {
      normalizedSignals[key] = totalSignals > 0 ? signals[key] / totalSignals : 0;
    });

    // Calculate alignment scores for each cluster
    const alignments = careerClusters.map(cluster => {
      let alignmentScore = 0;
      
      Object.keys(cluster.signals).forEach(signalKey => {
        const userSignal = normalizedSignals[signalKey] || 0;
        const clusterWeight = cluster.signals[signalKey as keyof typeof cluster.signals] || 0;
        alignmentScore += userSignal * clusterWeight;
      });

      return {
        cluster: cluster.name,
        score: alignmentScore,
        color: signalColors[cluster.dominantSignal],
        dominantSignal: cluster.dominantSignal,
      };
    });

    // Sort by score and take top 4
    const topClusters = alignments
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    // Determine motion type based on confidence
    const maxScore = Math.max(...topClusters.map(c => c.score));
    const minScore = Math.min(...topClusters.map(c => c.score));
    const range = maxScore - minScore;

    // Create bubble data with positions
    const bubbleData: BubbleData[] = topClusters.map((cluster, index) => {
      // Size based on score (60-160px radius)
      const normalizedScore = range > 0 ? (cluster.score - minScore) / range : 0.5;
      const size = 80 + normalizedScore * 80;

      // Motion type based on confidence
      let motionType: 'stable' | 'drift' | 'orbit' = 'drift';
      if (index === 0 && normalizedScore > 0.7) {
        motionType = 'stable'; // High confidence
      } else if (index >= 2) {
        motionType = 'orbit'; // Related clusters
      }

      // Position (arranged to prevent complete overlap)
      const positions = [
        { x: 40, y: 35 }, // Top-left
        { x: 65, y: 30 }, // Top-right
        { x: 30, y: 65 }, // Bottom-left
        { x: 70, y: 70 }, // Bottom-right
      ];

      return {
        cluster: cluster.cluster,
        score: cluster.score,
        size,
        color: cluster.color,
        motionType,
        position: positions[index],
        dominantSignal: cluster.dominantSignal,
      };
    });

    return bubbleData;
  }, [signals]);

  const handleBubbleClick = (clusterName: string) => {
    setSelectedBubble(selectedBubble === clusterName ? null : clusterName);
  };

  const handleCloseDetail = () => {
    setSelectedBubble(null);
  };

  const selectedBubbleData = bubbles.find(b => b.cluster === selectedBubble);
  const selectedSignalInfo = selectedBubbleData 
    ? signalInfo[selectedBubbleData.dominantSignal]
    : null;

  const handleViewRoles = () => {
    if (selectedBubbleData) {
      setSelectedCluster(selectedBubbleData.dominantSignal);
      setShowRolesPage(true);
    }
  };

  const handleBackFromRoles = () => {
    setShowRolesPage(false);
    setSelectedCluster(null);
    setSelectedBubble(null);
  };

  // Show roles page if selected
  if (showRolesPage && selectedCluster) {
    return (
      <ClusterRoles 
        cluster={selectedCluster} 
        onBack={handleBackFromRoles}
        onNavigateToAuth={(mode) => {
          // For now, just show a message - this can be integrated with your auth system later
          console.log(`Navigate to auth with mode: ${mode}`);
          alert(`Auth flow for ${mode} would be triggered here. This will be integrated with your authentication system.`);
        }}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blur overlay when bubble is selected */}
      <AnimatePresence>
        {selectedBubble && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              zIndex: 50,
            }}
            onClick={handleCloseDetail}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-hero)',
            color: 'var(--brand-text-primary)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            marginBottom: '1rem',
          }}
        >
          Your Patterns
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--brand-text-secondary)',
            fontSize: '1.125rem',
          }}
        >
          These clusters reflect your natural signals
        </p>
      </motion.div>

      {/* Top instruction */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--brand-text-secondary)',
          fontSize: '1rem',
          textAlign: 'center',
          marginBottom: '2rem',
          maxWidth: '600px',
        }}
      >
        Bigger bubbles reflect stronger alignment with how you naturally think and act
      </motion.p>

      {/* Bubble Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          height: '500px',
          marginBottom: '2rem',
        }}
      >
        {bubbles.map((bubble, index) => {
          const isSelected = selectedBubble === bubble.cluster;
          const isOtherSelected = selectedBubble && selectedBubble !== bubble.cluster;

          // Motion variants based on type
          const motionVariants = {
            stable: {
              x: [0, 2, 0, -2, 0],
              y: [0, 1, 0, -1, 0],
            },
            drift: {
              x: [0, 15, -10, 8, 0],
              y: [0, -8, 12, -5, 0],
            },
            orbit: {
              x: [0, 20, 10, -15, 0],
              y: [0, -15, -5, 10, 0],
            },
          };

          const transitionDurations = {
            stable: 8,
            drift: 12,
            orbit: 15,
          };

          return (
            <motion.div
              key={bubble.cluster}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isOtherSelected ? 0.3 : 1,
                scale: isSelected ? 1.1 : 1,
                x: motionVariants[bubble.motionType].x,
                y: motionVariants[bubble.motionType].y,
              }}
              transition={{
                opacity: { duration: 0.4 },
                scale: { duration: 0.4, type: 'spring' },
                x: {
                  duration: transitionDurations[bubble.motionType],
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                y: {
                  duration: transitionDurations[bubble.motionType],
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              onClick={() => handleBubbleClick(bubble.cluster)}
              whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
              style={{
                position: 'absolute',
                left: `${bubble.position.x}%`,
                top: `${bubble.position.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `${bubble.size * 2}px`,
                height: `${bubble.size * 2}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${bubble.color}33, ${bubble.color})`,
                boxShadow: `
                  0 ${bubble.size * 0.3}px ${bubble.size * 0.6}px ${bubble.color}40,
                  inset 0 ${bubble.size * 0.1}px ${bubble.size * 0.2}px rgba(255, 255, 255, 0.5),
                  inset 0 -${bubble.size * 0.1}px ${bubble.size * 0.15}px rgba(0, 0, 0, 0.1)
                `,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                cursor: 'pointer',
                zIndex: isSelected ? 100 : 1,
              }}
            >
              {/* Shine effect */}
              <div
                style={{
                  position: 'absolute',
                  top: '15%',
                  left: '25%',
                  width: '40%',
                  height: '40%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent)',
                  filter: 'blur(10px)',
                  pointerEvents: 'none',
                }}
              />

              {/* Content */}
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#ffffff',
                    fontSize: `${Math.max(0.9, bubble.size / 100)}rem`,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {bubble.cluster}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom instruction */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--brand-text-secondary)',
          fontSize: '1rem',
          textAlign: 'center',
          marginBottom: '3rem',
          maxWidth: '600px',
        }}
      >
        Tap any bubble to see what kinds of work tend to align with this pattern.
      </motion.p>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedBubble && selectedSignalInfo && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              bottom: '3rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#ffffff',
              color: 'var(--brand-text-primary)',
              padding: '2rem 2.5rem',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              maxWidth: '500px',
              width: '90%',
              zIndex: 100,
            }}
          >
            {/* Header */}
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                marginBottom: '1rem',
                color: 'var(--brand-text-primary)',
              }}
            >
              {selectedSignalInfo.name}
            </h2>

            {/* Overview */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--brand-text-secondary)',
                lineHeight: '1.6',
                marginBottom: '1.5rem',
              }}
            >
              {selectedSignalInfo.overview}
            </p>

            {/* Alignment line with chevron button */}
            <button
              onClick={handleViewRoles}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--brand-text-secondary)',
                borderBottom: '1px solid var(--brand-text-secondary)',
                paddingBottom: '2px',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: '0 0 2px 0',
              }}
            >
              <span>Your interests and strengths often align with work in this direction</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
