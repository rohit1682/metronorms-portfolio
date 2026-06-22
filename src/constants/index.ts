// ─────────────────────────────────────────────────────────────────────────────
// METRONORMS — Portfolio Content Constants
// Source: metronorms portfolio.pdf
// Theme: Experimental rock band portfolio — dark, bold, high-energy aesthetic
// ─────────────────────────────────────────────────────────────────────────────

export const BRAND = {
  name: "METRONORMS",
  instagram: "@metronorms_music",
  instagramHandle: "metronorms_music",
  tagline: "PORTFOLIO",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT US
// ─────────────────────────────────────────────────────────────────────────────

export const ABOUT = {
  heading: "ABOUT US",
  description: [
    "Metronorms is a 6-piece experimental rock band from Kolkata, India, known for bending genres and breaking musical conventions. What started as a group of friends jamming between classes quickly turned into something much bigger, built on a shared obsession with loud amps and a solid groove.",
    "We blend intricate rhythms, ambient soundscapes, and raw rock energy to deliver an immersive sonic journey. Over the last few years, we have cut our teeth on the competitive circuit, consistently proving we belong under the spotlight by placing in the top three across numerous inter-college fests and district competitions.",
    "From haunting melodies to high-octane breakdowns, our music reflects the chaos, curiosity, and consciousness of modern life.",
    "While the trophies are a great reminder of our hard work, for Metronorms, it has always been about the chemistry—bringing that disciplined, \"on-the-beat\" energy from the rehearsal room to a live crowd and turning every stage into a second home. Formed out of a mutual love for innovation and expression, our sound pulls from progressive rock, alternative, psychedelia, and Indian textures—resulting in something entirely our own.",
  ],
  genres: [
    "Progressive Rock",
    "Alternative",
    "Psychedelia",
    "Indian Textures",
  ],
  origin: "Kolkata, India",
  members: 5,
  type: "Experimental Rock Band",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// OUR EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────

export const EXPERIENCE = {
  heading: "OUR EXPERIENCE",
  summary:
    "Over the past two years, Metronorms has solidified our presence in the Kolkata live music scene, transforming from a group of friends into a disciplined, stage-ready act.",
  description: [
    "We have built our reputation by delivering high-impact performances across the city, including sets at Meghnad Saha Institute of Technology, Institute of Post Graduate Medical Education & Research and SSKM Hospital, Asutosh College, Future Institute of Engineering and Management, Techno India University, and Amity University.",
    "Beyond the college circuit, we have successfully expanded our footprint by playing private shows and securing competitive accolades, most notably finishing as the 2nd runner-up in \"Poila Parbon\" among the top 20 bands in Kolkata.",
    "These experiences have allowed us to consistently refine our live sound, ensuring that we bring professional precision to every performance. We take pride in our ability to adapt our high-octane energy to any setting, whether it's a bustling college fest or a social gathering.",
    "As we continue to evolve as a collective, our focus remains on pushing the boundaries of our performance and connecting deeply with our audience.",
    "We are currently active and available for bookings, ready to bring our unique, genre-bending sound and professional energy to your next event.",
  ],
  venues: [
    "Meghnad Saha Institute of Technology",
    "Institute of Post Graduate Medical Education & Research and SSKM Hospital",
    "Asutosh College",
    "Future Institute of Engineering and Management",
    "Techno India University",
    "Amity University",
  ],
  achievements: [
    {
      title: "2nd Runner-Up — \"Poila Parbon\"",
      detail: "Finished among the top 20 bands in Kolkata",
    },
    {
      title: "Top 3 — Multiple Inter-College Fests",
      detail: "Consistently placed in top three across numerous competitions",
    },
  ],
  bookingStatus: "Currently active and available for bookings",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// OUR ORIGINAL
// ─────────────────────────────────────────────────────────────────────────────

export const ORIGINAL = {
  heading: "OUR ORIGINAL",
  trackTitle: "Saddho Nei Amar",
  description: [
    "Marking a defining milestone in our journey, we have officially unveiled our debut original composition, \"Saddho Nei Amar.\"",
    "This release acts as a profound bridge between our origins in the high-energy college circuit and our emerging path as recording artists, perfectly encapsulating the experimental spirit that defines our sound.",
    "By blending intricate rhythms with evocative soundscapes, this track is the culmination of our shared creative vision and the dedicated hours we have spent refining our unique aesthetic in the rehearsal room.",
    "\"Saddho Nei Amar\" captures an immersive experience—both intimate and explosive—that represents the heart of our collaboration.",
    "It is now available to stream on all major music platforms, marking our boldest step yet in pushing the boundaries of our musical expression.",
  ],
  availability: "Available on all major music platforms",
  milestone: "Debut original composition",
  streamingLinks: {
    spotify: "https://open.spotify.com/track/4yst9KkO61zs0Ip1EFyTmE",
    amazonMusic: "https://music.amazon.in/albums/B0GY1MC4C1?trackAsin=B0GY1KX2TC",
    youtubeMusic: "https://music.youtube.com/watch?v=tP0-9Hp77gA",
    appleMusic: "https://music.apple.com/in/album/saddho-nei-amar/1895246054?i=6763282415",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// OUR FACES — Band Members
// ─────────────────────────────────────────────────────────────────────────────

export const MEMBERS = {
  heading: "OUR FACES",
  list: [
    {
      name: "SHESHTHO",
      displayName: "Shrestho Chakraborty",
      bio: "I am Shrestho Chakraborty, the voice behind Metronorms. My journey with music is driven by raw emotion, unapologetic energy, and a relentless passion for rock. Through every lyric and every performance, I aim to create an honest, high-voltage experience that resonates beyond the stage.",
    },
    {
      name: "JOYORSHI",
      displayName: "Joyorshi De",
      bio: "I am the guitarist of Metronorms, bringing energy, creativity, and emotion to the band's sound. Passionate about crafting memorable melodies and powerful riffs, I strive to blend technical skill with musical expression in every performance. Live shows are where I feel most alive — connecting with audiences and contributing to our unique musical journey.",
    },
    {
      name: "KOUSTAV",
      displayName: "Koustav Adhikari",
      bio: "I'm Koustav Adhikari — a passionate drummer who lives for powerful beats, high energy, and pure rock vibes. From driving rhythms to explosive stage moments, I bring groove and intensity to every performance and session. Music isn't just what I do — it's who I am.",
    },
    {
      name: "MANODEEP",
      displayName: "Manodeep Bose",
      bio: "I'm Manodeep, holding down both vocals and guitar for Metronorms. There's something powerful about channeling a song through both your voice and your instrument simultaneously. We have massive things coming your way — stay tuned.",
    },
    {
      name: "ARKADEEP",
      displayName: "Arkadeep Chakraborty",
      bio: "I'm Arkadeep, Lead Guitarist for Metronorms. We are laser-focused on the creative process and channeling high energy into our upcoming projects. Every riff is built with intention — stay tuned for our next wave of releases. Rock on.",
    },
    {
      name: "ANIKET",
      displayName: "Aniket Dutta",
      bio: "Aniket here from Metronorms. The bass is the foundation everything else is built on — the pulse that ties rhythm and melody together. We've been steadily building as a band and pushing our vision forward. Excited for what's ahead.",
    },
    {
      name: "ANISH",
      displayName: "Anish Murmu",
      bio: "Hi, I'm Anish, and I've been playing drums with the band for about eight months. For me it's all about bringing rhythm, dynamics, and creativity to our sound. I'm always eager to learn and improve, and I'm incredibly grateful to be making music with a group that shares the same passion.",
    },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// OUR HIGHLIGHTS
// ─────────────────────────────────────────────────────────────────────────────

export const HIGHLIGHTS = {
  heading: "OUR HIGHLIGHTS",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// OUR CONTACT
// ─────────────────────────────────────────────────────────────────────────────

export const CONTACT = {
  heading: "OUR CONTACT",
  instagram: "metronorms_music",
  bookingLabel: "For Bookings:",
  phones: [
    { number: "+91 79806 16997", label: "Primary" },
    { number: "+91 90736 41090", label: "Secondary" },
    { number: "+91 86977 13788", label: "Tertiary" },
  ],
  primaryContact: "Manodeep & Metronorms",
  bandName: "Metronorms",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CLOSING
// ─────────────────────────────────────────────────────────────────────────────

export const CLOSING = {
  message: "THANK YOU",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// BAND STORY — Cinematic journey narrative (used on /story page)
// ─────────────────────────────────────────────────────────────────────────────

export const STORY = {
  heading: "Our Story",
  subheading: "Every band has a beginning.",
  // Featured member on the story page — change name to any MEMBERS.list name
  featuredMember: "SHESHTHO",
  paragraphs: [
    "Every band has a beginning. Ours started in classrooms, corridors, and casual jam sessions between lectures.",
    "What began as a group of friends sharing a passion for music soon evolved into something much larger. Armed with loud amplifiers, endless curiosity, and a desire to create something unique, six musicians from Kolkata came together to form Metronorms—an experimental rock band built on the belief that music should never be confined by boundaries.",
    "From the very beginning, we were drawn to exploration. Instead of following familiar formulas, we embraced the unknown, blending progressive rock, alternative influences, psychedelia, ambient textures, and Indian musical elements into a sound that felt distinctly our own. Our songs became reflections of modern life—chaotic yet beautiful, intense yet introspective, disciplined yet unpredictable.",
    "As our sound evolved, so did our ambitions.",
    "The college festival circuit became our proving ground. Stage after stage, competition after competition, Metronorms earned recognition for delivering performances that were as technically precise as they were emotionally charged. Over the years, we consistently secured top-three finishes across numerous inter-college festivals and district-level competitions, gradually establishing ourselves as one of the emerging forces in Kolkata's live music scene.",
    "But trophies were never the destination.",
    "For us, every rehearsal was about building chemistry. Every performance was about creating a connection. We learned that the true reward of music lies in the moments when a crowd becomes part of the experience—when the energy flowing from the stage is returned tenfold by the audience.",
    "Over the past two years, that philosophy has carried us across some of Kolkata's most vibrant stages. Metronorms has performed at prestigious institutions including Meghnad Saha Institute of Technology, Institute of Post Graduate Medical Education & Research and SSKM Hospital, Asutosh College, Future Institute of Engineering and Management, Techno India University, and Amity University. Alongside these performances, we have expanded beyond the college circuit through private events, independent showcases, and competitive platforms.",
    "One of the defining highlights of our journey came when we secured the position of 2nd Runner-Up at \"Poila Parbon,\" competing among the Top 20 bands in Kolkata. The achievement reinforced what we had always believed—that dedication, originality, and relentless hard work could transform a group of friends into a serious musical force.",
    "As our confidence on stage grew, so did our desire to create something that would outlive a single performance.",
    "That desire led to a defining milestone in our journey: the release of our debut original composition, \"Saddho Nei Amar.\"",
    "More than just a song, it represents a bridge between our roots as a live-performing band and our evolution as recording artists. The track captures everything that defines Metronorms—intricate rhythms, immersive soundscapes, raw emotion, and an unwavering commitment to experimentation. It is the culmination of countless hours spent writing, rehearsing, refining, and discovering our collective voice.",
    "\"Saddho Nei Amar\" is an invitation into our world—a world where haunting melodies coexist with explosive breakdowns, where tradition meets innovation, and where every note serves a purpose. The song is now available across all major streaming platforms, marking our boldest step yet in sharing our music with a wider audience.",
    "Today, Metronorms stands as more than just a band.",
    "We are six musicians united by friendship, creativity, and a shared vision of pushing musical boundaries. Whether performing at a packed college festival, an intimate private gathering, or a large-scale public event, we bring the same commitment to excellence, professionalism, and unforgettable live energy.",
    "Our journey is still unfolding, and the next chapter is waiting to be written.",
    "Until then, we'll keep doing what we've always done—turning every stage into a second home and every performance into an experience worth remembering.",
  ],
  closing: "Metronorms",
  closingTagline: "Experimental Rock Band | Kolkata, India",
  bookingNote: "Currently active and available for live performances, collaborations, festivals, corporate events, and private bookings.",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION — Section labels matching PDF structure
// ─────────────────────────────────────────────────────────────────────────────

export const NAV_SECTIONS = [
  { id: "about", label: "About Us" },
  { id: "experience", label: "Our Experience" },
  { id: "original", label: "Our Original" },
  { id: "members", label: "Our Faces" },
  { id: "highlights", label: "Our Highlights" },
  { id: "contact", label: "Our Contact" },
] as const;

// Navigation routes for the multi-page app (Experience & Contact live on Home)
export const NAV_ROUTES = [
  { path: "/", label: "Home", id: "home" },
  { path: "/story", label: "Our Story", id: "story" },
  { path: "/members", label: "Our Faces", id: "members" },
  { path: "/highlights", label: "Highlights", id: "highlights" },
] as const;
