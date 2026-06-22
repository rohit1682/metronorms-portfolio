// ─────────────────────────────────────────────────────────────────────────────
// UI TEXT CONSTANTS
// All display strings used across components — edit here to update the site
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_UI = {
  tagline: 'Experimental Rock · Kolkata, India',
  ctaLabel: 'Explore Our World',
  scrollLabel: 'Scroll to discover',
} as const;

export const ABOUT_UI = {
  sectionNumber: '01',
  displayHeading: 'Who We Are',
} as const;

export const EXPERIENCE_UI = {
  sectionNumber: '02',
  displayHeading: 'Our Journey',
} as const;

export const MEMBERS_UI = {
  sectionNumber: '03',
  displayHeading: 'The Band',
  subheading: 'Five instruments. One chemistry. Endless possibilities.',
  swipeHint: 'Swipe to explore',
  // Member roles — key must match MEMBERS.list[].name exactly
  roles: {
    SHESHTHO: 'Vocalist',
    JOYORSHI: 'Guitarist',
    KOUSTAV:  'Drummer',
    MANODEEP: 'Vocals & Guitar',
    ARKADEEP: 'Lead Guitarist',
    ANIKET:   'Bassist',
    ANISH:    'Drummer',
  } as Record<string, string>,
  fallbackRole: 'Band Member',
} as const;

export const GALLERY_UI = {
  sectionNumber: '04',
  displayHeading: 'Our Highlights',
  subheading: 'Moments captured from stages across Kolkata.',
  emptyMessage: 'No photos in this category yet.',
} as const;

export const CONTACT_UI = {
  sectionNumber: '05',
  displayHeading: 'Book Us',
  subheading: "Ready to bring Metronorms to your stage? Reach out and let's make it happen.",
} as const;

// Sidebar icon IDs — these match react-icons names used in Sidebar.tsx
// Route path → icon key
export const SIDEBAR_ICON_KEYS: Record<string, string> = {
  home: 'home',
  story: 'story',
  members: 'members',
  highlights: 'highlights',
  experience: 'experience',
  contact: 'contact',
};

// Keep for backward compat
export const SIDEBAR_ICONS: Record<string, string> = SIDEBAR_ICON_KEYS;
