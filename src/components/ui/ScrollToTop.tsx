import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** Floating "back to top" button — appears after 400 px of scroll, fixed bottom-left. */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    // Set initial state in case page already scrolled on mount
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
            bottom:         '24px',
            left:           '20px',
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
