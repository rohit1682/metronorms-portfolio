import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MEMBERS, BRAND } from '../constants';
import { MEMBER_PHOTOS } from '../constants/images';
import { MEMBERS_UI } from '../constants/ui';
import { randomIndex } from '../utils/random';

function MemberRow({
  member,
  index,
}: {
  member: { name: string; displayName: string; bio: string };
  index: number;
}) {
  const photos = MEMBER_PHOTOS[member.name] ?? [];
  const [activePhoto, setActivePhoto] = useState(() => randomIndex(photos.length));
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.08,
    triggerOnce: true,
    rootMargin: '0px 0px -60px 0px',
  });

  const isReversed = index % 2 !== 0;
  const role = MEMBERS_UI.roles[member.name] ?? MEMBERS_UI.fallbackRole;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className={`member-row ${isReversed ? 'member-row--reversed' : ''}`}
    >
      {/* Photo column */}
      <div className="member-photo-col">
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: hovered
              ? '0 24px 64px rgba(196,30,58,0.25), 0 4px 20px rgba(0,0,0,0.6)'
              : '0 8px 32px rgba(0,0,0,0.5)',
            transition: 'box-shadow 0.4s ease',
            border: hovered
              ? '1px solid rgba(196,30,58,0.5)'
              : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activePhoto}
              src={photos[activePhoto] ?? ''}
              alt={member.displayName}
              loading="eager"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: hovered ? 1.06 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                width: '100%',
                aspectRatio: '3/4',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
                filter: 'brightness(0.9) contrast(1.06)',
              }}
            />
          </AnimatePresence>

          {/* Bottom gradient overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '35%',
            background: 'linear-gradient(0deg, rgba(10,10,10,0.85) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Index number badge */}
          <div style={{
            position: 'absolute', top: '14px', left: '14px',
            fontFamily: 'var(--font-display)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.4)',
            background: 'rgba(0,0,0,0.5)',
            padding: '4px 10px',
            borderRadius: '20px',
            backdropFilter: 'blur(6px)',
          }}>
            {String(index + 1).padStart(2, '0')} / {String(MEMBERS.list.length).padStart(2, '0')}
          </div>

          {/* Photo count */}
          {photos.length > 1 && (
            <div style={{
              position: 'absolute', top: '14px', right: '14px',
              fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)',
              background: 'rgba(0,0,0,0.45)', padding: '3px 8px',
              borderRadius: '10px', letterSpacing: '0.1em',
              backdropFilter: 'blur(6px)',
            }}>
              {activePhoto + 1} / {photos.length}
            </div>
          )}
        </motion.div>

        {/* Thumbnail strip */}
        {photos.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px', overflowX: 'auto', paddingBottom: '2px' }}>
            {photos.slice(0, 7).map((src, i) => (
              <motion.button
                key={i}
                onClick={() => setActivePhoto(i)}
                whileTap={{ scale: 0.92 }}
                style={{
                  flexShrink: 0,
                  width: '48px',
                  height: '48px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: i === activePhoto
                    ? '2px solid var(--crimson)'
                    : '2px solid rgba(255,255,255,0.1)',
                  padding: 0,
                  cursor: 'pointer',
                  background: 'none',
                  transition: 'border-color 0.25s',
                  opacity: i === activePhoto ? 1 : 0.6,
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Info column */}
      <div className="member-info-col">
        {/* Role pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <span style={{
            width: '24px', height: '2px',
            background: 'var(--crimson)',
            display: 'inline-block',
          }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.68rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--crimson)',
          }}>
            {role}
          </span>
        </div>

        {/* Display name */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          letterSpacing: '0.04em',
          color: 'var(--white)',
          textTransform: 'uppercase',
          lineHeight: 1.05,
          margin: '0 0 6px 0',
        }}>
          {member.displayName}
        </h2>

        {/* Member key name */}
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: '28px',
        }}>
          {member.name}
        </div>

        {/* Divider */}
        <div style={{
          width: '100%',
          height: '1px',
          background: 'linear-gradient(90deg, rgba(196,30,58,0.4), transparent)',
          marginBottom: '28px',
        }} />

        {/* Bio */}
        {member.bio && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.85rem, 1.6vw, 0.97rem)',
            lineHeight: 1.85,
            color: 'var(--white-dim)',
            fontStyle: 'italic',
            margin: 0,
            paddingLeft: '16px',
            borderLeft: '2px solid rgba(196,30,58,0.35)',
          }}>
            {member.bio}
          </p>
        )}

        {/* Decorative quote mark */}
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '8rem',
          lineHeight: 1,
          color: 'rgba(196,30,58,0.06)',
          marginTop: '8px',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          "
        </div>
      </div>
    </motion.div>
  );
}

export default function MembersPage() {
  const { ref: headRef, inView: headInView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 72px)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: -20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '72px' }}
        >
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--crimson)',
            marginBottom: '12px',
          }}>
            {BRAND.name} · {MEMBERS_UI.sectionNumber}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            letterSpacing: '0.05em',
            color: 'var(--white)',
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '8px',
          }}>
            {MEMBERS_UI.displayHeading}
          </h1>
          <div style={{
            width: '60px', height: '3px',
            background: 'linear-gradient(90deg, var(--dark-red), var(--crimson))',
            borderRadius: '2px', marginBottom: '16px',
          }} />
          <p style={{
            fontFamily: 'var(--font-italic)',
            fontStyle: 'italic',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: 'var(--white-dim)',
            maxWidth: '500px',
          }}>
            {MEMBERS_UI.subheading}
          </p>
        </motion.div>

        {/* Member rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {MEMBERS.list.map((member, i) => (
            <MemberRow key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        .member-row {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 56px;
          align-items: start;
        }
        .member-row--reversed {
          grid-template-columns: 1fr 340px;
        }
        .member-row--reversed .member-photo-col {
          order: 2;
        }
        .member-row--reversed .member-info-col {
          order: 1;
        }
        .member-info-col {
          padding-top: 20px;
        }
        @media (max-width: 768px) {
          .member-row,
          .member-row--reversed {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .member-row--reversed .member-photo-col,
          .member-row--reversed .member-info-col {
            order: unset;
          }
        }
        @media (max-width: 480px) {
          .member-row {
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
