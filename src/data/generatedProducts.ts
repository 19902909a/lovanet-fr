import type { ShopCategory, ShopProduct } from "./shopProducts";
import { SHOP_PRODUCTS } from "./shopProducts";

const THEMES = [
  "Sakura","Kitsune","Ronin","Shinobi","Kaiju","Neko","Onmyoji","Yokai",
  "Samurai","Miko","Oni","Tengu","Kirin","Ryu","Hoshi","Tsuki",
  "Hikari","Kaze","Mizu","Hana","Yuki","Kumo","Tori","Ame",
  "Neo Tokyo","Akihabara","Shibuya","Harajuku","Kyoto","Osaka",
  "Mecha","Gundam Style","Cyber Katana","Neon City","Chibi Squad",
  "Magical Girl","Idol Live","Shonen Hero","Shojo Dream","Isekai Quest",
  "Battle Arena","Dojo Legend","Onsen","Matsuri","Sakura Festival",
  "Moonlight","Sunset Bay","Starlight","Rainbow Wave","Prism",
];

const STYLES = [
  "Neon","Chibi","Retro","Hologramme","Cyberpunk","Kawaii","Vintage",
  "Glitch","Pastel","Fluo","Dark","Sunset","Aqua","Rose Gold",
  "Chrome","Vaporwave","Line Art","Watercolor","Ink Wash","Sketch",
];

type Line = {
  category: ShopCategory;
  types: string[];
  tags: string[];
  base: number;
  range: number;
  desc: (name: string, theme: string, style: string) => string;
};

const LINES: Line[] = [
  { category: "poster", types: ["Affiche","Poster","Tirage art","Triptyque","Mural XXL","Poster lenticulaire"], tags: ["A2","A1","50x70","Holo","Mat premium","Edition limitee"], base: 18, range: 42,
    desc: (n,t,s)=>`${n} — impression giclee HD, papier 250g mat, finition ${s.toLowerCase()}. Univers ${t}, signe AnimemomentsAnimeofficiel. Tube renforce, expedition suivie 3-7j.` },
  { category: "collector", types: ["Figurine","Statue","Nendoroid","Buste","Diorama","Boule cristal","Vinyle picture disc","Artbook"], tags: ["Edition 500","Numerote","Resine","PVC premium","Coffret","Rare"], base: 34, range: 220,
    desc: (n,t,s)=>`${n} — piece collection ${s.toLowerCase()} inspiree de ${t}. Peinture main, socle premium, boite fenetre, certificat d'authenticite AnimemomentsAnimeofficiel.` },
  { category: "apparel", types: ["Hoodie","T-shirt","Crewneck","Bomber","Coach jacket","Long sleeve","Kimono street","Varsity"], tags: ["Oversize","Heavyweight 320g","Coton bio","Broderie","All-over","Streetwear"], base: 32, range: 95,
    desc: (n,t,s)=>`${n} — piece streetwear ${s.toLowerCase()} oversize, coton 240-320g, serigraphie haute densite, broderie ${t}. XS-XXL. Livraison suivie.` },
  { category: "sneakers", types: ["Sneakers basses","Sneakers hautes","Runners","Slip-on","Chunky","Skate"], tags: ["Edition capsule","Numerote","Cuir vegan","Mesh","Semelle epaisse","Reflective"], base: 79, range: 140,
    desc: (n,t,s)=>`${n} — silhouette ${s.toLowerCase()} univers ${t}. Tige mesh + cuir vegan, semelle EVA amortie, oeillets metal. Boite collector incluse.` },
  { category: "music", types: ["Vinyle 12\"","Vinyle picture","OST double CD","Cassette collector","EP digital deluxe"], tags: ["OST","Vinyle 180g","Edition limitee","Signe","Bonus"], base: 19, range: 45,
    desc: (n,t,s)=>`${n} — bande-son originale ${s.toLowerCase()} pour la serie ${t}. Pressage 180g, pochette holo, livret 12 pages avec artworks exclusifs.` },
  { category: "manga", types: ["Manga tome","Coffret 3 tomes","Coffret integrale","Artbook","Roman visuel","BD"], tags: ["VF","Collector","Jaquette alt.","Souple","Rigide"], base: 9, range: 89,
    desc: (n,t,s)=>`${n} — edition ${s.toLowerCase()} AnimemomentsAnimeofficiel. Papier bouffant, jaquette alternative, pages couleur bonus autour de l'univers ${t}.` },
  { category: "daily", types: ["Mug thermo","Gourde inox","Tote bag","Tapis souris XXL","Bougie parfumee","Plaid sherpa","Sticker pack","Carnet A5","Lampe LED","Coque smartphone","Porte-cles","Casquette 3D","Beanie","Chaussettes","Eventail sensu"], tags: ["Quotidien","Cadeau","Gaming","Deco","Accessoire"], base: 8, range: 42,
    desc: (n,t,s)=>`${n} — objet quotidien ${s.toLowerCase()} finition premium. Materiau durable, impression resistante, packaging responsable. Design exclusif autour de ${t}.` },
];

function seededPrice(base: number, range: number, seed: number) {
  const v = (seed * 2654435761) >>> 0;
  const n = base + (v % range);
  return Math.max(base, Math.round(n));
}

const SOURCES: ShopProduct["source"][] = ["youtube","tiktok","both"];

export function generateProducts(count = 5000): ShopProduct[] {
  const out: ShopProduct[] = [];
  for (let i = 0; i < count; i++) {
    const line = LINES[i % LINES.length];
    const type = line.types[Math.floor(i / LINES.length) % line.types.length];
    const theme = THEMES[(i * 3) % THEMES.length];
    const style = STYLES[(i * 7) % STYLES.length];
    const tag = line.tags[i % line.tags.length];
    const name = `${type} ${style} ${theme} - Serie ${String(1 + (i % 99)).padStart(2, "0")}`;
    const id = `gm-${String(i + 1).padStart(5, "0")}`;
    out.push({
      id, name, category: line.category, tag,
      price: seededPrice(line.base, line.range, i + 1),
      description: line.desc(name, theme, style),
      source: SOURCES[i % SOURCES.length],
    });
  }
  return out;
}

export const ALL_PRODUCTS: ShopProduct[] = [...SHOP_PRODUCTS, ...generateProducts(5000)];

export function loadManualProducts(): ShopProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("lovanet:manual-products");
    return raw ? (JSON.parse(raw) as ShopProduct[]) : [];
  } catch { return []; }
}
export function saveManualProducts(list: ShopProduct[]) {
  try { localStorage.setItem("lovanet:manual-products", JSON.stringify(list)); } catch {}
}
