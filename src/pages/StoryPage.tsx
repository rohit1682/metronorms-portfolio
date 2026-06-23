import { useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { STORY, BRAND } from '../constants';
import { HERO_BG, GROUP_PHOTOS, MEMBER_PHOTOS } from '../constants/images';
import { useIsMobile } from '../hooks/useIsMobile';
import { shuffled } from '../utils/random';
import { useCyclingIndex } from '../hooks/useCyclingIndex';

// ── Shared styles (hoisted — not duplicated per section) ─────────────────────
const STORY_STYLES = `
  /* Mobile hero: CSS keyframe, no Framer Motion */
  @keyframes storyFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .chapter-paras-single { display: flex; flex-direction: column; gap: 0; }
  .chapter-paras-multi {
    columns: 2;
    column-gap: clamp(24px, 4vw, 56px);
    column-rule: 1px solid rgba(139,0,0,0.18);
  }
  @media (max-width: 768px) {
    .chapter-section  { grid-template-columns: 1fr !important; }
    .chapter-img-side { order: 0 !important; min-height: 220px !important; }
    .chapter-text-side { order: 1 !important; }
    .chapter-paras-multi { columns: 1 !important; column-rule: none !important; }
    .story-hero-img { filter: brightness(0.4) saturate(0.7) !important; }
  }
`;

// ── Chapter definition ────────────────────────────────────────────────────────
interface Chapter {
  title: string;
  paragraphIndices: number[];
  photos: string[];   // pool resolved at mount; auto-cycles with a crossfade
  imageAlt: string;
  imgSide: 'left' | 'right';
}

/** Static metadata — photos are resolved per-mount in StoryPage via useMemo */
const CHAPTER_META = [
  { title: 'A Beginning',     paragraphIndices: [0, 1],           imageAlt: '',                       imgSide: 'right' as const },
  { title: 'Our Sound',       paragraphIndices: [2, 3],           imageAlt: 'Metronorms performing',   imgSide: 'left'  as const },
  { title: 'The Circuit',     paragraphIndices: [4, 5],           imageAlt: 'Metronorms on stage',     imgSide: 'right' as const },
  { title: 'Our Philosophy',  paragraphIndices: [6, 7],           imageAlt: 'Manodeep Bose',           imgSide: 'left'  as const },
  { title: 'The Milestones',  paragraphIndices: [8, 9, 10, 11, 12], imageAlt: 'Metronorms at Poila Parbon', imgSide: 'right' as const },
  { title: 'Today',           paragraphIndices: [13, 14, 15, 16], imageAlt: STORY.featuredMember,      imgSide: 'left'  as const },
];

// ── Chapter section ───────────────────────────────────────────────────────────
function ChapterSection({
  chapter, index, isMobile,
}: Readonly<{ chapter: Chapter; index: number; isMobile: boolean }>) {
  const { ref, inView } = useInView({
    threshold: isMobile ? 0.05 : 0.1,
    triggerOnce: true,
    rootMargin: isMobile ? '0px 0px -40px 0px' : '0px',
  });

  const isEven = chapter.imgSide === 'left';
  const cycleIdx = useCyclingIndex(chapter.photos.length, 5000);
  const photo = chapter.photos.length ? chapter.photos[cycleIdx % chapter.photos.length] : '';
  const hasPhoto = chapter.photos.length > 0;

  // Mobile: opacity-only (no translate/scale → no layout invalidation on GPU)
  // Desktop: slide-in from the side + subtle scale
  const textVariants = isMobile
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, x: isEven ? 40 : -40 }, visible: { opacity: 1, x: 0 } };

  const imgVariants = isMobile
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, x: isEven ? -40 : 40, scale: 0.97 }, visible: { opacity: 1, x: 0, scale: 1 } };

  const duration = isMobile ? 0.5 : 0.75;

  return (
    <section
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: hasPhoto ? 'repeat(2, 1fr)' : '1fr',
        minHeight: hasPhoto ? (isMobile ? 'auto' : 'min(80vh, 700px)') : 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="chapter-section"
    >
      {/* Photo side */}
      {hasPhoto && (
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={imgVariants}
          transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
          style={{ order: isEven ? 0 : 1 }}
          className="chapter-img-side"
        >
          <div style={{
            position: 'relative', width: '100%', height: '100%',
            minHeight: isMobile ? '300px' : '340px', overflow: 'hidden',
          }}>
            {/* Blurred backdrop fills the letterbox space behind the full photo */}
            <img
              src={photo}
              alt=""
              aria-hidden
              style={{
                position: 'absolute', inset: '-8%',
                width: '116%', height: '116%',
                objectFit: 'cover', objectPosition: 'center',
                filter: 'brightness(0.35) saturate(0.7) blur(28px)',
              }}
            />
            <AnimatePresence mode="sync">
              <motion.img
                key={photo}
                src={photo}
                alt={chapter.imageAlt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'contain', objectPosition: 'center',
                  filter: 'brightness(0.92) contrast(1.05) saturate(0.95)',
                }}
                loading="lazy"
              />
            </AnimatePresence>
            <div style={{
              position: 'absolute', inset: 0,
              background: isEven
                ? 'linear-gradient(270deg, rgba(10,10,10,0.8) 0%, transparent 60%)'
                : 'linear-gradient(90deg, rgba(10,10,10,0.8) 0%, transparent 60%)',
            }} />
            {!isMobile && (
              <div style={{
                position: 'absolute', bottom: '16px',
                [isEven ? 'right' : 'left']: '16px',
                fontFamily: 'var(--font-display)',
                fontSize: '6rem', fontWeight: 700,
                color: 'rgba(139,0,0,0.18)', lineHeight: 1, userSelect: 'none',
              }}>
                {String(index + 1).padStart(2, '0')}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Text side */}
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={textVariants}
        transition={{ duration, delay: isMobile ? 0 : 0.15, ease: [0.4, 0, 0.2, 1] }}
        style={{
          order: isEven ? 1 : 0,
          padding: hasPhoto
            ? 'clamp(28px, 5vw, 64px)'
            : 'clamp(36px, 6vw, 72px) clamp(20px, 8vw, 120px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          background: 'rgba(10,10,10,0.95)', width: '100%',
        }}
        className="chapter-text-side"
      >
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '0.65rem',
          letterSpacing: '0.35em', textTransform: 'uppercase',
          color: 'var(--crimson)', marginBottom: '10px',
        }}>
          Chapter {String(index + 1).padStart(2, '0')}
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? 'clamp(1.4rem, 7vw, 2rem)' : 'clamp(1.6rem, 4vw, 2.8rem)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--white)', marginBottom: '20px', lineHeight: 1.1,
        }}>
          {chapter.title}
        </h2>

        <div style={{
          width: '40px', height: '1px',
          background: 'var(--crimson)', marginBottom: '24px',
        }} />

        <div className={hasPhoto ? 'chapter-paras-single' : 'chapter-paras-multi'}>
          {chapter.paragraphIndices.map((idx) => {
            const isShort = (STORY.paragraphs[idx]?.length ?? 0) < 60;
            return (
              <p
                key={idx}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: isMobile ? '0.9rem' : 'clamp(0.85rem, 1.5vw, 0.98rem)',
                  lineHeight: 1.85,
                  color: isShort ? 'var(--crimson)' : 'var(--white-dim)',
                  fontStyle: isShort ? 'italic' : 'normal',
                  marginBottom: '1em', breakInside: 'avoid',
                }}
              >
                {STORY.paragraphs[idx]}
              </p>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

// ── Story hero — two separate implementations for mobile vs desktop ───────────

/** Mobile hero: zero scroll tracking, no observers, pure CSS fade-in */
function MobileStoryHero() {
  return (
    <div style={{
      position: 'relative',
      height: 'clamp(220px, 55vw, 340px)',
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Static background — eager loaded, no JS scroll tracking */}
      <img
        src={HERO_BG}
        alt=""
        loading="eager"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 65%',
          filter: 'brightness(0.38) saturate(0.7)',
          willChange: 'auto',
        }}
      />

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
        background: 'linear-gradient(0deg, #0a0a0a 0%, transparent 100%)',
        zIndex: 1,
      }} />

      {/* Text — CSS animation, no Framer Motion on mobile hero */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '0.65rem',
          letterSpacing: '0.4em', textTransform: 'uppercase',
          color: 'var(--crimson)', marginBottom: '8px',
          animation: 'storyFadeUp 0.55s ease both',
          animationDelay: '0.05s',
        }}>
          {BRAND.name}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.6rem, 13vw, 4.5rem)',
          letterSpacing: '0.05em', textTransform: 'uppercase',
          color: 'var(--white)', lineHeight: 0.95, margin: 0,
          animation: 'storyFadeUp 0.6s ease both',
          animationDelay: '0.12s',
        }}>
          {STORY.heading}
        </h1>
        <p style={{
          marginTop: '10px',
          fontFamily: 'var(--font-body)', fontSize: '0.82rem',
          color: 'var(--white-dim)', letterSpacing: '0.08em', fontStyle: 'italic',
          animation: 'storyFadeUp 0.55s ease both',
          animationDelay: '0.22s',
        }}>
          {STORY.subheading}
        </p>
      </div>
    </div>
  );
}

/** Desktop hero: parallax + scroll-linked opacity fade */
function DesktopStoryHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', shouldReduceMotion ? '0%' : '30%']);
  const textOp = useTransform(scrollYProgress, [0, 0.7], [1, shouldReduceMotion ? 1 : 0]);

  return (
    <div
      ref={heroRef}
      style={{
        position: 'relative',
        height: 'clamp(300px, 50vh, 540px)',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <motion.div style={{ position: 'absolute', inset: '-20% 0', y: bgY }}>
        <img
          src={HERO_BG}
          alt="Metronorms"
          loading="eager"
          className="story-hero-img"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 65%',
            filter: 'blur(3px) brightness(0.4) saturate(0.7)',
          }}
        />
      </motion.div>

      <div className="noise-overlay" style={{ opacity: 0.04 }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(0deg, #0a0a0a 0%, transparent 100%)',
      }} />

      <motion.div style={{ position: 'relative', zIndex: 2, textAlign: 'center', opacity: textOp, padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          style={{
            fontFamily: 'var(--font-body)', fontSize: '0.68rem',
            letterSpacing: '0.4em', textTransform: 'uppercase',
            color: 'var(--crimson)', marginBottom: '10px',
          }}
        >
          {BRAND.name}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.26 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 9vw, 7rem)',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            color: 'var(--white)', lineHeight: 0.95,
          }}
        >
          {STORY.heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, delay: 0.42 }}
          style={{
            marginTop: '14px',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            color: 'var(--white-dim)', letterSpacing: '0.08em', fontStyle: 'italic',
          }}
        >
          {STORY.subheading}
        </motion.p>
      </motion.div>
    </div>
  );
}

function StoryHero({ isMobile }: Readonly<{ isMobile: boolean }>) {
  return isMobile ? <MobileStoryHero /> : <DesktopStoryHero />;
}

// ── Closing section ───────────────────────────────────────────────────────────
function ClosingSection({ isMobile }: Readonly<{ isMobile: boolean }>) {
  const { ref, inView } = useInView({ threshold: isMobile ? 0.05 : 0.15, triggerOnce: true });

  return (
    <section
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0408 100%)',
        padding: 'clamp(52px, 10vw, 120px) clamp(24px, 8vw, 100px)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: '72px' } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ height: '1px', background: 'var(--crimson)', margin: '0 auto 36px' }}
      />
      <motion.div
        initial={{ opacity: 0, y: isMobile ? 16 : 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: isMobile ? 0.5 : 0.7 }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 4.5rem)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--white)', marginBottom: '12px',
        }}>
          {STORY.closing}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '0.8rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--crimson)', marginBottom: '28px',
        }}>
          {STORY.closingTagline}
        </div>
        <p style={{
          maxWidth: '540px', margin: '0 auto',
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
          lineHeight: 1.9, color: 'var(--white-dim)', fontStyle: 'italic',
        }}>
          {STORY.bookingNote}
        </p>
      </motion.div>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,0,0,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
    </section>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StoryPage() {
  const isMobile = useIsMobile();

  // Random chapter photo pools — group shots are chunked across the three
  // group chapters so no photo repeats between chapters, then each chapter
  // auto-cycles through its own chunk with a crossfade.
  const chapters = useMemo<Chapter[]>(() => {
    const groupPool = shuffled(GROUP_PHOTOS);
    const manodeepPhotos = shuffled(MEMBER_PHOTOS['MANODEEP'] ?? []);
    const featuredPhotos = shuffled(MEMBER_PHOTOS[STORY.featuredMember] ?? []);

    // Split the shuffled group pool into 3 non-overlapping chunks
    const third = Math.ceil(groupPool.length / 3) || 1;
    const groupChunks = [
      groupPool.slice(0, third),
      groupPool.slice(third, third * 2),
      groupPool.slice(third * 2),
    ].map((c) => (c.length ? c : groupPool));

    const photosByIndex: string[][] = [
      [],                                                        // 0 — A Beginning: text-only
      groupChunks[0],                                            // 1 — Our Sound
      groupChunks[1],                                            // 2 — The Circuit
      manodeepPhotos.length ? manodeepPhotos : groupChunks[2],   // 3 — Our Philosophy
      groupChunks[2],                                            // 4 — The Milestones
      featuredPhotos.length ? featuredPhotos : groupChunks[0],   // 5 — Today
    ];
    return CHAPTER_META.map((meta, i) => ({
      ...meta,
      photos: (photosByIndex[i] ?? []).filter(Boolean),
    }));
  }, []);

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Single hoisted style block — not duplicated per section */}
      <style>{STORY_STYLES}</style>

      <StoryHero isMobile={isMobile} />

      {chapters.map((chapter, i) => (
        <ChapterSection key={chapter.title} chapter={chapter} index={i} isMobile={isMobile} />
      ))}

      <ClosingSection isMobile={isMobile} />
    </div>
  );
}
