import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { EXPERIENCE, ORIGINAL } from '../../constants';
import { EXPERIENCE_UI } from '../../constants/ui';
import { GROUP_PHOTOS } from '../../constants/images';
import { randomItem } from '../../utils/random';

function TimelineCard({
  content,
  index,
}: {
  content: string;
  index: number;
}) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 48px 1fr',
        alignItems: 'center',
        gap: '0',
        marginBottom: '2px',
      }}
    >
      {/* Left content */}
      <div style={{ padding: '0 24px 0 0', textAlign: 'right' }}>
        {isLeft ? (
          <div style={{
            padding: '20px 24px',
            background: 'rgba(139,0,0,0.08)',
            border: '1px solid rgba(139,0,0,0.25)',
            borderRadius: '4px 0 0 4px',
            borderRight: 'none',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.82rem, 2vw, 0.95rem)',
              color: 'var(--white-dim)',
              lineHeight: 1.7,
            }}>
              {content}
            </p>
          </div>
        ) : null}
      </div>

      {/* Center dot */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--dark-red), var(--crimson))',
          border: '2px solid var(--black)',
          boxShadow: '0 0 12px var(--red-glow)',
          flexShrink: 0,
        }} />
      </div>

      {/* Right content */}
      <div style={{ padding: '0 0 0 24px', textAlign: 'left' }}>
        {!isLeft ? (
          <div style={{
            padding: '20px 24px',
            background: 'rgba(139,0,0,0.08)',
            border: '1px solid rgba(139,0,0,0.25)',
            borderRadius: '0 4px 4px 0',
            borderLeft: 'none',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.82rem, 2vw, 0.95rem)',
              color: 'var(--white-dim)',
              lineHeight: 1.7,
            }}>
              {content}
            </p>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

function MobileCard({ content, index }: { content: string; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        marginBottom: '20px',
      }}
    >
      <div style={{
        flexShrink: 0,
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--dark-red), var(--crimson))',
        marginTop: '6px',
        boxShadow: '0 0 8px var(--red-glow)',
      }} />
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
        color: 'var(--white-dim)',
        lineHeight: 1.75,
      }}>
        {content}
      </p>
    </motion.div>
  );
}

export default function Experience() {
  const { ref: headRef, inView: headInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: achieveRef, inView: achieveInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: originalRef, inView: originalInView } = useInView({ threshold: 0.2, triggerOnce: true });

  // Random group photo on every mount — so the card looks fresh on each visit
  const photo = useMemo(() => randomItem(GROUP_PHOTOS) ?? GROUP_PHOTOS[0] ?? '', []);

  return (
    <section
      id="experience"
      style={{
        padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 60px)',
        background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
        borderTop: '1px solid rgba(139,0,0,0.12)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle bg glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '50%',
        height: '60%',
        background: 'radial-gradient(ellipse, rgba(139,0,0,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, x: -30 }}
          animate={headInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--crimson)',
            marginBottom: '12px',
          }}>
            {EXPERIENCE_UI.sectionNumber} / {EXPERIENCE.heading}
          </div>
          <h2 className="section-heading" style={{ marginBottom: '8px' }}>
            {EXPERIENCE_UI.displayHeading}
          </h2>
          <div className="red-divider" />
          <p style={{
            fontFamily: 'var(--font-italic)',
            fontStyle: 'italic',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: 'var(--white-dim)',
            maxWidth: '600px',
            lineHeight: 1.7,
            marginTop: '16px',
            marginBottom: '48px',
          }}>
            {EXPERIENCE.summary}
          </p>
        </motion.div>

        {/* Achievements badges */}
        <motion.div
          ref={achieveRef}
          initial={{ opacity: 0, y: 20 }}
          animate={achieveInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '56px',
          }}
        >
          {EXPERIENCE.achievements.map((ach, i) => (
            <motion.div
              key={i}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(196,30,58,0.2)',
                  '0 0 28px rgba(196,30,58,0.5)',
                  '0 0 10px rgba(196,30,58,0.2)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
              style={{
                padding: '16px 20px 16px 16px',
                background: 'linear-gradient(135deg, rgba(139,0,0,0.18), rgba(196,30,58,0.08))',
                border: '1px solid rgba(196,30,58,0.35)',
                borderLeft: '3px solid var(--crimson)',
                borderRadius: '0 4px 4px 0',
                maxWidth: '340px',
                transition: 'background 0.25s ease',
              }}
              whileHover={{
                background: 'linear-gradient(135deg, rgba(139,0,0,0.28), rgba(196,30,58,0.15))',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                color: 'var(--white)',
                letterSpacing: '0.05em',
                marginBottom: '4px',
              }}>
                {ach.title}
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--white-muted)',
                letterSpacing: '0.05em',
              }}>
                {ach.detail}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline — desktop */}
        <div className="experience-timeline-desktop" style={{
          position: 'relative',
          display: 'none',
        }}>
          {/* Center vertical line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(180deg, var(--dark-red), rgba(139,0,0,0.1))',
          }} />
          {EXPERIENCE.description.map((text, i) => (
            <TimelineCard key={i} content={text} index={i} />
          ))}
        </div>

        {/* Timeline — mobile (always visible, desktop hidden via CSS) */}
        <div className="experience-timeline-mobile">
          <div style={{
            position: 'relative',
            paddingLeft: '28px',
            borderLeft: '2px solid rgba(139,0,0,0.4)',
          }}>
            {EXPERIENCE.description.map((text, i) => (
              <MobileCard key={i} content={text} index={i} />
            ))}
          </div>
        </div>

        {/* Venue pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ marginTop: '40px' }}
        >
          <div style={{
            fontSize: '0.68rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--crimson)',
            marginBottom: '16px',
          }}>
            Where We've Played
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {EXPERIENCE.venues.map((venue, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={headInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.08 }}
                style={{
                  padding: '6px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  fontSize: '0.75rem',
                  color: 'var(--white-dim)',
                  letterSpacing: '0.04em',
                }}
              >
                {venue}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Our Original track feature */}
        <motion.div
          ref={originalRef}
          initial={{ opacity: 0, y: 40 }}
          animate={originalInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            marginTop: '64px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: '32px',
            alignItems: 'center',
            padding: '36px',
            background: 'linear-gradient(135deg, rgba(139,0,0,0.12), rgba(10,10,10,0.9))',
            border: '1px solid rgba(139,0,0,0.3)',
            borderRadius: '6px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Corner accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: 'linear-gradient(225deg, rgba(196,30,58,0.2), transparent)',
          }} />

          <div>
            <div style={{
              fontSize: '0.68rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--crimson)',
              marginBottom: '12px',
            }}>
              {ORIGINAL.milestone}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 5vw, 3rem)',
              color: 'var(--white)',
              letterSpacing: '0.05em',
              marginBottom: '16px',
            }}>
              {ORIGINAL.trackTitle}
            </h3>
            <p style={{
              fontFamily: 'var(--font-italic)',
              fontStyle: 'italic',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              color: 'var(--white-dim)',
              lineHeight: 1.7,
              marginBottom: '20px',
            }}>
              {ORIGINAL.description[1]}
            </p>
            {/* Streaming links */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--crimson)',
                marginBottom: '12px',
              }}>
                Stream Now
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {(
                  [
                    { label: 'Spotify', icon: '♫', href: ORIGINAL.streamingLinks.spotify, color: '#1DB954' },
                    { label: 'Apple Music', icon: '♪', href: ORIGINAL.streamingLinks.appleMusic, color: '#FC3C44' },
                    { label: 'YouTube Music', icon: '▶', href: ORIGINAL.streamingLinks.youtubeMusic, color: '#FF0000' },
                    { label: 'Amazon Music', icon: '♬', href: ORIGINAL.streamingLinks.amazonMusic, color: '#00A8E1' },
                  ] as const
                ).map(({ label, icon, href, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 18px',
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${color}40`,
                      borderRadius: '3px',
                      fontSize: '0.76rem',
                      letterSpacing: '0.08em',
                      color: 'var(--white-dim)',
                      textDecoration: 'none',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = `${color}18`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    }}
                  >
                    <span style={{ color, fontSize: '12px' }}>{icon}</span>
                    {label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Music listening hint */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(196,30,58,0.06)',
              border: '1px solid rgba(196,30,58,0.18)',
              borderRadius: '3px',
              marginBottom: '4px',
            }}>
              <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '1px', flexShrink: 0 }}>🎧</span>
              <p style={{
                margin: 0,
                fontFamily: 'var(--font-body)',
                fontSize: '0.74rem',
                lineHeight: 1.65,
                color: 'var(--white-muted)',
                letterSpacing: '0.02em',
              }}>
                The song plays automatically in the background —{' '}
                <span style={{ color: 'var(--white-dim)' }}>scroll or click anywhere</span> to wake it,
                or hit the{' '}
                <span style={{ color: 'var(--white-dim)' }}>▶ player button</span>{' '}
                at the bottom right. Prefer a dedicated player? Stream via the links above.
              </p>
            </div>
          </div>

          {photo && (
            <div style={{
              borderRadius: '4px',
              overflow: 'hidden',
              aspectRatio: '4/3',
              border: '1px solid rgba(139,0,0,0.3)',
              background: '#0a0a0a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src={photo}
                alt="Metronorms performing"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'brightness(0.85) contrast(1.05) saturate(0.9)',
                }}
                loading="lazy"
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* CSS for responsive timeline */}
      <style>{`
        @media (min-width: 768px) {
          .experience-timeline-desktop { display: block !important; }
          .experience-timeline-mobile { display: none !important; }
        }
      `}</style>
    </section>
  );
}
