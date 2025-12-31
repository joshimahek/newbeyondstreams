import { motion } from 'motion/react';

export function CareerPathSection() {
  const features = [
    {
      title: "Behavior over quizzes",
      description: "Interactive scenarios reveal how you naturally think",
      color: "#C0E8E4"
    },
    {
      title: "Clusters, not titles",
      description: "Explore 40-60 career families instead of 500+ overwhelming options",
      color: "#BCE79D"
    },
    {
      title: "Exploratory by design",
      description: "Built to reveal directions — not lock you into decisions",
      color: "#FFEC6E"
    },
    {
      title: "Low-risk experiments",
      description: "Test careers through 7-14 day activities before committing",
      color: "#E28383"
    }
  ];

  return (
    <section className="w-full px-8 py-24 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--brand-text-primary)',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            marginBottom: '1.5rem'
          }}
        >
          Designed for the AI era
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--brand-text-secondary)',
            fontSize: '1.25rem',
            lineHeight: '1.8',
            maxWidth: '50rem',
            margin: '0 auto 4rem'
          }}
        >
          Traditional career paths are breaking down. BeyondStreams guides you to explore realistic career clusters based on your strengths, not society's expectations.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: `0 10px 30px ${feature.color}40`
              }}
              className="p-8 rounded-3xl text-left"
              style={{ 
                backgroundColor: feature.color + '15',
                border: `2px solid ${feature.color}60`
              }}
            >
              <h3 
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--brand-text-primary)',
                  fontSize: '1.75rem',
                  marginBottom: '0.75rem'
                }}
              >
                {feature.title}
              </h3>
              <p 
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--brand-text-secondary)',
                  fontSize: '1.125rem',
                  lineHeight: '1.7'
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}