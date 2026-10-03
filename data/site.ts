/**
 * Every word on the site lives here. Nothing outside this file is content.
 *
 * Rule for this file: only facts Pema has published (LinkedIn / the current
 * live site). Missing facts stay missing — optional fields are simply omitted
 * and the UI hides whatever isn't there.
 */

export const site = {
  url: "https://www.pemaghising.com.np",
  name: "Pema Ghising",
  role: "Graphic & Motion Designer",
  years: "7+",
  tagline: "Design that moves.",
  statement:
    "I turn ideas into visual systems, stories, and experiences that communicate clearly and move people.",
  description:
    "Pema Ghising is a graphic and motion designer with 7+ years of experience, leading visual communication at Leapfrog Technology across graphic, motion, brand and digital work.",
};

export const contact = {
  email: "pema.ghising133@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pema-ghising-91a966103/" },
    { label: "Instagram", href: "https://www.instagram.com/pema_ghising/" },
    // Add Behance here once the profile exists.
  ],
  invite: "Have an idea, project, collaboration, or simply want to say hello?",
};

export const about = {
  lead: "Pema Ghising is a graphic and motion designer in the business of making ideas visible.",
  body: "Pema works where structure meets experimentation — taking complex ideas and turning them into visual systems that are clear, engaging, and memorable.",
  disciplines: [
    {
      name: "Graphic Design",
      text: "Visual communication, campaigns, presentations, editorial layouts, and everything in between.",
    },
    {
      name: "Motion Design",
      text: "Bringing ideas to life through movement, timing, transitions, and visual storytelling.",
    },
    {
      name: "Brand Identity",
      text: "Building visual languages that make brands recognizable, consistent, and memorable.",
    },
    {
      name: "Visual Systems",
      text: "Creating flexible design systems that bring consistency across different formats and experiences.",
    },
  ],
};

export const philosophy = {
  line: "Clarity over decoration.",
  note: "Good design doesn't need to shout to be noticed.",
};

export type Role = {
  company: string;
  title: string;
  start: number;
  end?: number; // omit for "Present"
  disciplines: string[];
  text: string;
};

/** Newest first. Add earlier roles here — the timeline ruler extends itself. */
export const experience: Role[] = [
  {
    company: "Leapfrog Technology",
    title: "Lead Graphic Designer",
    start: 2021,
    disciplines: ["Graphic", "Motion", "Brand", "Digital"],
    text: "Leading visual communication at Leapfrog Technology — setting direction, keeping a consistent design language across teams, and turning strategy into things people actually see.",
  },
];

/** Derived word-for-word from the role description above, plus mentoring. */
export const practice = [
  { verb: "Mentor", text: "Mentoring designers." },
  { verb: "Lead", text: "Setting direction for visual communication." },
  { verb: "Collaborate", text: "Keeping a consistent design language across teams." },
  { verb: "Build", text: "Turning strategy into things people actually see." },
];

export type Media = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  title: string;
  /** Leave unset until known. Each one only renders when present. */
  category?: string;
  year?: string;
  summary?: string;
  /** The hero visual. Without it, the site shows an honest typographic plate. */
  cover?: Media;
  /** Optional second frame revealed on hover. */
  hoverFrame?: Media;
  /** Composition used once a cover exists. */
  layout?: "feature" | "wide" | "portrait" | "full";
  /** Case-study body. Without sections, the page says the study is in preparation. */
  sections?: { heading: string; body: string; media?: Media }[];
  /** Sends the index row to an existing standalone page instead of /work/[slug]. */
  href?: string;
};

/**
 * Project names are real; everything else is still to come.
 * To publish a case study: add category / year / summary / cover / sections.
 * Images go in /public/work/<slug>/.
 */
export const projects: Project[] = [
  { slug: "addy", title: "Addy" },
  { slug: "secondlook-health", title: "SecondLook Health" },
  { slug: "leapfrog-docweaver", title: "Leapfrog DocWeaver" },
  { slug: "signetic-ebs", title: "Signetic / EBS" },
  { slug: "spkr", title: "SPKR" },
  { slug: "adhyayan-preschool", title: "Adhyayan Preschool" },
  { slug: "lspp", title: "LSPP" },
  { slug: "frogtoberfest", title: "Frogtoberfest" },
  { slug: "roomie", title: "Roomie", href: "/roomie" },
];

export const otherWork = [
  "Marketing & campaign work",
  "Motion design projects",
  "Internal Leapfrog initiatives",
];

export type Reel = {
  title: string;
  /** Muted, looping, H.264 MP4 (and optionally WebM). Put files in /public/motion/. */
  src: string;
  poster: string;
  year?: string;
};

/** Empty until real reels exist. The Motion section adapts automatically. */
export const reels: Reel[] = [];

export type Experiment = { title: string; medium: string; media?: Media; video?: string };

/** Empty until real experiments are published. */
export const experiments: Experiment[] = [];

export const designTech =
  "I'm interested in the space between design and technology. I'm curious about how emerging tools are changing the way designers think, create, and communicate. I'm interested in AI, interaction, motion, and digital products — not because technology is exciting on its own, but because it gives us new ways to express ideas.";

export const currently = [
  { label: "Designing", text: "Brand systems, motion pieces, and the connective tissue between them." },
  {
    label: "Exploring",
    text: "Motion in Figma, interactive design, AI-assisted creative workflows, new ways of building for the web.",
  },
  {
    label: "Learning",
    text: "Product thinking, UX, creative technology, how design can solve problems beyond aesthetics.",
  },
  {
    label: "Experimenting",
    text: "Typography, motion studies, visual systems, generative ideas, things that don't need a brief.",
  },
];

export const tools = {
  list: [
    "Figma",
    "After Effects",
    "Premiere Pro",
    "Illustrator",
    "Photoshop",
    "Google Slides",
    "Frame.io",
    "AI tools",
  ],
  lines: ["Tools are just tools.", "The tools change.", "The fundamentals don't."],
};

export const beyond = [
  { label: "Music", text: "Piano, flute" },
  { label: "Movement", text: "Dance, Muay Thai, calisthenics" },
  { label: "Play", text: "Gaming, badminton, cycling" },
  { label: "Watch & read", text: "Films, K-drama, novels" },
];

export const lookingForward = {
  text: "I'm interested in projects where the brief still has room to move — collaborators who'd rather explore three directions than lock in the first one.",
  open: ["Collaborations", "Creative projects", "Design opportunities", "Experiments"],
};

/** Sections that exist on the page. Add Experiments back once there are experiments to show. */
export const nav = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

/** Pema's name in katakana, used on labels as on Japanese tape packaging. */
export const kana = "ペマ・ギシン";

export type Soundtrack = { src: string; title: string };

/**
 * Hero music: starts when the tape goes into the player (licensed by Pema).
 * Set to undefined to turn the music and the sound button off.
 */
export const soundtrack: Soundtrack | undefined = { src: "/audio/koibito-e.mp3", title: "恋人へ" };
