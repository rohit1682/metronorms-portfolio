// ─────────────────────────────────────────────────────────────────────────────
// IMAGE CONSTANTS
// All images sourced from src/assets/gellery/
// HEIC and mp4 files are excluded (no browser support)
// To add/remove images: update the arrays below — no component changes needed
// ─────────────────────────────────────────────────────────────────────────────

// Vite glob imports — eagerly loaded for simplicity
// Each glob returns a module map: { 'path': { default: url } }

const groupRaw = import.meta.glob<{ default: string }>(
  '../assets/gellery/Group/*.{jpg,jpeg,png,webp}',
  { eager: true }
);
const shresthoRaw = import.meta.glob<{ default: string }>(
  '../assets/gellery/Shrestho Chakraborty/*.{jpg,jpeg,png,webp}',
  { eager: true }
);
const joyorshiRaw = import.meta.glob<{ default: string }>(
  '../assets/gellery/Joyorshi De/*.{jpg,jpeg,png,webp}',
  { eager: true }
);
const koustavRaw = import.meta.glob<{ default: string }>(
  '../assets/gellery/Koustav Adhikari/*.{jpg,jpeg,png,webp}',
  { eager: true }
);
const manodeepRaw = import.meta.glob<{ default: string }>(
  '../assets/gellery/Manodeep Bose/*.{jpg,jpeg,png,webp}',
  { eager: true }
);
const arkadeepRaw = import.meta.glob<{ default: string }>(
  '../assets/gellery/Arkadeep Chakraborty/*.{jpg,jpeg,png,webp}',
  { eager: true }
);
const aniketRaw = import.meta.glob<{ default: string }>(
  '../assets/gellery/Aniket Dutta/*.{jpg,jpeg,png,webp}',
  { eager: true }
);
const anishRaw = import.meta.glob<{ default: string }>(
  '../assets/gellery/Anish Murmu/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

// OC folder — cover art / promo shot used on the Saddho Nei Amar card
const ocRaw = import.meta.glob<{ default: string }>(
  '../assets/OC/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

const toUrls = (raw: Record<string, { default: string }>): string[] =>
  Object.values(raw).map((m) => m.default);

// ─────────────────────────────────────────────────────────────────────────────
// GROUPED EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const GROUP_PHOTOS: string[] = toUrls(groupRaw);

export const MEMBER_PHOTOS: Record<string, string[]> = {
  SHESHTHO: toUrls(shresthoRaw),
  JOYORSHI: toUrls(joyorshiRaw),
  KOUSTAV: toUrls(koustavRaw),
  MANODEEP: toUrls(manodeepRaw),
  ARKADEEP: toUrls(arkadeepRaw),
  ANIKET: toUrls(aniketRaw),
  ANISH: toUrls(anishRaw),
};

// ── Per-context member photos — each surface uses a different index ───────────

/** MemberStrip on home page → first available photo */
export const MEMBER_HERO_PHOTO: Record<string, string> = Object.fromEntries(
  Object.entries(MEMBER_PHOTOS).map(([name, photos]) => [name, photos[0] ?? ''])
);

/** MembersPage (/members) → second photo when available, otherwise first */
export const MEMBER_CARD_PHOTO: Record<string, string> = Object.fromEntries(
  Object.entries(MEMBER_PHOTOS).map(([name, photos]) => [
    name,
    photos[1] ?? photos[0] ?? '',
  ])
);

/** StoryPage featured-member panel → third photo when available, fallback chain */
export const MEMBER_STORY_PHOTO: Record<string, string> = Object.fromEntries(
  Object.entries(MEMBER_PHOTOS).map(([name, photos]) => [
    name,
    photos[2] ?? photos[1] ?? photos[0] ?? '',
  ])
);

// All photos flat (used in Gallery — Group photos first, then per-member)
export const ALL_PHOTOS: { src: string; category: string }[] = [
  ...GROUP_PHOTOS.map((src) => ({ src, category: 'Group' })),
  ...Object.entries(MEMBER_PHOTOS).flatMap(([name, photos]) =>
    photos.map((src) => ({ src, category: name }))
  ),
];

// Hero background — 3rd group photo (index 2)
export const HERO_BG: string = GROUP_PHOTOS[9] ?? GROUP_PHOTOS[0] ?? '';

// About section photo — second group photo (or fallback to first)
export const ABOUT_PHOTO: string = GROUP_PHOTOS[1] ?? GROUP_PHOTOS[0] ?? '';

// Experience section photo — third group photo
export const EXPERIENCE_PHOTO: string = GROUP_PHOTOS[2] ?? GROUP_PHOTOS[0] ?? '';

// Cover art / promo image for the Saddho Nei Amar feature card
export const ORIGINAL_PHOTO: string = toUrls(ocRaw)[0] ?? '';

// Gallery filter categories (matches ALL_PHOTOS category values)
export const GALLERY_CATEGORIES: string[] = [
  'All',
  'Group',
  'SHESHTHO',
  'JOYORSHI',
  'KOUSTAV',
  'MANODEEP',
  'ARKADEEP',
  'ANIKET',
  'ANISH',
];
