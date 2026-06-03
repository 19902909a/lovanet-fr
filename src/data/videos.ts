export type Video = {
  id: string;
  title: string;
  series: string;
  channel?: string;
  episode?: string;
  date?: string;
  recent?: boolean;
};

export const videos: Video[] = [
  { id: "ju3WKcwVHl0", title: "Mama's make you the prettiest girl in the world 😂", series: "Otaku ni Yasashii Gal wa Inai!?", channel: "AnimeOfficial", episode: "Ep. 08", date: "2026-06-01", recent: true },
  { id: "C5g8btiuyAI", title: "You're Lucky I'm Such A Sweet 😘", series: "Kuranika", channel: "AnimeOfficial", episode: "Ep. 05", date: "2026-05-30", recent: true },
  { id: "5-IWbKIUxPE", title: "I Mean, I'm Slow, And I'm Not Good At Anything 😂", series: "Mahou Shoujo Madoka Magica", channel: "AnimeOfficial", episode: "Ep. 12", date: "2026-05-28", recent: true },
  { id: "bGFUthZjGd4", title: "So It's Something Else 😂", series: "Ruri no Houseki", channel: "AnimeOfficial", episode: "Ep. 09", date: "2026-05-26", recent: true },
  { id: "9zShNTr59Oo", title: "A Lot Did Happen Last Night, Though 😂", series: "Mahou Shoujo Madoka Magica", channel: "AnimeOfficial", episode: "Ep. 11", date: "2026-05-24", recent: true },
  { id: "5Fr9M1GBDBo", title: "You Did A Good Job 😂", series: "Ruri no Houseki", channel: "AnimeOfficial", episode: "Ep. 08", date: "2026-05-22", recent: true },
  { id: "R7nNQQ-OG4M", title: "I Wish I Could Get A Love Letter Too 😂", series: "Mahou Shoujo Madoka Magica", channel: "AnimeOfficial", episode: "Ep. 10", date: "2026-05-20", recent: true },
  { id: "i0Pz8tmOy8o", title: "I Was Working So Much Harder! 😂", series: "Ruri no Houseki", channel: "AnimeOfficial", episode: "Ep. 07", date: "2026-05-18", recent: true },
  { id: "E6X7VsKuMsM", title: "I'm Just So Impressed With Your Determination 😂", series: "Ruri no Houseki", channel: "AnimeOfficial", episode: "Ep. 06" },
  { id: "DtEDLCrliHs", title: "You Haven't Forgotten About The Task At Hand 😂", series: "Ruri no Houseki", channel: "AnimeOfficial", episode: "Ep. 05" },
  { id: "2LeKYoWnm2Y", title: "I Do Want To Stay 😂", series: "I Became Friends With The 2nd Cutest Girl in My Class", channel: "AnimeOfficial", episode: "Ep. 04" },
  { id: "S0BmS2xG8tg", title: "What Do You Want The Most ? GOLD 😂", series: "Ruri no Houseki", channel: "AnimeOfficial", episode: "Ep. 04" },
];

export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const products = [
  { id: "tee", name: "T-shirt Oversize Anime Moments", tag: "Drop manga", emoji: "👕" },
  { id: "fig", name: "Figurine LED Anime Glow", tag: "Collector", emoji: "💡" },
  { id: "pos", name: "Pack Posters Moments Officiels", tag: "Nouveau", emoji: "🖼️" },
  { id: "hoodie", name: "Hoodie Lovanet Neon", tag: "Streetwear", emoji: "🧥" },
  { id: "mug", name: "Mug Anime Moment", tag: "Daily", emoji: "☕" },
  { id: "stickers", name: "Sticker Pack Madoka", tag: "Fan art", emoji: "✨" },
];