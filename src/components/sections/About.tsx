import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_SMOOTH } from '../../utils/easing';
import { useInView } from 'react-intersection-observer';
import { ABOUT } from '../../constants';
import { ABOUT_UI } from '../../constants/ui';
import { GROUP_PHOTOS } from '../../constants/images';
import { shuffled } from '../../utils/random';
import { useCyclingIndex } from '../../hooks/useCyclingIndex';

export default function About() {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: photoRef, inView: photoInView } = useInView({ threshold: 0.2, triggerOnce: true });

  // Shuffled group-photo pool, auto-advancing with a crossfade while on the page
  const pool = useMemo(() => shuffled(GROUP_PHOTOS), []);
  const idx = useCyclingIndex(pool.length, 4200);
  const photo = pool.length ? pool[idx % pool.length] : '';

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_SMOOTH } },
  };

  return (
    <section
      id="about"
      style={{
        padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 60px)',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 100%)',
        borderTop: '1px solid rgba(139,0,0,0.12)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 80% 50%, rgba(139,0,0,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section label */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--crimson)',
            marginBottom: '12px',
          }}
        >
            {ABOUT_UI.sectionNumber} / {ABOUT.heading}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="section-heading"
          style={{ marginBottom: '8px' }}
        >
          {ABOUT_UI.displayHeading}
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="red-divider"
          style={{ transformOrigin: 'left' }}
        />

        {/* Main grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: 'clamp(32px, 6vw, 80px)',
          marginTop: '48px',
          alignItems: 'center',
        }}>
          {/* Text side */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {ABOUT.description.map((para, i) => (
              <motion.p
                key={i}
                variants={itemVariants}
                style={{
                  fontFamily: i === 0 ? 'var(--font-italic)' : 'var(--font-body)',
                  fontStyle: i === 0 ? 'italic' : 'normal',
                  fontSize: i === 0 ? 'clamp(1rem, 2.5vw, 1.2rem)' : 'clamp(0.85rem, 2vw, 1rem)',
                  lineHeight: 1.8,
                  color: i === 0 ? 'var(--white-dim)' : 'var(--white-muted)',
                  marginBottom: '20px',
                }}
              >
                {para}
              </motion.p>
            ))}

            {/* Genre chips */}
            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}
            >
              {ABOUT.genres.map((genre) => (
                <motion.span
                  key={genre}
                  whileHover={{ scale: 1.05, borderColor: 'var(--crimson)' }}
                  style={{
                    padding: '6px 16px',
                    border: '1px solid rgba(139,0,0,0.5)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--white-dim)',
                    background: 'rgba(139,0,0,0.08)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {genre}
                </motion.span>
              ))}
            </motion.div>

            {/* Origin badge */}
            <motion.div
              variants={itemVariants}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '24px',
                padding: '14px 18px',
                background: 'rgba(139,0,0,0.1)',
                borderLeft: '3px solid var(--dark-red)',
                borderRadius: '0 4px 4px 0',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>◉</span>
              <div>
                <div style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--white-muted)',
                }}>
                  Origin
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                }}>
                  {ABOUT.origin}
                </div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <div style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--white-muted)',
                }}>
                  Type
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                }}>
                  {ABOUT.type}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Photo side */}
          <motion.div
            ref={photoRef}
            initial={{ opacity: 0, x: 40 }}
            animate={photoInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'relative' }}
          >
            {photo && (
              <>
                {/* Glow effect */}
                <div style={{
                  position: 'absolute',
                  inset: '-8px',
                  background: 'linear-gradient(135deg, rgba(139,0,0,0.3), transparent)',
                  borderRadius: '4px',
                  filter: 'blur(20px)',
                  zIndex: 0,
                }} />
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  border: '1px solid rgba(139,0,0,0.4)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  aspectRatio: '4/5',
                }}>
                  <AnimatePresence mode="sync">
                    <motion.img
                      key={photo}
                      src={photo}
                      alt="Metronorms band"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        filter: 'brightness(0.85) contrast(1.1)',
                      }}
                      loading="lazy"
                    />
                  </AnimatePresence>
                  {/* Red gradient overlay on photo */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(0deg, rgba(10,10,10,0.7) 0%, transparent 100%)',
                  }} />
                </div>
                {/* Corner accent */}
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '40px',
                  height: '40px',
                  borderTop: '2px solid var(--crimson)',
                  borderRight: '2px solid var(--crimson)',
                  zIndex: 2,
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '-4px',
                  width: '40px',
                  height: '40px',
                  borderBottom: '2px solid var(--crimson)',
                  borderLeft: '2px solid var(--crimson)',
                  zIndex: 2,
                }} />
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
