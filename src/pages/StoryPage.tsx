import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { STORY, BRAND } from '../constants';
import { GROUP_PHOTOS, MEMBER_PHOTOS, HERO_BG } from '../constants/images';

// ── Chapter definition ─────────────────────────────────────────────────────
interface Chapter {
  title: string;
  paragraphIndices: number[];
  photoFn: () => string;
  imageAlt: string;
  imgSide: 'left' | 'right';
}

const CHAPTERS: Chapter[] = [
  {
    title: 'A Beginning',
    paragraphIndices: [0, 1],
    photoFn: () => '',
    imageAlt: '',
    imgSide: 'right',
  },
  {
    title: 'Our Sound',
    paragraphIndices: [2, 3],
    photoFn: () => GROUP_PHOTOS[4] ?? GROUP_PHOTOS[0] ?? '',
    imageAlt: 'Metronorms performing',
    imgSide: 'left',
  },
  {
    title: 'The Circuit',
    paragraphIndices: [4, 5],
    photoFn: () => GROUP_PHOTOS[5] ?? GROUP_PHOTOS[0] ?? '',
    imageAlt: 'Metronorms on stage',
    imgSide: 'right',
  },
  {
    title: 'Our Philosophy',
    paragraphIndices: [6, 7],
    photoFn: () => MEMBER_PHOTOS['MANODEEP']?.[0] ?? GROUP_PHOTOS[0] ?? '',
    imageAlt: 'Manodeep Bose',
    imgSide: 'left',
  },
  {
    title: 'The Milestones',
    paragraphIndices: [8, 9, 10, 11, 12],
    photoFn: () => GROUP_PHOTOS[6] ?? GROUP_PHOTOS[0] ?? '',
    imageAlt: 'Metronorms at Poila Parbon',
    imgSide: 'right',
  },
  {
    title: 'Today',
    paragraphIndices: [13, 14, 15, 16],
    photoFn: () => MEMBER_PHOTOS[STORY.featuredMember]?.[0] ?? GROUP_PHOTOS[0] ?? '',
    imageAlt: STORY.featuredMember,
    imgSide: 'left',
  },
];

// ── Animated chapter section ────────────────────────────────────────────────
function ChapterSection({ chapter, index }: Readonly<{ chapter: Chapter; index: number }>) {
  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true });
  const isEven = chapter.imgSide === 'left';

  const textVariants = {
    hidden: { opacity: 0, x: isEven ? 40 : -40 },
    visible: { opacity: 1, x: 0 },
  };
  const imgVariants = {
    hidden: { opacity: 0, x: isEven ? -40 : 40, scale: 0.97 },
    visible: { opacity: 1, x: 0, scale: 1 },
  };

  const photo = chapter.photoFn();
  const hasPhoto = Boolean(photo);

  return (
    <section
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: hasPhoto ? 'repeat(2, 1fr)' : '1fr',
        minHeight: hasPhoto ? 'min(80vh, 700px)' : 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="chapter-section"
    >
      {/* Photo side — only rendered when a photo exists */}
      {hasPhoto && (
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={imgVariants}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ order: isEven ? 0 : 1 }}
          className="chapter-img-side"
        >
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '340px',
            overflow: 'hidden',
          }}>
            <img
              src={photo}
              alt={chapter.imageAlt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                filter: 'brightness(0.75) contrast(1.08) saturate(0.9)',
              }}
              loading="lazy"
            />

            {/* Edge gradient bleeding into text area */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: isEven
                ? 'linear-gradient(270deg, rgba(10,10,10,0.8) 0%, transparent 60%)'
                : 'linear-gradient(90deg, rgba(10,10,10,0.8) 0%, transparent 60%)',
            }} />

            {/* Chapter number watermark */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              [isEven ? 'right' : 'left']: '16px',
              fontFamily: 'var(--font-display)',
              fontSize: '6rem',
              fontWeight: 700,
              color: 'rgba(139,0,0,0.18)',
              lineHeight: 1,
              userSelect: 'none',
            }}>
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        </motion.div>
      )}

      {/* Text side */}
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={textVariants}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
        style={{
          order: isEven ? 1 : 0,
          padding: hasPhoto
            ? 'clamp(32px, 6vw, 72px)'
            : 'clamp(40px, 7vw, 80px) clamp(24px, 8vw, 120px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'rgba(10,10,10,0.95)',
          width: '100%',
        }}
        className="chapter-text-side"
      >
        {/* Chapter label */}
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.65rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--crimson)',
          marginBottom: '10px',
        }}>
          Chapter {String(index + 1).padStart(2, '0')}
        </div>

        {/* Chapter title */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--white)',
          marginBottom: '24px',
          lineHeight: 1.1,
        }}>
          {chapter.title}
        </h2>

        {/* Divider */}
        <div style={{
          width: '48px',
          height: '1px',
          background: 'var(--crimson)',
          marginBottom: '28px',
        }} />

        {/* Paragraphs — 2-column flow on desktop when no photo, single on mobile */}
        <div className={hasPhoto ? 'chapter-paras-single' : 'chapter-paras-multi'}>
          {chapter.paragraphIndices.map((idx) => {
            const isShort = (STORY.paragraphs[idx]?.length ?? 0) < 60;
            return (
              <p
                key={idx}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.85rem, 1.5vw, 0.98rem)',
                  lineHeight: 1.85,
                  color: isShort ? 'var(--crimson)' : 'var(--white-dim)',
                  fontStyle: isShort ? 'italic' : 'normal',
                  marginBottom: '1em',
                  breakInside: 'avoid',
                }}
              >
                {STORY.paragraphs[idx]}
              </p>
            );
          })}
        </div>
      </motion.div>

      <style>{`
        /* Multi-column text (no-photo chapters) — desktop */
        .chapter-paras-single {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .chapter-paras-multi {
          columns: 2;
          column-gap: clamp(24px, 4vw, 56px);
          column-rule: 1px solid rgba(139,0,0,0.18);
        }

        /* Mobile: everything stacks, single column */
        @media (max-width: 768px) {
          .chapter-section {
            grid-template-columns: 1fr !important;
          }
          .chapter-img-side {
            order: 0 !important;
            min-height: 240px !important;
          }
          .chapter-text-side {
            order: 1 !important;
          }
          .chapter-paras-multi {
            columns: 1 !important;
            column-rule: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ── Parallax hero header ────────────────────────────────────────────────────
function StoryHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div
      ref={heroRef}
      style={{
        position: 'relative',
        height: 'clamp(320px, 55vh, 560px)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Parallax background */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-20% 0',
          y: bgY,
        }}
      >
        <img
          src={HERO_BG}
          alt="Metronorms"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 25%',
            filter: 'blur(3px) brightness(0.4) saturate(0.7)',
          }}
        />
      </motion.div>

      {/* Noise overlay */}
      <div className="noise-overlay" style={{ opacity: 0.04 }} />

      {/* Gradient bottom fade */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '50%',
        background: 'linear-gradient(0deg, #0a0a0a 0%, transparent 100%)',
      }} />

      {/* Hero text */}
      <motion.div
        style={{ position: 'relative', zIndex: 2, textAlign: 'center', opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--crimson)',
            marginBottom: '12px',
          }}
        >
          {BRAND.name}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 9vw, 7rem)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--white)',
            lineHeight: 0.95,
          }}
        >
          {STORY.heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            marginTop: '16px',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            color: 'var(--white-dim)',
            letterSpacing: '0.08em',
            fontStyle: 'italic',
          }}
        >
          {STORY.subheading}
        </motion.p>
      </motion.div>
    </div>
  );
}

// ── Closing section ─────────────────────────────────────────────────────────
function ClosingSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section
      ref={ref}
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0408 100%)',
        padding: 'clamp(60px, 10vw, 120px) clamp(24px, 8vw, 100px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Red divider top */}
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: '80px' } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          height: '1px',
          background: 'var(--crimson)',
          margin: '0 auto 40px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 4.5rem)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--white)',
          marginBottom: '12px',
        }}>
          {STORY.closing}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--crimson)',
          marginBottom: '32px',
        }}>
          {STORY.closingTagline}
        </div>
        <p style={{
          maxWidth: '560px',
          margin: '0 auto',
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.85rem, 1.6vw, 0.98rem)',
          lineHeight: 1.9,
          color: 'var(--white-dim)',
          fontStyle: 'italic',
        }}>
          {STORY.bookingNote}
        </p>
      </motion.div>

      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,0,0,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
    </section>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
export default function StoryPage() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <StoryHero />

      {/* Chapters */}
      {CHAPTERS.map((chapter, i) => (
        <ChapterSection key={chapter.title} chapter={chapter} index={i} />
      ))}

      <ClosingSection />
    </div>
  );
}
