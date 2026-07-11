// 100 unique holographic characters. Each entry drives:
// - `motion`: one of the shared CSS keyframe families in index.css
// - `hue`: HSL rotation seed (0–360) → holographic gradient tint
// - `props`: emoji/icon rendered as a floating premium prop
// - `decor`: emoji arrangement for the pedestal/ambience
// - `duration`: base animation loop in seconds
// Kept as plain data so the grid stays cheap; the character SVG is a
// single reusable component parameterized from these fields.

export type HologramActivity = {
  id: number;
  slug: string;
  name: string;
  motion:
    | "run"
    | "swim"
    | "kick"
    | "skate"
    | "roll"
    | "jump"
    | "spin"
    | "punch"
    | "wave"
    | "dance"
    | "meditate"
    | "lift"
    | "throw"
    | "climb"
    | "surf"
    | "ride"
    | "flow"
    | "cast";
  hue: number;
  prop: string;
  decor: string;
  duration: number;
};

const RAW: Array<[string, HologramActivity["motion"], string, string]> = [
  ["Natation", "swim", "🌊", "💧✨🐚"],
  ["Football", "kick", "⚽", "🥅🌿"],
  ["Roller", "roll", "🛼", "🛤️✨"],
  ["Skate", "skate", "🛹", "🎯🔥"],
  ["Basketball", "jump", "🏀", "🏆🎯"],
  ["Tennis", "punch", "🎾", "🌐✨"],
  ["Boxe", "punch", "🥊", "🔴🔥"],
  ["Yoga", "meditate", "🧘", "🕯️🌸"],
  ["Danse", "dance", "💫", "🎶✨"],
  ["Course", "run", "💨", "🏁⚡"],
  ["Karaté", "kick", "🥋", "🎋🌙"],
  ["Surf", "surf", "🏄", "🌊🐚"],
  ["Vélo", "ride", "🚴", "🌲🚵"],
  ["Escalade", "climb", "🧗", "⛰️❄️"],
  ["Gymnastique", "spin", "🤸", "🏵️✨"],
  ["Ski", "surf", "⛷️", "🏔️❄️"],
  ["Snowboard", "surf", "🏂", "🌨️❄️"],
  ["Kayak", "flow", "🛶", "🌊🪨"],
  ["Bowling", "throw", "🎳", "🎯💠"],
  ["Golf", "throw", "⛳", "🌿🚩"],
  ["Baseball", "throw", "⚾", "🥎🏟️"],
  ["Cricket", "throw", "🏏", "🌿🎯"],
  ["Hockey", "kick", "🏑", "🥅❄️"],
  ["Volleyball", "jump", "🏐", "🏖️🌴"],
  ["Rugby", "run", "🏉", "🥅🌿"],
  ["Breakdance", "spin", "🎧", "💿✨"],
  ["Ballet", "spin", "🩰", "🌸✨"],
  ["Disco", "dance", "🕺", "💿🌈"],
  ["Méditation", "meditate", "🕉️", "🕯️🌌"],
  ["Haltérophilie", "lift", "🏋️", "🏆💪"],
  ["Parkour", "jump", "🏙️", "🧱⚡"],
  ["BMX", "ride", "🚲", "🎯🔥"],
  ["Kite-surf", "surf", "🪁", "🌊💨"],
  ["Voile", "flow", "⛵", "🌊🌅"],
  ["Pêche", "cast", "🎣", "🐟🌊"],
  ["Magicien", "cast", "🪄", "✨🔮"],
  ["Jongleur", "throw", "🎪", "🎭✨"],
  ["Acrobate", "spin", "🎭", "🎪🎯"],
  ["Escrime", "punch", "🤺", "⚔️🌟"],
  ["Lutte", "punch", "🤼", "🏆🔥"],
  ["Judo", "throw", "🥋", "🎋🌙"],
  ["Kung-fu", "kick", "🐉", "🏯🎋"],
  ["Tai-chi", "flow", "☯️", "🌿🎐"],
  ["Capoeira", "spin", "🥁", "🌴🎶"],
  ["Salsa", "dance", "💃", "🌶️🎵"],
  ["Tango", "dance", "🌹", "🎭🌙"],
  ["Hip-hop", "dance", "🎤", "🎧🔥"],
  ["Rock", "dance", "🎸", "🔥⚡"],
  ["Jazz", "flow", "🎷", "🎼🌙"],
  ["Opéra", "cast", "🎭", "🌹🎼"],
  ["Batterie", "punch", "🥁", "🎶🔥"],
  ["Piano", "wave", "🎹", "🎼✨"],
  ["Violon", "wave", "🎻", "🌹🎼"],
  ["Saxophone", "wave", "🎷", "🌆🌙"],
  ["Trompette", "wave", "🎺", "🎼✨"],
  ["Flûte", "wave", "🪈", "🌿🎐"],
  ["Harpe", "flow", "🎼", "🌸✨"],
  ["DJ", "dance", "🎧", "🎛️🌈"],
  ["Chant", "wave", "🎤", "🎵✨"],
  ["Rap", "wave", "🎙️", "🔥🎧"],
  ["Lecture", "meditate", "📖", "☕📚"],
  ["Écriture", "wave", "✍️", "🖋️📜"],
  ["Astronaute", "flow", "🚀", "🪐🌌"],
  ["Ninja", "kick", "🥷", "🌙🗡️"],
  ["Samouraï", "punch", "⚔️", "🏯🌸"],
  ["Archer", "throw", "🏹", "🎯🌲"],
  ["Sprinter", "run", "🏃", "🏁⚡"],
  ["Haies", "jump", "🚧", "🏁⚡"],
  ["Javelot", "throw", "🎯", "🌿🏆"],
  ["Disque", "spin", "💿", "🏆✨"],
  ["Poids", "throw", "🪨", "🏆🌿"],
  ["Perche", "jump", "🥇", "🏆🌿"],
  ["Saut hauteur", "jump", "🔝", "🏆✨"],
  ["Saut long", "jump", "📏", "🏆⚡"],
  ["Chef", "cast", "🍳", "🍲🌿"],
  ["Peintre", "wave", "🎨", "🖌️🌈"],
  ["Sculpteur", "punch", "🗿", "🪵🌿"],
  ["Photographe", "cast", "📷", "🌇✨"],
  ["Vidéaste", "cast", "🎥", "🎬✨"],
  ["Coder", "wave", "💻", "🌐⚡"],
  ["Gamer", "wave", "🎮", "🕹️🌈"],
  ["Salueur", "wave", "🙋", "🌟✨"],
  ["Applaudir", "wave", "👏", "🎉✨"],
  ["Marathon", "run", "🏅", "🏁🌿"],
  ["Triathlon", "swim", "🥇", "🌊🚴"],
  ["Aviron", "flow", "🚣", "🌊🌅"],
  ["Wakeboard", "surf", "🛥️", "🌊💦"],
  ["Trampoline", "jump", "🤾", "✨🎯"],
  ["Cheval", "ride", "🐎", "🌾🏇"],
  ["Motocross", "ride", "🏍️", "🔥🎯"],
  ["Karting", "ride", "🏎️", "🏁🔥"],
  ["Patinage", "spin", "⛸️", "❄️✨"],
  ["Aïkido", "flow", "🥋", "🎋🌙"],
  ["Sumo", "punch", "🤼", "🏯🌸"],
  ["Fléchette", "throw", "🎯", "🍻✨"],
  ["Billard", "throw", "🎱", "💠✨"],
  ["Frisbee", "throw", "🥏", "🌿✨"],
  ["Cerf-volant", "flow", "🪁", "☁️🌈"],
  ["Parapente", "flow", "🪂", "⛰️☁️"],
  ["Plongée", "swim", "🤿", "🐠🌊"],
  ["Water-polo", "swim", "🤽", "🌊🥅"],
  ["Squash", "punch", "🎾", "🧱✨"],
  ["Padel", "punch", "🏓", "🌐🎯"],
  ["Ping-pong", "punch", "🏓", "🔴✨"],
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Deterministic golden-angle hue distribution → visually distinct neighbours
export const HOLOGRAM_ACTIVITIES: HologramActivity[] = RAW.map(([name, motion, prop, decor], i) => ({
  id: i + 1,
  slug: slugify(name),
  name,
  motion,
  hue: Math.round((i * 137.508) % 360),
  prop,
  decor,
  duration: 1.8 + ((i * 13) % 22) / 10, // 1.8s → 4s pseudo-random
}));

// Sanity: we want exactly 100.
if (HOLOGRAM_ACTIVITIES.length !== 100) {
  // eslint-disable-next-line no-console
  console.warn(`[hologrammes] expected 100 activities, got ${HOLOGRAM_ACTIVITIES.length}`);
}