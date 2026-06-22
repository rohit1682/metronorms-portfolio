/**
 * HighlightsPage — 3-phase cinematic animation → gallery.
 *
 * Performance architecture:
 *  - ALL photo thumbnails use CSS @keyframes (compositor thread, zero JS/frame).
 *    CSS custom properties --ox/--oy/--rot set per element as start position.
 *  - Only the star core + explosion particles use Framer Motion.
 *  - Thumbnails are preloaded before animation starts.
 *  - Only transform/opacity animated — no layout-triggering properties.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Gallery from '../components/sections/Gallery';
import { ALL_PHOTOS } from '../constants/images';

// ── types ─────────────────────────────────────────────────────────────────────
type Phase = 'loading' | 'pulling' | 'exploding' | 'gallery';

interface ThumbDef {
  id: number; src: string;
  ox: number; oy: number; rot: number;
  size: number; delay: number;
}
interface PartDef {
  id: number; tx: number; ty: number;
  size: number; color: string; delay: number;
}

// ── tunables ──────────────────────────────────────────────────────────────────
const PULL_MS    = 3200;  // longer so big photos are visible across their journey
const EXP_MS     = 700;
const N_PARTS    = 20;
const WARMUP_MS  = 350;
// max_delay (0.5s) + ani_duration (2.4s) = 2.9s < PULL_MS (3.2s) ✓
const THUMB_ANI_DUR   = 2.4;  // seconds — long enough to enjoy the journey
const THUMB_MAX_DELAY = 0.5;

// ── Neutron-star palette ──────────────────────────────────────────────────────
// Layered gradients give a pseudo-3D sphere appearance:
//  1. off-centre specular hotspot (white)
//  2. blue plasma body
//  3. limb-darkening shadow (opposite side)
const STAR_3D = [
  'radial-gradient(circle at 38% 34%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 28%)',
  'radial-gradient(circle at 50% 50%, #e8f4ff 0%, #5aaaff 28%, #0d4aaa 60%, #000d1f 100%)',
  'radial-gradient(circle at 64% 66%, rgba(0,6,18,0.75) 0%, transparent 50%)',
].join(', ');

const STAR_GLOW_PULL =
  '0 0 0 2px rgba(100,180,255,0.25), ' +
  '0 0 20px 6px rgba(100,180,255,0.55), ' +
  '0 0 60px 20px rgba(60,120,255,0.3), ' +
  '0 0 120px 50px rgba(30,80,200,0.15)';

const STAR_GLOW_EXPLODE =
  '0 0 0 3px rgba(255,255,255,0.6), ' +
  '0 0 40px 16px rgba(120,200,255,0.9), ' +
  '0 0 100px 40px rgba(80,160,255,0.6), ' +
  '0 0 180px 80px rgba(200,30,58,0.35)';

const PART_COLORS = [
  '#ffffff', '#d0eaff', '#7ab8ff', '#3a7fff',
  '#FF1744', '#FF6B6B', '#FFD700', '#FF8C00',
];

// ── CSS for thumbnails (compositor thread) ────────────────────────────────────
// fill-mode: both → browser applies `from` keyframe BEFORE the delay fires,
// so each thumbnail appears at its edge position immediately on mount.
// No conflicting opacity: 0 rule — let the animation own opacity entirely.
const THUMB_CSS = `
  @keyframes flyInToStar {
    /* Photo starts BIG and stays large for the first ~55% of its journey */
    from {
      transform: translate(var(--ox), var(--oy)) rotate(var(--rot)) scale(1);
      opacity: 1;
    }
    /* Mid-journey: still prominent, starting to pull in */
    55% {
      transform: translate(calc(var(--ox) * 0.32), calc(var(--oy) * 0.32))
                 rotate(calc(var(--rot) * 0.45)) scale(0.75);
      opacity: 0.92;
    }
    /* Getting close: shrinking fast */
    80% {
      transform: translate(calc(var(--ox) * 0.06), calc(var(--oy) * 0.06))
                 rotate(calc(var(--rot) * 0.12)) scale(0.28);
      opacity: 0.5;
    }
    /* At the star: collapsed and gone */
    to {
      transform: translate(0px, 0px) rotate(0deg) scale(0.03);
      opacity: 0;
    }
  }
  .star-thumb {
    position: absolute;
    top: 50%; left: 50%;
    border-radius: 6px;
    overflow: hidden;
    border: 1.5px solid rgba(100,180,255,0.65);
    box-shadow: 0 0 18px rgba(100,180,255,0.45), 0 4px 24px rgba(0,0,0,0.6);
    background: rgba(8,24,55,0.6);
    will-change: transform, opacity;
    animation: flyInToStar var(--dur) ease-in both;
    animation-delay: var(--delay);
  }
  .star-thumb img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    filter: brightness(0.92) saturate(0.8);
  }
`;

// ── helpers ───────────────────────────────────────────────────────────────────
function rnd(a: number, b: number) { return a + Math.random() * (b - a); }

function edgePx(vw: number, vh: number, size: number) {
  // Push origin just past the screen edge so the photo enters from outside
  const mx = vw / 2 + size / 2 + 20;
  const my = vh / 2 + size / 2 + 20;
  const side = Math.floor(Math.random() * 4);
  switch (side) {
    case 0: return { ox: rnd(-mx, mx), oy: -my };          // top
    case 1: return { ox: rnd(-mx, mx), oy:  my };          // bottom
    case 2: return { ox: -mx, oy: rnd(-my, my) };          // left
    default: return { ox:  mx, oy: rnd(-my, my) };         // right
  }
}


// ── Star core ─────────────────────────────────────────────────────────────────
function NeutronStar({ phase }: Readonly<{ phase: Phase }>) {
  const pulling   = phase === 'pulling';
  const exploding = phase === 'exploding';

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 12,
    }}>
      {/* CSS-animated pulse rings */}
      {pulling && [70, 120, 185].map((d, i) => (
        <div key={d} style={{
          position: 'absolute',
          width: d, height: d, borderRadius: '50%',
          border: `1px solid rgba(100,180,255,${0.55 - i * 0.14})`,
          boxShadow: `0 0 ${12 + i * 8}px rgba(100,180,255,${0.28 - i * 0.07})`,
          animationName: 'star-ring-pulse',
          animationDuration: `${1.1 + i * 0.28}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          animationDelay: `${i * 0.25}s`,
          willChange: 'transform, opacity',
        }} />
      ))}

      {/* 3D core orb — scale only (no layout cost) */}
      <motion.div
        style={{
          position: 'absolute',
          width: 22, height: 22,
          borderRadius: '50%',
          background: STAR_3D,
          boxShadow: exploding ? STAR_GLOW_EXPLODE : STAR_GLOW_PULL,
          willChange: 'transform, opacity',
        }}
        animate={
          pulling
            ? { scale: [0.75, 1.4, 0.75], opacity: [1, 0.85, 1] }
            : exploding
            ? { scale: [1, 9, 0],         opacity: [1, 1,    0] }
            : { scale: 0, opacity: 0 }
        }
        transition={
          pulling
            ? { duration: 1.05, repeat: Infinity, ease: 'easeInOut' }
            : { duration: EXP_MS / 1000 * 0.82, ease: [0.1, 0, 0.65, 1] }
        }
      />

      {/* CSS ring-pulse keyframe */}
      <style>{`
        @keyframes star-ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.65; }
          50%       { transform: scale(1.5); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}

// ── Explosion ─────────────────────────────────────────────────────────────────
function Explosion() {
  const parts = useMemo<PartDef[]>(() =>
    Array.from({ length: N_PARTS }, (_, i) => {
      const angle = (360 / N_PARTS) * i + rnd(-5, 5);
      const dist  = rnd(120, 500);
      const rad   = (angle * Math.PI) / 180;
      return {
        id: i,
        tx: Math.cos(rad) * dist,
        ty: Math.sin(rad) * dist,
        size: rnd(4, 14),
        color: PART_COLORS[Math.floor(rnd(0, PART_COLORS.length))],
        delay: rnd(0, 0.06),
      };
    }), []
  );

  const vmax = Math.max(globalThis.innerWidth ?? 1440, globalThis.innerHeight ?? 900);
  const ringScale = Math.round(vmax * 2.2 / 20);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 11,
    }}>
      {/* Scale-only shockwave rings */}
      <motion.div
        initial={{ scale: 0.5, opacity: 1 }}
        animate={{ scale: ringScale, opacity: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{
          position: 'absolute', width: 20, height: 20, borderRadius: '50%',
          border: '3px solid rgba(100,180,255,0.95)',
          boxShadow: '0 0 30px rgba(100,180,255,0.7), 0 0 60px rgba(255,23,68,0.3)',
          willChange: 'transform, opacity',
        }}
      />
      <motion.div
        initial={{ scale: 0.3, opacity: 0.7 }}
        animate={{ scale: ringScale * 1.4, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.06, ease: 'easeOut' }}
        style={{
          position: 'absolute', width: 20, height: 20, borderRadius: '50%',
          border: '1px solid rgba(196,30,58,0.6)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Particles */}
      {parts.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: p.tx, y: p.ty, scale: 0, opacity: 0 }}
          transition={{ duration: rnd(0.5, 0.8), delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HighlightsPage() {
  const [phase, setPhase] = useState<Phase>('loading');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // N_THUMBS thumbnails, each guaranteed to finish its animation BEFORE PULL_MS:
  //   delay ≤ THUMB_MAX_DELAY, duration = THUMB_ANI_DUR
  //   → max finish = THUMB_MAX_DELAY + THUMB_ANI_DUR = 2.0s < PULL_MS (2.4s) ✓
  const thumbs = useMemo<ThumbDef[]>(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Responsive sizing: keep photos visible but proportional to viewport
    const isMobile = vw < 640;
    const isTablet = vw < 1024;
    const minPx = isMobile ? 72  : isTablet ? 100 : 130;
    const maxPx = isMobile ? 120 : isTablet ? 165 : 215;
    const count = isMobile ? 10  : isTablet ? 12  : 14;
    return [...ALL_PHOTOS]
      .sort(() => rnd(-1, 1))
      .slice(0, count)
      .map((p, i) => {
        const size = Math.round(rnd(minPx, maxPx));
        const { ox, oy } = edgePx(vw, vh, size);
        const delay = rnd(0, THUMB_MAX_DELAY);
        return { id: i, src: p.src, ox, oy, rot: rnd(-38, 38), size, delay };
      });
  }, []);

  useEffect(() => {
    // Short warmup — lets the browser paint the stage div before animations fire.
    // No blocking preload: dark placeholder is visible while images decode.
    const warm = setTimeout(() => {
      setPhase('pulling');
      const t1 = setTimeout(() => {
        setPhase('exploding');
        const t2 = setTimeout(() => setPhase('gallery'), EXP_MS + 250);
        timers.current.push(t2);
      }, PULL_MS);
      timers.current.push(t1);
    }, WARMUP_MS);
    timers.current.push(warm);
    const currentTimers = timers.current;
    return () => currentTimers.forEach(clearTimeout);
  }, [thumbs]);

  const skip = () => { timers.current.forEach(clearTimeout); setPhase('gallery'); };

  const thumbDur = `${THUMB_ANI_DUR}s`;

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {/* CSS keyframes for thumbnails — one tag, not per-element */}
      <style>{THUMB_CSS}</style>

      <AnimatePresence mode="wait">

        {/* Loading spinner */}
        {phase === 'loading' && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: '#000',
            }}
          >
            <motion.div
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 18, height: 18, borderRadius: '50%',
                background: STAR_3D, boxShadow: STAR_GLOW_PULL,
                willChange: 'transform, opacity',
              }}
            />
            <div style={{
              marginTop: 18, fontFamily: 'var(--font-body)',
              fontSize: '0.62rem', letterSpacing: '0.3em',
              textTransform: 'uppercase', color: '#6ab0ff',
            }}>
              Preparing…
            </div>
          </motion.div>
        )}

        {/* Animation stage */}
        {(phase === 'pulling' || phase === 'exploding') && (
          <motion.div
            key="stage"
            exit={{ opacity: 0, transition: { duration: 0.55 } }}
            style={{
              position: 'fixed', top: 0, left: 0,
              width: '100vw', height: '100vh',
              zIndex: 50,
              background: 'radial-gradient(ellipse at center, #06101f 0%, #000 65%)',
            }}
          >
            {/* Title */}
            <AnimatePresence>
              {phase === 'pulling' && (
                <motion.div
                  key="title"
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: 'clamp(44px, 9vh, 84px)',
                    left: 0, right: 0, textAlign: 'center',
                    zIndex: 20, pointerEvents: 'none',
                  }}
                >
                  <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#fff', margin: 0, lineHeight: 1,
                    textShadow: '0 0 60px rgba(100,180,255,0.4)',
                  }}>
                    Our Highlights
                  </h1>
                  <motion.p
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 1.7, repeat: Infinity }}
                    style={{
                      marginTop: 10, fontFamily: 'var(--font-body)',
                      fontSize: '0.68rem', letterSpacing: '0.32em',
                      textTransform: 'uppercase', color: '#6ab0ff',
                    }}
                  >
                    Gravity is pulling everything together…
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thumbnails — present for the entire animation stage.
                Each animation finishes (opacity→0) before PULL_MS elapses,
                so they are already invisible when the explosion fires. */}
            {thumbs.map((t) => (
              <div
                key={t.id}
                className="star-thumb"
                style={{
                  '--ox': `${t.ox}px`,
                  '--oy': `${t.oy}px`,
                  '--rot': `${t.rot}deg`,
                  '--dur': thumbDur,
                  '--delay': `${t.delay}s`,
                  marginTop: -(t.size / 2),
                  marginLeft: -(t.size / 2),
                  width: t.size,
                  height: t.size,
                } as React.CSSProperties}
              >
                <img src={t.src} alt="" loading="eager" />
              </div>
            ))}

            <NeutronStar phase={phase} />
            {phase === 'exploding' && <Explosion />}

            {/* Skip — bottom-left so it never overlaps the audio player (bottom-right) */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={skip}
              style={{
                position: 'absolute', bottom: 24, left: 20,
                padding: '7px 18px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2, color: '#fff',
                fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: 'pointer', zIndex: 60,
              }}
            >
              Skip →
            </motion.button>
          </motion.div>
        )}

        {/* Gallery */}
        {phase === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <Gallery />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
