/**
 * HighlightsPage — 3-phase cinematic animation → gallery.
 *
 * Performance principles:
 *  - ONLY animate transform (x, y, scale, rotate) and opacity — both GPU-composited.
 *  - NEVER animate width/height (causes layout reflow every frame).
 *  - Pulsing rings use CSS @keyframes (lower JS overhead than Framer Motion repeat).
 *  - Element counts kept low: 12 thumbnails, 28 particles.
 *  - willChange: 'transform, opacity' on every animated element.
 *  - Images pre-loaded before animation starts so no decode jank mid-flight.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Gallery from '../components/sections/Gallery';
import { ALL_PHOTOS } from '../constants/images';

// ── types ─────────────────────────────────────────────────────────────────────
type Phase = 'loading' | 'pulling' | 'exploding' | 'gallery';

interface ThumbDef {
  id: number; src: string;
  ox: number; oy: number;   // pixel offset from screen centre (start position)
  rot: number; size: number; delay: number;
}
interface PartDef {
  id: number; tx: number; ty: number;
  size: number; color: string; delay: number;
}

// ── tunables ──────────────────────────────────────────────────────────────────
const PULL_MS  = 2600;
const EXP_MS   = 1200;
const N_THUMBS = 12;   // fewer = smoother on low-end devices
const N_PARTS  = 28;

// Star base pixel size — scale transform does the rest (no width/height animation)
const STAR_BASE   = 20;  // px — the "1x" size of the core orb
const RING_BASE   = 24;  // px — shockwave rings start at this, scale up

const PART_COLORS = [
  '#ffffff', '#c8e6ff', '#6ab0ff', '#3a80ff',
  '#FF1744', '#FF6B6B', '#FFD700', '#FF8C00',
];

// ── helpers ───────────────────────────────────────────────────────────────────
function rnd(a: number, b: number) { return a + Math.random() * (b - a); }

function edgePx(vw: number, vh: number, size: number) {
  const mx = vw / 2 + size + 16;
  const my = vh / 2 + size + 16;
  const side = Math.floor(Math.random() * 4);
  switch (side) {
    case 0: return { ox: rnd(-mx, mx), oy: -my };
    case 1: return { ox: rnd(-mx, mx), oy:  my };
    case 2: return { ox: -mx, oy: rnd(-my * 0.85, my * 0.85) };
    default: return { ox:  mx, oy: rnd(-my * 0.85, my * 0.85) };
  }
}

async function preloadImages(srcs: string[]) {
  return Promise.allSettled(
    srcs.map(src => new Promise<void>((res) => {
      const img = new Image();
      img.onload = img.onerror = () => res();
      img.src = src;
    }))
  );
}

// ── CSS for pulsing rings (cheaper than Framer Motion repeat) ─────────────────
const PULSE_KEYFRAMES = `
  @keyframes star-pulse {
    0%, 100% { transform: scale(1); opacity: 0.65; }
    50%       { transform: scale(1.5); opacity: 0.12; }
  }
`;

// ── Neutron Star ──────────────────────────────────────────────────────────────
function NeutronStar({ phase }: Readonly<{ phase: Phase }>) {
  const pulling   = phase === 'pulling';
  const exploding = phase === 'exploding';

  return (
    <>
      <style>{PULSE_KEYFRAMES}</style>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', zIndex: 12,
      }}>
        {/* Pulsing rings — CSS animation, runs forever during pull */}
        {pulling && [80, 140, 210].map((d, i) => (
          <div
            key={d}
            style={{
              position: 'absolute',
              width: d, height: d,
              borderRadius: '50%',
              border: `1px solid rgba(100,180,255,${0.55 - i * 0.14})`,
              boxShadow: `0 0 ${14 + i * 10}px rgba(100,180,255,${0.28 - i * 0.07})`,
              animationName: 'star-pulse',
              animationDuration: `${1.2 + i * 0.25}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: `${i * 0.28}s`,
              willChange: 'transform, opacity',
            }}
          />
        ))}

        {/* Core orb — scale-only animation (no width/height change) */}
        <motion.div
          style={{
            position: 'absolute',
            width:  STAR_BASE,
            height: STAR_BASE,
            borderRadius: '50%',
            background: exploding
              ? 'radial-gradient(circle, #fff 0%, #b0d8ff 30%, #5599ff 55%, #8B0000 100%)'
              : 'radial-gradient(circle, #fff 0%, #c8e6ff 35%, #6ab0ff 65%, #1a56b0 100%)',
            boxShadow: exploding
              ? '0 0 60px 20px rgba(80,160,255,0.85), 0 0 140px 50px rgba(196,30,58,0.45)'
              : '0 0 30px 10px rgba(100,180,255,0.65), 0 0 70px 22px rgba(60,120,255,0.3)',
            willChange: 'transform, opacity',
          }}
          animate={
            pulling
              ? { scale: [0.7, 1.3, 0.7], opacity: [1, 0.8, 1] }
              : exploding
              ? { scale: [1, 9, 0],       opacity: [1, 1,   0] }
              : { scale: 0, opacity: 0 }
          }
          transition={
            pulling
              ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
              : { duration: EXP_MS / 1000 * 0.85, ease: [0.1, 0, 0.7, 1] }
          }
        />
      </div>
    </>
  );
}

// ── Shockwave + Particles ─────────────────────────────────────────────────────
function Explosion() {
  // Particles computed once
  const parts = useMemo<PartDef[]>(() =>
    Array.from({ length: N_PARTS }, (_, i) => {
      const angle = (360 / N_PARTS) * i + rnd(-6, 6);
      const dist  = rnd(90, 340);
      const rad   = (angle * Math.PI) / 180;
      return {
        id:    i,
        tx:    Math.cos(rad) * dist,
        ty:    Math.sin(rad) * dist,
        size:  rnd(4, 11),
        color: PART_COLORS[Math.floor(Math.random() * PART_COLORS.length)],
        delay: rnd(0, 0.06),
      };
    }), []
  );

  // Scale-only shockwave: start tiny, scale to fill screen
  const ringTargetScale = Math.round(window.innerWidth * 1.8 / RING_BASE);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 11,
    }}>
      {/* Shockwave ring 1 */}
      <motion.div
        initial={{ scale: 0.5, opacity: 1 }}
        animate={{ scale: ringTargetScale, opacity: 0 }}
        transition={{ duration: 0.95, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width:  RING_BASE, height: RING_BASE,
          borderRadius: '50%',
          border: '3px solid rgba(100,180,255,0.9)',
          boxShadow: '0 0 40px rgba(100,180,255,0.6), 0 0 80px rgba(255,23,68,0.35)',
          willChange: 'transform, opacity',
        }}
      />
      {/* Shockwave ring 2 */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0.7 }}
        animate={{ scale: ringTargetScale * 1.35, opacity: 0 }}
        transition={{ duration: 1.05, delay: 0.08, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width:  RING_BASE, height: RING_BASE,
          borderRadius: '50%',
          border: '1px solid rgba(196,30,58,0.6)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Particles — translate only, no layout cost */}
      {parts.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: p.tx, y: p.ty, scale: 0, opacity: 0 }}
          transition={{ duration: rnd(0.65, 0.95), delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width:  p.size,
            height: p.size,
            borderRadius: '50%',
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

  // Generate thumbnail data once (stable across renders)
  const thumbs = useMemo<ThumbDef[]>(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return [...ALL_PHOTOS]
      .sort(() => Math.random() - 0.5)
      .slice(0, N_THUMBS)
      .map((p, i) => {
        const size = Math.round(rnd(72, 128));
        const { ox, oy } = edgePx(vw, vh, size);
        return { id: i, src: p.src, ox, oy, rot: rnd(-40, 40), size, delay: rnd(0, 0.4) };
      });
  }, []);

  // Preload images then kick off animation
  useEffect(() => {
    preloadImages(thumbs.map(t => t.src)).then(() => {
      setPhase('pulling');
      const t1 = setTimeout(() => {
        setPhase('exploding');
        const t2 = setTimeout(() => setPhase('gallery'), EXP_MS + 300);
        timers.current.push(t2);
      }, PULL_MS);
      timers.current.push(t1);
    });
    return () => timers.current.forEach(clearTimeout);
  }, [thumbs]);

  const skip = () => {
    timers.current.forEach(clearTimeout);
    setPhase('gallery');
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <AnimatePresence mode="wait">

        {/* Loading spinner — shown while images preload */}
        {phase === 'loading' && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: '#000', zIndex: 50,
            }}
          >
            <motion.div
              animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'radial-gradient(circle, #fff 0%, #6ab0ff 60%, #1a56b0 100%)',
                boxShadow: '0 0 24px 8px rgba(100,180,255,0.6)',
                willChange: 'transform, opacity',
              }}
            />
            <div style={{
              marginTop: 20,
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem', letterSpacing: '0.3em',
              textTransform: 'uppercase', color: '#6ab0ff',
            }}>
              Preparing…
            </div>
          </motion.div>
        )}

        {/* Animation stage — pulling + exploding */}
        {(phase === 'pulling' || phase === 'exploding') && (
          <motion.div
            key="stage"
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            style={{
              position: 'fixed', inset: 0,
              background: 'radial-gradient(ellipse at center, #060a12 0%, #000 70%)',
              zIndex: 50,
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
                  transition={{ delay: 0.25, duration: 0.55 }}
                  style={{
                    position: 'absolute',
                    top: 'clamp(48px, 9vh, 88px)',
                    left: 0, right: 0,
                    textAlign: 'center',
                    zIndex: 20, pointerEvents: 'none',
                  }}
                >
                  <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#fff', margin: 0, lineHeight: 1,
                    textShadow: '0 0 50px rgba(100,180,255,0.35)',
                  }}>
                    Our Highlights
                  </h1>
                  <motion.p
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    style={{
                      marginTop: 10,
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.68rem', letterSpacing: '0.32em',
                      textTransform: 'uppercase', color: '#6ab0ff',
                    }}
                  >
                    Gravity is pulling everything together…
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thumbnails
                - Centred via top/left 50% + negative margin (so FM x/y offset from centre)
                - Only scale + translate + rotate — all composited, zero reflow            */}
            {thumbs.map((t) => (
              <motion.div
                key={t.id}
                initial={{ x: t.ox, y: t.oy, rotate: t.rot, scale: 1, opacity: 0.95 }}
                animate={
                  phase === 'pulling'
                    ? { x: 0, y: 0, rotate: 0, scale: 0.05, opacity: 0.9 }
                    : { x: 0, y: 0, rotate: 0, scale: 0,    opacity: 0   }
                }
                transition={{
                  duration: phase === 'pulling' ? (PULL_MS / 1000) - t.delay : 0.2,
                  delay: phase === 'pulling' ? t.delay : 0,
                  ease: [0.2, 0, 0.85, 1],
                }}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  marginTop:  -(t.size / 2),
                  marginLeft: -(t.size / 2),
                  width: t.size, height: t.size,
                  borderRadius: 4, overflow: 'hidden',
                  border: '1px solid rgba(100,180,255,0.55)',
                  boxShadow: '0 0 16px rgba(100,180,255,0.28)',
                  zIndex: 5,
                  willChange: 'transform, opacity',
                }}
              >
                <img
                  src={t.src} alt=""
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block',
                    filter: 'brightness(0.78) saturate(0.7)',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(20,60,140,0.2)', pointerEvents: 'none',
                }} />
              </motion.div>
            ))}

            <NeutronStar phase={phase} />
            {phase === 'exploding' && <Explosion />}

            {/* Skip */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              whileHover={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={skip}
              style={{
                position: 'absolute', bottom: 24, right: 20,
                padding: '7px 18px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2,
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.65rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: 'pointer', zIndex: 60,
              }}
            >
              Skip →
            </motion.button>
          </motion.div>
        )}

        {/* Gallery reveal */}
        {phase === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            <Gallery />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
