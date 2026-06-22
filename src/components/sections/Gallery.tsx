import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ALL_PHOTOS, GALLERY_CATEGORIES } from '../../constants/images';
import { GALLERY_UI } from '../../constants/ui';
import { shuffled } from '../../utils/random';

// ── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({
  src,
  onClose,
  onPrev,
  onNext,
  current,
  total,
}: {
  src: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  current: number;
  total: number;
}) {
  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(12px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Image */}
      <motion.img
        key={src}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        src={src}
        alt="Gallery"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 'min(92vw, 1000px)',
          maxHeight: '88vh',
          objectFit: 'contain',
          borderRadius: '4px',
          border: '1px solid rgba(139,0,0,0.3)',
          boxShadow: '0 0 60px rgba(139,0,0,0.3)',
        }}
      />

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(139,0,0,0.6)',
          border: '1px solid rgba(196,30,58,0.5)',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 510,
        }}
      >
        ×
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        style={{
          position: 'fixed',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(10,10,10,0.7)',
          border: '1px solid rgba(139,0,0,0.4)',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 510,
        }}
      >
        ‹
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        style={{
          position: 'fixed',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(10,10,10,0.7)',
          border: '1px solid rgba(139,0,0,0.4)',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 510,
        }}
      >
        ›
      </button>

      {/* Counter */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.15em',
        zIndex: 510,
      }}>
        {current + 1} / {total}
      </div>
    </motion.div>
  );
}

// ── Photo card ───────────────────────────────────────────────────────────────
function PhotoCard({
  src,
  index,
  onClick,
}: {
  src: string;
  index: number;
  onClick: () => void;
}) {
  const [loaded,  setLoaded]  = useState(false);
  const [hovered, setHovered] = useState(false);

  // Entrance trigger — fires once when any part enters the viewport
  const { ref: entranceRef, inView: entered } = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  // Fully-visible trigger — updates continuously as user scrolls
  const { ref: fullRef, inView: fullyVisible } = useInView({
    threshold: 0.75,
    triggerOnce: false,
  });

  // Merge both refs onto the same element
  const containerRef = useRef<HTMLDivElement | null>(null);
  const setRefs = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    (entranceRef as (el: HTMLDivElement | null) => void)(el);
    (fullRef     as (el: HTMLDivElement | null) => void)(el);
  };

  // Image filter: blurred while loading OR while not fully in view
  const imgFilter = !loaded
    ? 'blur(14px) brightness(0.7)'
    : !fullyVisible
      ? 'blur(6px) brightness(0.6)'
      : 'blur(0px) brightness(1)';

  const imgScale = fullyVisible ? (hovered ? 1.07 : 1.0) : 0.96;

  return (
    <motion.div
      ref={setRefs}
      initial={{ opacity: 0, y: 24 }}
      animate={entered ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 12) * 0.04 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:    'relative',
        borderRadius: '4px',
        overflow:    'hidden',
        cursor:      'pointer',
        border:      `1px solid ${hovered ? 'rgba(196,30,58,0.45)' : 'rgba(255,255,255,0.05)'}`,
        background:  '#111',
        breakInside: 'avoid',
        marginBottom: '12px',
        transition:  'border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow:   hovered
          ? '0 8px 32px rgba(139,0,0,0.35), 0 0 0 1px rgba(196,30,58,0.15)'
          : '0 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      <img
        src={src}
        alt={`Gallery ${index + 1}`}
        onLoad={() => setLoaded(true)}
        style={{
          width:      '100%',
          display:    'block',
          objectFit:  'cover',
          filter:     imgFilter,
          transform:  `scale(${imgScale})`,
          transition: 'filter 0.45s ease, transform 0.45s ease',
          transformOrigin: 'center center',
        }}
        loading="lazy"
      />

      {/* Crimson hover overlay */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'linear-gradient(160deg, rgba(139,0,0,0.32) 0%, transparent 60%)',
        opacity:    hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }} />

      {/* Expand hint icon */}
      <div style={{
        position:   'absolute',
        top:        '50%',
        left:       '50%',
        transform:  `translate(-50%, -50%) scale(${hovered ? 1 : 0.5})`,
        opacity:    hovered ? 1 : 0,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        width:      '40px',
        height:     '40px',
        borderRadius: '50%',
        background:  'rgba(0,0,0,0.65)',
        border:      '1px solid rgba(196,30,58,0.6)',
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color:      '#fff',
        fontSize:   '16px',
        pointerEvents: 'none',
        backdropFilter: 'blur(4px)',
      }}>
        ⤢
      </div>
    </motion.div>
  );
}

// ── Main Gallery ─────────────────────────────────────────────────────────────
export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { ref: headRef, inView: headInView } = useInView({ threshold: 0.2, triggerOnce: true });

  // Shuffle order fresh on every page mount so the grid looks different each visit
  const shuffledPhotos = useMemo(() => shuffled(ALL_PHOTOS), []);

  const filtered = activeFilter === 'All'
    ? shuffledPhotos
    : shuffledPhotos.filter((p) => p.category === activeFilter);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => i !== null ? (i - 1 + filtered.length) % filtered.length : null);
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => i !== null ? (i + 1) % filtered.length : null);
  }, [filtered.length]);

  return (
    <section
      id="gallery"
      style={{
        padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 60px)',
        background: '#0a0a0a',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, x: -30 }}
          animate={headInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '40px' }}
        >
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--crimson)',
            marginBottom: '12px',
          }}>
            {GALLERY_UI.sectionNumber} / Gallery
          </div>
          <h2 className="section-heading" style={{ marginBottom: '8px' }}>
            {GALLERY_UI.displayHeading}
          </h2>
          <div className="red-divider" />
          <p style={{
            fontFamily: 'var(--font-italic)',
            fontStyle: 'italic',
            color: 'var(--white-dim)',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            marginTop: '12px',
          }}>
            {GALLERY_UI.subheading}
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '32px',
          }}
        >
          {GALLERY_CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '7px 16px',
                borderRadius: '2px',
                border: activeFilter === cat
                  ? '1px solid var(--crimson)'
                  : '1px solid rgba(255,255,255,0.12)',
                background: activeFilter === cat
                  ? 'rgba(196,30,58,0.2)'
                  : 'transparent',
                color: activeFilter === cat ? 'var(--white)' : 'var(--white-muted)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
              {cat !== 'All' && (
                <span style={{ marginLeft: '6px', opacity: 0.5, fontSize: '0.65rem' }}>
                  {shuffledPhotos.filter((p) => p.category === cat).length}
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              columnCount: 2,
              columnGap: '12px',
            }}
            className="gallery-masonry"
          >
            {filtered.map((photo, i) => (
              <PhotoCard
                key={`${activeFilter}-${photo.src}-${i}`}
                src={photo.src}
                index={i}
                onClick={() => openLightbox(i)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: 'var(--white-muted)',
            fontFamily: 'var(--font-italic)',
            fontStyle: 'italic',
          }}>
            {GALLERY_UI.emptyMessage}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <Lightbox
            src={filtered[lightboxIndex].src}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
            current={lightboxIndex}
            total={filtered.length}
          />
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 640px) {
          .gallery-masonry { column-count: 2 !important; }
        }
        @media (min-width: 1024px) {
          .gallery-masonry { column-count: 3 !important; }
        }
        .gallery-masonry > div:hover .gallery-hover-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
