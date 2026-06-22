import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Floating "back to top" button.
 *
 * Positioning logic:
 *  - Desktop (≥ 1024 px): sidebar is 64 px wide (collapsed), so the button sits
 *    just to the right of it — left: calc(64px + 16px) — and higher up so it
 *    never overlaps the Instagram handle text at the sidebar's bottom.
 *  - Mobile  (<  1024 px): no permanent sidebar; button sits at bottom-left (20 px).
 *  - Appears only after the user scrolls 400 px down.
 */
export default function ScrollToTop() {
  const [visible,  setVisible]  = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          whileHover={{ scale: 1.12, borderColor: 'rgba(196,30,58,0.8)' }}
          whileTap={{ scale: 0.92 }}
          onClick={handleClick}
          title="Back to top"
          aria-label="Scroll to top"
          transition={{ duration: 0.25 }}
          style={{
            position:       'fixed',
            // Desktop: clear the 64 px sidebar + a 16 px gap
            // Mobile:  simple 20 px from left edge
            left:           isMobile ? '20px' : 'calc(var(--sidebar-collapsed) + 16px)',
            // Lift the button above the sidebar's bottom Instagram text (~56 px tall)
            bottom:         isMobile ? '24px' : '88px',
            width:          '44px',
            height:         '44px',
            borderRadius:   '50%',
            background:     'rgba(10,10,10,0.88)',
            border:         '1px solid rgba(196,30,58,0.45)',
            color:          'var(--white)',
            fontSize:       '18px',
            lineHeight:     1,
            cursor:         'pointer',
            backdropFilter: 'blur(10px)',
            zIndex:         400,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            boxShadow:      '0 4px 16px rgba(0,0,0,0.5)',
            transition:     'border-color 0.2s ease',
          }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
