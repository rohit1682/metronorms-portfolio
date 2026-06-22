import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MEMBERS, BRAND } from '../constants';
import { MEMBER_PHOTOS } from '../constants/images';
import { MEMBERS_UI } from '../constants/ui';

function MemberCard({ member, index }: { member: { name: string }; index: number }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [hovered, setHovered] = useState(false);
  const photos = MEMBER_PHOTOS[member.name] ?? [];
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      {/* Main photo */}
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          borderRadius: '6px',
          overflow: 'hidden',
          border: hovered ? '1px solid rgba(196,30,58,0.7)' : '1px solid rgba(255,255,255,0.06)',
          transition: 'border-color 0.3s ease',
          boxShadow: hovered ? '0 0 30px rgba(196,30,58,0.3)' : 'none',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activePhoto}
            src={photos[activePhoto] ?? ''}
            alt={member.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              width: '100%',
              aspectRatio: '3/4',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
              filter: 'brightness(0.88) contrast(1.08)',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
        </AnimatePresence>

        {/* Bottom overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '55%',
          background: 'linear-gradient(0deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.2) 70%, transparent 100%)',
          zIndex: 2,
        }} />

        {/* Name + role */}
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 3 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            letterSpacing: '0.1em',
            color: 'var(--white)',
            lineHeight: 1.1,
            marginBottom: '4px',
          }}>
            {member.name}
          </div>
          <div style={{
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--crimson)',
          }}>
            {MEMBERS_UI.roles[member.name] ?? MEMBERS_UI.fallbackRole}
          </div>
        </div>

        {/* Photo count badge */}
        {photos.length > 1 && (
          <div style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 3,
            fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)',
            background: 'rgba(0,0,0,0.45)', padding: '3px 8px',
            borderRadius: '10px', letterSpacing: '0.1em',
          }}>
            {activePhoto + 1} / {photos.length}
          </div>
        )}
      </motion.div>

      {/* Thumbnail strip — multiple photos */}
      {photos.length > 1 && (
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {photos.slice(0, 6).map((src, i) => (
            <motion.button
              key={i}
              onClick={() => setActivePhoto(i)}
              whileTap={{ scale: 0.95 }}
              style={{
                flexShrink: 0,
                width: '44px',
                height: '44px',
                borderRadius: '3px',
                overflow: 'hidden',
                border: i === activePhoto
                  ? '2px solid var(--crimson)'
                  : '2px solid rgba(255,255,255,0.08)',
                padding: 0,
                cursor: 'pointer',
                background: 'none',
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
    </motion.div>
  );
}

export default function MembersPage() {
  const { ref: headRef, inView: headInView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: -20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '56px' }}
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

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
          gap: '24px',
        }}>
          {MEMBERS.list.map((member, i) => (
            <MemberCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
