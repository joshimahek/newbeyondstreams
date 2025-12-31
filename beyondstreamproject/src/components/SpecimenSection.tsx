import { motion } from 'motion/react';
import specimenIllustration from 'figma:asset/55dd0b5e60660539779e9cd5e353b42ffc367539.png';

export function SpecimenSection() {
  const steps = [
    {
      label: "Step 1",
      title: "Situational Micro-Games",
      description: "Maya plays 2-3 quick scenarios that reveal how she naturally thinks and decides in real situations.",
      color: "#C0E8E4"
    },
    {
      label: "Step 2", 
      title: "Discover Your Strengths",
      description: "She sees patterns in creativity, empathy, execution, and analytical thinking emerge from her choices.",
      color: "#BCE79D"
    },
    {
      label: "Step 3",
      title: "Explore Career Clusters",
      description: "Interactive bubbles show Maya realistic career paths aligned with her unique traits and interests.",
      color: "#FFEC6E"
    },
    {
      label: "Step 4",
      title: "Try Micro-Experiments",
      description: "Maya tests potential careers through 7-14 day low-risk activities before making any big commitment.",
      color: "#E28383"
    }
  ];

  return (
    <section id="how-it-works" className="w-full px-8 py-24 relative overflow-hidden" style={{ backgroundColor: 'rgba(192, 232, 228, 0.15)' }}>
      {/* Decorative floating dots */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: 'var(--brand-accent-emphasis)',
            opacity: 0.4,
            top: '15%',
            left: '8%'
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--brand-accent-positive)',
            opacity: 0.5,
            top: '40%',
            right: '12%'
          }}
          animate={{
            y: [0, 20, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: 'var(--brand-accent-highlight)',
            opacity: 0.6,
            bottom: '25%',
            left: '15%'
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.9, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 flex justify-center"
          >
            <img 
              src={specimenIllustration}
              alt="Person discovering patterns"
              className="w-full max-w-sm"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <h2 
              style={{ 
                fontFamily: 'var(--font-heading)',
                color: 'var(--brand-text-primary)',
                fontSize: '2.5rem',
                marginBottom: '1rem'
              }}
            >
              How it works
            </h2>
            <p 
              style={{ 
                fontFamily: 'var(--font-body)',
                color: 'var(--brand-text-secondary)',
                fontSize: '1.125rem',
                lineHeight: '1.8'
              }}
            >
              Meet Maya, exploring a career pivot in her late 20s
            </p>
          </motion.div>
        </div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div 
                className="p-8 rounded-3xl"
                style={{ 
                  backgroundColor: step.color + '20',
                  border: `2px solid ${step.color}60`
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: `0 10px 30px ${step.color}40`
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-6">
                  <motion.div 
                    className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: step.color }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span 
                      style={{ 
                        fontFamily: 'var(--font-body)',
                        color: 'var(--brand-text-primary)',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}
                    >
                      {step.label}
                    </span>
                  </motion.div>
                  
                  <div className="flex-1 space-y-3">
                    <h3 
                      style={{ 
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--brand-text-primary)',
                        fontSize: '1.75rem'
                      }}
                    >
                      {step.title}
                    </h3>
                    <p 
                      style={{ 
                        fontFamily: 'var(--font-body)',
                        color: 'var(--brand-text-secondary)',
                        fontSize: '1.125rem',
                        lineHeight: '1.8'
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Connecting line (except for last item) */}
              {index < steps.length - 1 && (
                <motion.div 
                  className="absolute left-8 w-0.5 h-12 -bottom-12"
                  style={{ 
                    backgroundColor: step.color,
                    opacity: 0.4,
                    marginLeft: '1.875rem'
                  }}
                  initial={{ height: 0 }}
                  whileInView={{ height: '3rem' }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p 
            style={{ 
              fontFamily: 'var(--font-body)',
              color: 'var(--brand-text-secondary)',
              fontSize: '1.125rem',
              fontStyle: 'italic'
            }}
          >
            Your patterns will be unique to you
          </p>
        </motion.div>
      </div>
    </section>
  );
}