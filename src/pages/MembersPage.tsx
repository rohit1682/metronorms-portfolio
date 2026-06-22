import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MEMBERS, BRAND } from '../constants';
import { MEMBER_PHOTOS } from '../constants/images';
import { MEMBERS_UI } from '../constants/ui';
import { shuffled } from '../utils/random';

// ─── Cascade intro ────────────────────────────────────────────────────────────

// Pre-built offsets for 18 cards so the stacked pile looks like a real deck
const CARD_OFFSETS = [
  { rotate: -18, x: -22, y:  0 },
  { rotate:  12, x:  18, y:  4 },
  { rotate:  -6, x:  -8, y:  8 },
  { rotate:  16, x:  26, y:  3 },
  { rotate: -11, x: -16, y: 12 },
  { rotate:   7, x:  10, y: 16 },
  { rotate: -20, x: -28, y:  2 },
  { rotate:  14, x:  20, y:  6 },
  { rotate:  -4, x:  -6, y: 20 },
  { rotate:  18, x:  24, y:  5 },
  { rotate:  -9, x: -12, y: 14 },
  { rotate:   5, x:   8, y: 18 },
  { rotate: -15, x: -20, y:  1 },
  { rotate:  10, x:  14, y:  9 },
  { rotate:  -7, x:  -4, y: 22 },
  { rotate:  20, x:  28, y:  3 },
  { rotate: -13, x: -18, y: 10 },
  { rotate:   3, x:   6, y: 24 },
];

// Evenly spread scatter destinations (18 directions)
function scatterDir(i: number, total: number) {
  const angle = ((i / total) * Math.PI * 2) - Math.PI / 2;
  const radius = 1300 + (i % 3) * 200;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * (radius * 0.65),
  };
}

function CascadeIntro({
  photos,
  onDone,
}: {
  photos: string[];
  onDone: () => void;
}) {
  const [scattering, setScattering] = useState(false);
  const vh = globalThis.innerHeight ?? 900;

  useEffect(() => {
    // stagger(50ms) * N cards + fall duration(300ms)
    const landAt  = photos.length * 50 + 300;
    const pauseMs = 380;
    const scatterMs = 520;

    const t1 = setTimeout(() => setScattering(true), landAt + pauseMs);
    const t2 = setTimeout(onDone,                    landAt + pauseMs + scatterMs);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [photos.length, onDone]);

  const overlay = (
    <motion.div
      key="cascade-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 99999,
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'all',
      }}
    >
      {/* Falling cards */}
      {photos.map((src, i) => {
        const off     = CARD_OFFSETS[i % CARD_OFFSETS.length];
        const scatter = scatterDir(i, photos.length);

        return (
          <motion.div
            key={src + i}
            initial={{
              y:      -(vh + 250),
              x:       off.x * 2.5,
              rotate:  off.rotate * 2,
              opacity: 0,
              scale:   1,
            }}
            animate={scattering
              ? {
                  x:       scatter.x,
                  y:       scatter.y,
                  rotate:  off.rotate * 5,
                  opacity: 0,
                  scale:   0.35,
                }
              : {
                  y:       off.y,
                  x:       off.x,
                  rotate:  off.rotate,
                  opacity: 1,
                  scale:   1,
                }
            }
            transition={scattering
              ? { duration: 0.5, ease: [0.4, 0, 0.85, 0.95] }
              : {
                  duration: 0.3,
                  delay:    i * 0.05,
                  ease:     [0.12, 0.8, 0.32, 1.1], // slight overshoot = physical impact
                }
            }
            style={{
              position:     'absolute',
              width:        'clamp(140px, 16vw, 220px)',
              height:       'auto',
              aspectRatio:  '3/4',
              borderRadius: '8px',
              overflow:     'hidden',
              boxShadow:    '0 30px 70px rgba(0,0,0,0.9), 0 6px 20px rgba(196,30,58,0.12)',
              border:       '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <img
              src={src}
              alt=""
              loading="eager"
              style={{
                width:          '100%',
                height:         '100%',
                objectFit:      'cover',
                objectPosition: 'center top',
                display:        'block',
              }}
            />
            {/* Gloss sheen */}
            <div style={{
              position:   'absolute', inset: 0,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, transparent 55%)',
              pointerEvents: 'none',
            }} />
          </motion.div>
        );
      })}

      {/* Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scattering ? 0 : 0.4 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          position:      'absolute',
          bottom:        '9%',
          left:          '50%',
          transform:     'translateX(-50%)',
          fontFamily:    'var(--font-body)',
          fontSize:      '0.62rem',
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color:         'var(--crimson)',
          whiteSpace:    'nowrap',
        }}
      >
        {MEMBERS_UI.displayHeading}
      </motion.div>
    </motion.div>
  );

  // Portal to <body> so it's never clipped by route-transition opacity/transform
  return createPortal(overlay, document.body);
}

// ─── Member row ───────────────────────────────────────────────────────────────

function MemberRow({
  member,
  index,
  usedPhotos,
  onPhotoUsed,
}: {
  member: { name: string; displayName: string; bio: string };
  index: number;
  usedPhotos: Set<string>;
  onPhotoUsed: (url: string) => void;
}) {
  const allPhotos = MEMBER_PHOTOS[member.name] ?? [];
  const photos    = useMemo(() => shuffled(allPhotos), [allPhotos]);

  const [activePhoto, setActivePhoto] = useState(() => {
    const idx = photos.findIndex(p => !usedPhotos.has(p));
    const chosen = idx === -1 ? 0 : idx;
    const url = photos[chosen];
    if (url) onPhotoUsed(url);
    return chosen;
  });

  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView({
    threshold:    0.08,
    triggerOnce:  true,
    rootMargin:   '0px 0px -60px 0px',
  });

  const isReversed = index % 2 !== 0;
  const role       = MEMBERS_UI.roles[member.name] ?? MEMBERS_UI.fallbackRole;

  const handleThumbClick = (i: number) => {
    const url = photos[i];
    if (url) onPhotoUsed(url);
    setActivePhoto(i);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      className={`member-row ${isReversed ? 'member-row--reversed' : ''}`}
    >
      {/* ── Photo column ── */}
      <div className="member-photo-col">
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position:   'relative',
            borderRadius: '8px',
            overflow:   'hidden',
            boxShadow:  hovered
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
              animate={{ opacity: 1, scale: hovered ? 1.05 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                width:          '100%',
                aspectRatio:    '3/4',
                objectFit:      'cover',
                objectPosition: 'center top',
                display:        'block',
                filter:         'brightness(0.9) contrast(1.06)',
              }}
            />
          </AnimatePresence>

          <div style={{
            position:   'absolute', bottom: 0, left: 0, right: 0,
            height:     '35%',
            background: 'linear-gradient(0deg, rgba(10,10,10,0.85) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Index badge */}
          <div style={{
            position:       'absolute', top: '14px', left: '14px',
            fontFamily:     'var(--font-display)',
            fontSize:       '0.65rem', letterSpacing: '0.2em',
            color:          'rgba(255,255,255,0.45)',
            background:     'rgba(0,0,0,0.5)',
            padding:        '4px 10px', borderRadius: '20px',
            backdropFilter: 'blur(6px)',
          }}>
            {String(index + 1).padStart(2, '0')} / {String(MEMBERS.list.length).padStart(2, '0')}
          </div>

          {photos.length > 1 && (
            <div style={{
              position:       'absolute', top: '14px', right: '14px',
              fontSize:       '0.6rem', color: 'rgba(255,255,255,0.5)',
              background:     'rgba(0,0,0,0.45)', padding: '3px 8px',
              borderRadius:   '10px', letterSpacing: '0.1em',
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
                key={src}
                onClick={() => handleThumbClick(i)}
                whileTap={{ scale: 0.92 }}
                style={{
                  flexShrink:  0,
                  width: '48px', height: '48px',
                  borderRadius: '4px', overflow: 'hidden',
                  border: i === activePhoto
                    ? '2px solid var(--crimson)'
                    : '2px solid rgba(255,255,255,0.1)',
                  padding: 0, cursor: 'pointer', background: 'none',
                  transition:   'border-color 0.25s, opacity 0.25s',
                  opacity:      i === activePhoto ? 1 : 0.55,
                }}
              >
                <img
                  src={src} alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* ── Info column ── */}
      <div className="member-info-col">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ width: '24px', height: '2px', background: 'var(--crimson)', display: 'inline-block' }} />
          <span style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '0.68rem', letterSpacing: '0.25em',
            textTransform: 'uppercase', color: 'var(--crimson)',
          }}>
            {role}
          </span>
        </div>

        <h2 style={{
          fontFamily:    'var(--font-display)',
          fontSize:      'clamp(1.8rem, 4vw, 3rem)',
          letterSpacing: '0.04em', color: 'var(--white)',
          textTransform: 'uppercase', lineHeight: 1.05,
          margin:        '0 0 6px 0',
        }}>
          {member.displayName}
        </h2>

        <div style={{
          fontFamily:    'var(--font-body)',
          fontSize:      '0.7rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
          marginBottom:  '28px',
        }}>
          {member.name}
        </div>

        <div style={{
          width: '100%', height: '1px',
          background:    'linear-gradient(90deg, rgba(196,30,58,0.45), transparent)',
          marginBottom:  '28px',
        }} />

        {member.bio && (
          <p style={{
            fontFamily:  'var(--font-body)',
            fontSize:    'clamp(0.85rem, 1.6vw, 0.97rem)',
            lineHeight:  1.85, color: 'var(--white-dim)',
            fontStyle:   'italic', margin: 0,
            paddingLeft: '16px',
            borderLeft:  '2px solid rgba(196,30,58,0.35)',
          }}>
            {member.bio}
          </p>
        )}

        <div style={{
          fontFamily:    'Georgia, serif',
          fontSize:      '8rem', lineHeight: 1,
          color:         'rgba(196,30,58,0.05)',
          marginTop:     '8px',
          userSelect:    'none', pointerEvents: 'none',
        }}>
          "
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MembersPage() {
  const [introDone, setIntroDone] = useState(false);
  const { ref: headRef, inView: headInView } = useInView({ threshold: 0.2, triggerOnce: true });

  const usedPhotoSet = useMemo(() => new Set<string>(), []);
  const onPhotoUsed  = useCallback((url: string) => { usedPhotoSet.add(url); }, [usedPhotoSet]);

  // Collect 2-3 photos per member, shuffle the pool, take up to 18
  const cascadePhotos = useMemo(() => {
    const pool: string[] = [];
    for (const m of MEMBERS.list) {
      const memberPhotos = shuffled(MEMBER_PHOTOS[m.name] ?? []);
      pool.push(...memberPhotos.slice(0, 3));
    }
    return shuffled(pool).slice(0, 18).filter(Boolean);
  }, []);

  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <>
      <AnimatePresence>
        {!introDone && (
          <CascadeIntro photos={cascadePhotos} onDone={handleIntroDone} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background:  '#0a0a0a',
          minHeight:   '100vh',
          padding:     'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 72px)',
        }}
      >
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
              fontFamily:    'var(--font-body)',
              fontSize:      '0.7rem', letterSpacing: '0.3em',
              textTransform: 'uppercase', color: 'var(--crimson)',
              marginBottom:  '12px',
            }}>
              {BRAND.name} · {MEMBERS_UI.sectionNumber}
            </div>
            <h1 style={{
              fontFamily:    'var(--font-display)',
              fontSize:      'clamp(2.5rem, 8vw, 6rem)',
              letterSpacing: '0.05em', color: 'var(--white)',
              textTransform: 'uppercase', lineHeight: 1, marginBottom: '8px',
            }}>
              {MEMBERS_UI.displayHeading}
            </h1>
            <div style={{
              width: '60px', height: '3px',
              background:   'linear-gradient(90deg, var(--dark-red), var(--crimson))',
              borderRadius: '2px', marginBottom: '16px',
            }} />
            <p style={{
              fontFamily: 'var(--font-italic)',
              fontStyle:  'italic',
              fontSize:   'clamp(0.9rem, 2.5vw, 1.1rem)',
              color:      'var(--white-dim)', maxWidth: '500px',
            }}>
              {MEMBERS_UI.subheading}
            </p>
          </motion.div>

          {/* Member rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {MEMBERS.list.map((member, i) => (
              <MemberRow
                key={member.name}
                member={member}
                index={i}
                usedPhotos={usedPhotoSet}
                onPhotoUsed={onPhotoUsed}
              />
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
          .member-row--reversed .member-photo-col { order: 2; }
          .member-row--reversed .member-info-col  { order: 1; }
          .member-info-col { padding-top: 20px; }
          @media (max-width: 768px) {
            .member-row,
            .member-row--reversed {
              grid-template-columns: 1fr;
              gap: 24px;
            }
            .member-row--reversed .member-photo-col,
            .member-row--reversed .member-info-col { order: unset; }
          }
          @media (max-width: 480px) {
            .member-row { gap: 16px; }
          }
        `}</style>
      </motion.div>
    </>
  );
}
