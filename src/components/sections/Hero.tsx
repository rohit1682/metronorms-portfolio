import { motion } from 'framer-motion';
import AnimatedText from '../ui/AnimatedText';
import { BRAND, CONTACT } from '../../constants';
import { HERO_BG, GROUP_PHOTOS } from '../../constants/images';
import { HERO_UI } from '../../constants/ui';

export default function Hero() {
  const bgImage = HERO_BG || GROUP_PHOTOS[0];

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      {bgImage && (
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            zIndex: 0,
          }}
        />
      )}

      {/* Uniform dark base layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(10,10,10,0.35)',
        zIndex: 1,
      }} />

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.70) 40%, rgba(10,10,10,0.92) 80%, #0a0a0a 100%)',
        zIndex: 1,
      }} />

      {/* Red vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(139,0,0,0.25) 100%)',
        zIndex: 2,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: '900px',
        width: '100%',
      }}>
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--crimson)',
            marginBottom: '24px',
          }}
        >
          {BRAND.instagram}
        </motion.div>

        {/* Band name — letter stagger */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 16vw, 10rem)',
          letterSpacing: '0.05em',
          lineHeight: 0.9,
          color: 'var(--white)',
          marginBottom: '0',
          textTransform: 'uppercase',
          display: 'block',
        }}>
          <AnimatedText text={BRAND.name} delay={0.5} staggerDelay={0.06} />
        </h1>

        {/* Red divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.6, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: '80px',
            height: '3px',
            background: 'linear-gradient(90deg, var(--dark-red), var(--crimson))',
            margin: '28px auto',
            borderRadius: '2px',
            transformOrigin: 'left',
          }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-italic)',
            fontStyle: 'italic',
            fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
            color: 'var(--white-dim)',
            letterSpacing: '0.08em',
            marginBottom: '40px',
          }}
        >
          {HERO_UI.tagline}
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          onClick={scrollToAbout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '14px 40px',
            background: 'transparent',
            border: '1px solid var(--crimson)',
            color: 'var(--white)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(196,30,58,0.2)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(196,30,58,0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          {HERO_UI.ctaLabel}
        </motion.button>

        {/* Booking CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 0.8 }}
          style={{
            marginTop: '20px',
            fontSize: '0.75rem',
            color: 'var(--white-muted)',
            letterSpacing: '0.1em',
          }}
        >
          {CONTACT.bookingLabel} {CONTACT.phones[0].number}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
        onClick={scrollToAbout}
      >
        <span style={{
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--white-muted)',
        }}>
          {HERO_UI.scrollLabel}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(180deg, var(--crimson), transparent)',
            borderRadius: '1px',
          }}
        />
      </motion.div>
    </section>
  );
}
