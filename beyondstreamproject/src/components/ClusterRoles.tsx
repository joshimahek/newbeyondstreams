import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

type ClusterRolesProps = {
  cluster: string;
  onBack: () => void;
  onNavigateToAuth?: (mode: 'google' | 'email') => void;
};

// Role details with descriptions and micro-tasks
type RoleDetail = {
  description: string;
  microTask: string;
};

const roleDetails: Record<string, Record<string, RoleDetail>> = {
  creative: {
    'Graphic Designer': {
      description: 'Visual communication through design, layout, and typography',
      microTask: 'Find an advertisement (newspaper / Instagram / banner) you dislike. Redesign it mentally or on paper to communicate the same message more clearly.',
    },
    'Brand Visual Designer': {
      description: 'Creating visual identities that express brand personality and values',
      microTask: 'Pick a brand you know. List 3 emotions it tries to evoke. Now suggest one visual change to strengthen that feeling.',
    },
    'Content Creator': {
      description: 'Crafting engaging content that captures attention and tells stories',
      microTask: 'Take a boring topic (e.g., "saving electricity"). Write one hook that would make someone stop scrolling.',
    },
    'Motion Designer': {
      description: 'Bringing visuals to life through animation and movement',
      microTask: 'Think of a simple action (like "sign up"). Describe how it would animate to feel smooth and satisfying.',
    },
    'UI / Visual Designer': {
      description: 'Designing intuitive, beautiful interfaces for digital products',
      microTask: 'Open any app you use daily. Identify one screen that feels cluttered and suggest one simplification.',
    },
    'Illustrator': {
      description: 'Creating visual representations of ideas, concepts, and stories',
      microTask: 'Choose an abstract idea (freedom, stress, joy). Sketch or imagine one symbol that could represent it.',
    },
    'Creative Strategist': {
      description: 'Developing creative concepts that align with business goals',
      microTask: 'A brand wants to feel "approachable but premium." Suggest one creative idea (visual, campaign, tone) to express that.',
    },
  },
  analytical: {
    'Data Analyst': {
      description: 'Extracting insights and patterns from data to inform decisions',
      microTask: 'Look at a chart in a news article. What question do you think this data is answering?',
    },
    'Business Analyst': {
      description: 'Understanding business problems and identifying solutions',
      microTask: 'A café is losing customers. List 3 possible reasons before thinking of solutions.',
    },
    'Market Researcher': {
      description: 'Understanding customer behavior, preferences, and market trends',
      microTask: 'Think of a product you recently bought. Why do you think most people choose it over alternatives?',
    },
    'Product Analyst': {
      description: 'Analyzing product performance and user behavior to guide strategy',
      microTask: 'Open an app you use weekly. What is the one action the app really wants you to take?',
    },
    'AI / Prompt Analyst': {
      description: 'Crafting precise instructions to optimize AI system outputs',
      microTask: 'Write one instruction that would help an AI give better answers than "Explain marketing."',
    },
    'Operations Analyst': {
      description: 'Identifying inefficiencies and optimizing operational processes',
      microTask: 'Think about your daily routine. Where does time get wasted repeatedly?',
    },
    'Financial Analyst': {
      description: 'Evaluating financial data to assess risk and opportunity',
      microTask: 'You have ₹10,000 to spend this month. What factors would influence whether you save or spend it?',
    },
  },
  social: {
    'Community Manager': {
      description: 'Building and nurturing engaged communities around shared interests',
      microTask: 'Look at a comment section. Which comment would you respond to first, and why?',
    },
    'HR / People Partner': {
      description: 'Supporting employee growth, resolving conflicts, and building culture',
      microTask: 'Two teammates are in conflict. What\'s the first question you\'d ask them?',
    },
    'Career Coach': {
      description: 'Helping people discover direction and navigate career decisions',
      microTask: 'A friend says, "I feel stuck." What would you help them clarify first?',
    },
    'Customer Success Manager': {
      description: 'Ensuring customers achieve their goals using your product or service',
      microTask: 'A user is unhappy but vague. What clarifying question would you ask?',
    },
    'Social Media Manager': {
      description: 'Creating engagement and building relationships on social platforms',
      microTask: 'Look at a brand\'s recent post. What would you reply to increase engagement?',
    },
    'Facilitator / Trainer': {
      description: 'Guiding learning experiences and helping people develop skills',
      microTask: 'You need to explain a complex idea to beginners. What analogy would you use?',
    },
    'Public Relations Specialist': {
      description: 'Managing public perception and communication during key moments',
      microTask: 'A company made a small mistake publicly. What tone should their response take?',
    },
  },
  structured: {
    'Operations Manager': {
      description: 'Ensuring systems and processes run reliably and efficiently',
      microTask: 'List 3 steps of a process you know well. Which step feels most fragile?',
    },
    'Project Coordinator': {
      description: 'Keeping projects on track through organization and communication',
      microTask: 'A deadline is slipping. What\'s the first thing you\'d check?',
    },
    'Program Manager': {
      description: 'Overseeing multiple projects to achieve strategic objectives',
      microTask: 'You\'re running 3 projects at once. What would you review weekly to stay in control?',
    },
    'Quality Analyst': {
      description: 'Identifying issues and ensuring standards are consistently met',
      microTask: 'Use a product today. What small detail might cause issues for some users?',
    },
    'Process Improvement Specialist': {
      description: 'Streamlining workflows and removing unnecessary complexity',
      microTask: 'Pick a routine task. How could you reduce it by one step?',
    },
    'Compliance / Policy Analyst': {
      description: 'Ensuring adherence to rules, regulations, and standards',
      microTask: 'Think of a rule people ignore. Why do you think it exists anyway?',
    },
    'Supply Chain Planner': {
      description: 'Coordinating the flow of materials, information, and resources',
      microTask: 'A delivery is delayed. What information would you want first?',
    },
  },
  exploratory: {
    'UX Researcher': {
      description: 'Uncovering user needs and behaviors through observation and inquiry',
      microTask: 'Watch someone use an app once. What confused them, even briefly?',
    },
    'Product Strategist': {
      description: 'Defining product direction based on user needs and market opportunity',
      microTask: 'If an app removed one feature tomorrow, which would cause the most impact?',
    },
    'Innovation Consultant': {
      description: 'Reimagining products, services, and business models',
      microTask: 'Take a traditional service. Suggest one modern twist.',
    },
    'Policy Researcher': {
      description: 'Analyzing the impact and implications of policies and regulations',
      microTask: 'Read a headline about a new rule. Who benefits the most? Who might struggle?',
    },
    'Venture Research Associate': {
      description: 'Identifying patterns in startups, markets, and investment opportunities',
      microTask: 'Why do you think one startup succeeds while similar ones fail?',
    },
    'Trend Forecaster': {
      description: 'Spotting emerging patterns and predicting future behaviors',
      microTask: 'What behavior today might become normal in 5 years?',
    },
  },
  practical: {
    'Product Builder / Maker': {
      description: 'Creating tangible solutions to real-world problems',
      microTask: 'Think of a daily frustration. What simple thing could reduce it?',
    },
    'Technical Specialist': {
      description: 'Diagnosing and solving technical problems with precision',
      microTask: 'Something breaks. What\'s the first thing you\'d inspect?',
    },
    'Systems Integrator': {
      description: 'Connecting different tools and platforms to work together',
      microTask: 'Two tools don\'t talk to each other. How would you connect them conceptually?',
    },
    'Automation Specialist': {
      description: 'Eliminating repetitive work through smart automation',
      microTask: 'What repetitive task could be automated in your day?',
    },
    'IT Support / Solutions Engineer': {
      description: 'Helping users solve technical challenges and troubleshoot issues',
      microTask: 'Someone says, "It\'s not working." What\'s your first clarifying question?',
    },
    'Prototyping Technician': {
      description: 'Rapidly building testable versions of new ideas',
      microTask: 'You have one day to test an idea. What would you build first?',
    },
    'Implementation Consultant': {
      description: 'Translating plans into working solutions in real environments',
      microTask: 'A solution works on paper but not in reality. What would you check?',
    },
  },
};

// Job roles data for each cluster (updated to remove Think Tank Analyst)
const clusterRoles: Record<string, { icon: string; roles: string[] }> = {
  social: {
    icon: '🤝',
    roles: [
      'Community Manager',
      'HR / People Partner',
      'Career Coach',
      'Customer Success Manager',
      'Social Media Manager',
      'Facilitator / Trainer',
      'Public Relations Specialist',
    ],
  },
  analytical: {
    icon: '📊',
    roles: [
      'Data Analyst',
      'Business Analyst',
      'Market Researcher',
      'Product Analyst',
      'AI / Prompt Analyst',
      'Operations Analyst',
      'Financial Analyst',
    ],
  },
  exploratory: {
    icon: '🔍',
    roles: [
      'UX Researcher',
      'Product Strategist',
      'Innovation Consultant',
      'Policy Researcher',
      'Venture Research Associate',
      'Trend Forecaster',
    ],
  },
  structured: {
    icon: '🧱',
    roles: [
      'Operations Manager',
      'Project Coordinator',
      'Program Manager',
      'Quality Analyst',
      'Process Improvement Specialist',
      'Compliance / Policy Analyst',
      'Supply Chain Planner',
    ],
  },
  creative: {
    icon: '🎨',
    roles: [
      'Graphic Designer',
      'Brand Visual Designer',
      'Content Creator',
      'Motion Designer',
      'UI / Visual Designer',
      'Illustrator',
      'Creative Strategist',
    ],
  },
  practical: {
    icon: '🛠',
    roles: [
      'Product Builder / Maker',
      'Technical Specialist',
      'Systems Integrator',
      'Automation Specialist',
      'IT Support / Solutions Engineer',
      'Prototyping Technician',
      'Implementation Consultant',
    ],
  },
};

export function ClusterRoles({ cluster, onBack, onNavigateToAuth }: ClusterRolesProps) {
  const clusterData = clusterRoles[cluster];
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!clusterData) return null;

  const selectedRoleDetail = selectedRole ? roleDetails[cluster]?.[selectedRole] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '2rem',
      }}
    >
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--brand-text-secondary)',
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: 0,
        }}
      >
        <span>←</span> Back
      </motion.button>

      {/* Content Container */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              color: 'var(--brand-text-primary)',
              marginBottom: '0.75rem',
            }}
          >
            Roles commonly found in this direction
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--brand-text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            These are examples — not recommendations.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--brand-text-primary)',
              fontStyle: 'italic',
            }}
          >
            Click the role that excites you!
          </p>
        </motion.div>

        {/* Roles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '3rem',
          }}
        >
          {clusterData.roles.map((role, index) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              style={{
                backgroundColor: selectedRole === role ? 'rgba(59, 0, 101, 0.1)' : 'rgba(192, 232, 228, 0.3)',
                color: 'var(--brand-text-primary)',
                padding: '0.875rem 1.5rem',
                borderRadius: '2rem',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                border: selectedRole === role ? '2px solid var(--brand-text-primary)' : '1px solid rgba(192, 232, 228, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </motion.div>
          ))}
        </motion.div>

        {/* Role Detail Drawer */}
        <AnimatePresence>
          {selectedRoleDetail && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: '3rem',
                padding: '2rem',
                backgroundColor: '#ffffff',
                borderRadius: '1rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '2px solid rgba(59, 0, 101, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    color: 'var(--brand-text-primary)',
                  }}
                >
                  {selectedRole}
                </h2>
                <button
                  onClick={() => setSelectedRole(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-text-secondary)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
              
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  color: 'var(--brand-text-secondary)',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                }}
              >
                {selectedRoleDetail.description}
              </p>

              <div
                style={{
                  backgroundColor: 'rgba(192, 232, 228, 0.3)',
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(192, 232, 228, 0.5)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.1rem',
                    color: 'var(--brand-text-primary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Try this:
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    color: 'var(--brand-text-secondary)',
                    lineHeight: '1.6',
                  }}
                >
                  {selectedRoleDetail.microTask}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Progress CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{
            marginTop: '4rem',
            textAlign: 'center',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLoginModal(true)}
            style={{
              backgroundColor: 'var(--brand-text-primary)',
              color: '#ffffff',
              padding: '1rem 2.5rem',
              borderRadius: '2rem',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 0, 101, 0.2)',
            }}
          >
            Save Progress & Continue Exploring
          </motion.button>
        </motion.div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                zIndex: 999,
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#ffffff',
                borderRadius: '1.5rem',
                padding: '2.5rem',
                maxWidth: '480px',
                width: '90%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '2rem',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    color: 'var(--brand-text-primary)',
                    marginBottom: '1rem',
                  }}
                >
                  Save your exploration
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    color: 'var(--brand-text-secondary)',
                    lineHeight: '1.6',
                  }}
                >
                  Saving your progress unlocks deeper tasks, personalized learning paths, and the ability to revisit your discoveries anytime.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {/* Google Login */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigateToAuth?.('google')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: '2px solid rgba(59, 0, 101, 0.2)',
                    backgroundColor: '#ffffff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    color: 'var(--brand-text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </motion.button>

                {/* Divider */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    margin: '0.5rem 0',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: 'rgba(59, 0, 101, 0.1)',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'var(--brand-text-secondary)',
                    }}
                  >
                    or
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: 'rgba(59, 0, 101, 0.1)',
                    }}
                  />
                </div>

                {/* Email Login */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigateToAuth?.('email')}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    backgroundColor: 'var(--brand-text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Continue with Email
                </motion.button>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowLoginModal(false)}
                style={{
                  marginTop: '1.5rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Maybe later
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}