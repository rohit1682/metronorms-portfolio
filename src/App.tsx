import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

import Sidebar from './components/layout/Sidebar';
import LogoSplash from './components/layout/LogoSplash';
import AudioPlayer from './components/layout/AudioPlayer';
import ScrollProgressBar from './components/ui/ScrollProgressBar';
import BookingCTA from './components/ui/BookingCTA';
import ScrollToTop from './components/ui/ScrollToTop';

// Background-music feature is temporarily disabled; flip to re-enable.
const FEATURE_AUDIO_PLAYER = false;

// Pages
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import MembersPage from './pages/MembersPage';
import HighlightsPage from './pages/HighlightsPage';

// Page transition wrapper
function PageWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/story" element={<PageWrapper><StoryPage /></PageWrapper>} />
        <Route path="/members" element={<PageWrapper><MembersPage /></PageWrapper>} />
        <Route path="/highlights" element={<PageWrapper><HighlightsPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function AppShell() {
  const [splashDone, setSplashDone] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!splashDone && <LogoSplash onComplete={() => setSplashDone(true)} />}
      </AnimatePresence>

      {splashDone && FEATURE_AUDIO_PLAYER && <AudioPlayer />}
      {splashDone && <ScrollProgressBar />}
      {splashDone && <BookingCTA />}
      {splashDone && <ScrollToTop />}

      <motion.div
        className="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <Sidebar onToggle={setSidebarOpen} />
        {/*
          Mount routes only after splash completes so Hero's AnimatedText
          fires from t=0 post-splash instead of during the hidden splash period.
        */}
        {splashDone && (
          <main
            className={`main-content${sidebarOpen ? ' sidebar-open' : ''}`}
            style={{ width: '100%' }}
          >
            <AnimatedRoutes />
          </main>
        )}
      </motion.div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
