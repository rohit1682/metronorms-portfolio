import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { MEMBERS } from '../../constants';
import { MEMBER_PHOTOS } from '../../constants/images';
import { MEMBERS_UI } from '../../constants/ui';
import { shuffled } from '../../utils/random';
import { useCyclingIndex } from '../../hooks/useCyclingIndex';

const MEMBER_COUNT = MEMBERS.list.length; // 7

interface CardMember {
  name: string;
}

/**
 * A single member card. Each card owns its photo rotation with a slightly
 * different interval (so cards never flip in unison) and flips like a card
 * toggle whenever its picture changes.
 */
function MemberCard({
  member,
  pool,
  index,
  inView,
}: Readonly<{ member: CardMember; pool: string[]; index: number; inView: boolean }>) {
  // Stagger intervals so each card changes at its own cadence, never together.
  const idx = useCyclingIndex(pool.length, 3400 + index * 620);
  const photo = pool.length ? pool[idx % pool.length] : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <Link to={`/members#member-${member.name}`} style={{ textDecoration: 'none', display: 'block' }}>
        {/* Photo card */}
        <div
          className="member-card"
          style={{
            position: 'relative',
            borderRadius: '4px',
            overflow: 'hidden',
            aspectRatio: '3/4',
            border: '1px solid rgba(139,0,0,0.3)',
            perspective: '900px',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,30,58,0.7)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 22px rgba(196,30,58,0.28)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,0,0,0.3)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          {photo ? (
            <div className="member-card-inner" style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={photo}
                  src={photo}
                  alt={member.name}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    filter: 'brightness(0.85) contrast(1.08)',
                    backfaceVisibility: 'hidden',
                    display: 'block',
                  }}
                  loading="lazy"
                />
              </AnimatePresence>
            </div>
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                color: 'rgba(139,0,0,0.5)',
              }}>
                {member.name[0]}
              </span>
            </div>
          )}

          {/* Bottom fade */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0, height: '45%',
            background: 'linear-gradient(0deg, rgba(10,10,10,0.92) 0%, transparent 100%)',
          }} />

          {/* Name overlay — visible on the card itself */}
          <div style={{
            position: 'absolute',
            bottom: '10px', left: 0, right: 0,
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.6rem, 1.2vw, 0.82rem)',
              letterSpacing: '0.12em',
              color: 'var(--white)',
              textTransform: 'uppercase',
            }}>
              {member.name}
            </div>
            <div style={{
              fontSize: 'clamp(0.5rem, 0.9vw, 0.62rem)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--crimson)',
              marginTop: '2px',
            }}>
              {MEMBERS_UI.roles[member.name] ?? MEMBERS_UI.fallbackRole}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function MemberStrip() {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true });

  // Each member gets their own shuffled pool (fresh order every mount).
  const memberPools = useMemo(() =>
    Object.fromEntries(
      MEMBERS.list.map(m => [m.name, shuffled(MEMBER_PHOTOS[m.name] ?? [])])
    ) as Record<string, string[]>, []
  );

  return (
    <section
      style={{
        padding: 'clamp(48px, 8vw, 80px) clamp(16px, 4vw, 48px)',
        background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
        borderTop: '1px solid rgba(139,0,0,0.12)',
        position: 'relative',
      }}
    >
      {/* Decorative centre line */}
      <div style={{
        position: 'absolute',
        top: '50%', left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(139,0,0,0.18), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Header row */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.68rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--crimson)',
            marginBottom: '6px',
          }}>
            The People Behind The Sound
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            letterSpacing: '0.05em',
            color: 'var(--white)',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            {MEMBERS_UI.displayHeading}
          </h2>
        </div>

        <Link
          to="/members"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            border: '1px solid rgba(196,30,58,0.5)',
            borderRadius: '2px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--white-dim)',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(196,30,58,0.12)';
            (e.currentTarget as HTMLElement).style.color = 'var(--white)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--white-dim)';
          }}
        >
          Full Profiles →
        </Link>
      </motion.div>

      {/*
        Grid layout:
        • Mobile  (<480px):  2 columns
        • Tablet  (480-768): 3-4 columns via auto-fill
        • Desktop (>768px):  all 7 in a single row, each taking equal space
        We achieve the single-row-on-desktop behaviour by setting
        grid-template-columns to repeat(7,1fr) for wide screens via a className.
      */}
      <div className="member-strip-grid">
        {MEMBERS.list.map((member, i) => (
          <MemberCard
            key={member.name}
            member={member}
            pool={memberPools[member.name] ?? []}
            index={i}
            inView={inView}
          />
        ))}
      </div>

      <style>{`
        /* The flip animation lives on the <img>; hover zoom/dim lives on the
           wrapper so the two transforms never fight. */
        .member-card-inner {
          transition: transform 0.5s ease;
        }
        .member-card:hover .member-card-inner {
          transform: scale(1.06);
        }
        .member-card:hover .member-card-inner img {
          filter: brightness(0.72) contrast(1.1) !important;
        }

        /* Desktop: all ${MEMBER_COUNT} cards in one row, equal width */
        .member-strip-grid {
          display: grid;
          grid-template-columns: repeat(${MEMBER_COUNT}, 1fr);
          gap: clamp(8px, 1.5vw, 20px);
        }

        /* Laptop / tablet */
        @media (max-width: 1024px) {
          .member-strip-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .member-strip-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }
      `}</style>
    </section>
  );
}
