import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactElement } from 'react';
import {
  RiHome5Line,
  RiBookOpenLine,
  RiGroupLine,
  RiGalleryLine,
} from 'react-icons/ri';
import { NAV_ROUTES, BRAND } from '../../constants';
import logo from '../../assets/logo/logo.jpeg';

interface SidebarProps {
  onToggle?: (open: boolean) => void;
}

const ROUTE_ICONS: Record<string, ReactElement> = {
  '/':           <RiHome5Line size={20} />,
  '/story':      <RiBookOpenLine size={20} />,
  '/members':    <RiGroupLine size={20} />,
  '/highlights': <RiGalleryLine size={20} />,
};

export default function Sidebar({ onToggle }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const toggleOpen = (value: boolean) => {
    setIsOpen(value);
    onToggle?.(value);
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isMobile) toggleOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isMobile]);

  // ── Desktop Sidebar ──────────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <motion.aside
        animate={{ width: isDesktopExpanded ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)' }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={() => setIsDesktopExpanded(true)}
        onMouseLeave={() => setIsDesktopExpanded(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
          borderRight: '1px solid rgba(139,0,0,0.3)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Logo area */}
        <div style={{
          padding: '20px 12px',
          borderBottom: '1px solid rgba(139,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minHeight: '68px',
        }}>
          <img
            src={logo}
            alt={BRAND.name}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              border: '1px solid rgba(139,0,0,0.5)',
            }}
          />
          <AnimatePresence>
            {isDesktopExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  letterSpacing: '0.12em',
                  color: 'var(--white)',
                  whiteSpace: 'nowrap',
                }}
              >
                {BRAND.name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {NAV_ROUTES.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              end={route.path === '/'}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              {({ isActive }) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '13px 16px',
                    position: 'relative',
                    background: isActive ? 'rgba(139,0,0,0.15)' : 'transparent',
                    color: isActive ? 'var(--white)' : 'var(--white-muted)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--white-dim)';
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(139,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--white-muted)';
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-active-bar"
                      style={{
                        position: 'absolute',
                        left: 0, top: 0, bottom: 0,
                        width: '3px',
                        background: 'linear-gradient(180deg, var(--dark-red), var(--crimson))',
                        borderRadius: '0 2px 2px 0',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <span style={{
                    flexShrink: 0,
                    width: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? 'var(--crimson)' : 'inherit',
                  }}>
                    {ROUTE_ICONS[route.path]}
                  </span>

                  {/* Label */}
                  <AnimatePresence>
                    {isDesktopExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.78rem',
                          fontWeight: 500,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {route.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Instagram bottom */}
        <AnimatePresence>
          {isDesktopExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '14px 16px',
                borderTop: '1px solid rgba(139,0,0,0.2)',
                fontSize: '0.68rem',
                color: 'var(--white-muted)',
                letterSpacing: '0.05em',
              }}
            >
              {BRAND.instagram}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    );
  }

  // ── Mobile Sidebar ────────────────────────────────────────────────────────
  return (
    <>
      {/* Hamburger */}
      <motion.button
        onClick={() => toggleOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 200,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: isOpen ? 'rgba(196,30,58,0.9)' : 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(139,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          cursor: 'pointer',
        }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'block', width: '18px', height: '2px', background: 'white', borderRadius: '1px', transformOrigin: 'center' }}
        />
        <motion.span
          animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'block', width: '18px', height: '2px', background: 'white', borderRadius: '1px' }}
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'block', width: '18px', height: '2px', background: 'white', borderRadius: '1px', transformOrigin: 'center' }}
        />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 150,
            }}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            style={{
              position: 'fixed',
              top: 0, right: 0, bottom: 0,
              width: 'min(80vw, 300px)',
              background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
              borderLeft: '1px solid rgba(139,0,0,0.4)',
              zIndex: 160,
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '80px',
            }}
          >
            {/* Band name */}
            <div style={{ padding: '0 24px 20px', borderBottom: '1px solid rgba(139,0,0,0.2)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.1em', color: 'var(--white)' }}>
                {BRAND.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--white-muted)', letterSpacing: '0.05em', marginTop: '4px' }}>
                {BRAND.instagram}
              </div>
            </div>

            {/* Nav items */}
            <motion.ul
              style={{ flex: 1, padding: '12px 0', listStyle: 'none' }}
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
            >
              {NAV_ROUTES.map((route) => (
                <motion.li
                  key={route.path}
                  variants={{
                    hidden: { opacity: 0, x: 30 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
                  }}
                >
                  <NavLink to={route.path} end={route.path === '/'} style={{ textDecoration: 'none', display: 'block' }}>
                    {({ isActive }) => (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '15px 24px',
                        background: isActive ? 'rgba(139,0,0,0.15)' : 'transparent',
                        color: isActive ? 'var(--white)' : 'var(--white-muted)',
                        position: 'relative',
                      }}>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-active-bar"
                            style={{
                              position: 'absolute', left: 0, top: 0, bottom: 0,
                              width: '3px',
                              background: 'linear-gradient(180deg, var(--dark-red), var(--crimson))',
                              borderRadius: '0 2px 2px 0',
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <span style={{ color: isActive ? 'var(--crimson)' : 'inherit', display: 'flex' }}>
                          {ROUTE_ICONS[route.path]}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.88rem',
                          fontWeight: 500,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}>
                          {route.label}
                        </span>
                      </div>
                    )}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>

            <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--dark-red), var(--crimson), transparent)' }} />
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
