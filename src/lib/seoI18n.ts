// SEO i18n dictionary — controls the title / description / og:* that Google
// serves in the SERP snippet for each supported UI language. Selection is
// driven by `?hl=<code>` (explicit) or `navigator.language` (implicit).
//
// Google's crawler executes JS, so react-helmet-async mutations to
// <title> / <meta> are picked up. For each locale we also emit a
// <link rel="alternate" hreflang="..."> set so Google knows about the
// other-language versions of the same page and can serve the right one
// to the right user.

export const SUPPORTED_LOCALES = ["fr", "en", "es", "de", "it", "pt", "ja", "zh"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export type RouteKey =
  | "/"
  | "/decouvrir"
  | "/shop"
  | "/anime-catalog"
  | "/anime-countdown"
  | "/chaine-youtube"
  | "/prime-video"
  | "/tiktok"
  | "/contact"
  | "/legals";

export const ROUTES: RouteKey[] = [
  "/",
  "/decouvrir",
  "/shop",
  "/anime-catalog",
  "/anime-countdown",
  "/chaine-youtube",
  "/prime-video",
  "/tiktok",
  "/contact",
  "/legals",
];

type Meta = { title: string; description: string };

// Per-language, per-route title + description. Kept concise: title ≤ 60 chars,
// description ≤ 160 chars, matching Google's snippet truncation.
export const SEO_I18N: Record<Locale, Record<RouteKey, Meta>> = {
  fr: {
    "/": {
      title: "Lovanet — Plateforme officielle dédiée à l'anime",
      description: "Anime.Moments.officiel & AnimemomentsAnimeofficiel : vidéos, catalogue 1500+ animés, boutique collector et sorties à venir.",
    },
    "/decouvrir": {
      title: "Univers Lovanet — Vidéos, produits & découvertes anime",
      description: "Vitrine complète Lovanet : chaîne YouTube, TikTok, Prime Video, catalogue anime et boutique officielle.",
    },
    "/shop": {
      title: "Boutique Lovanet — Posters, collectors, vêtements anime",
      description: "76 produits officiels : posters, figurines, hoodies, sneakers et objets collector anime livrés partout.",
    },
    "/anime-catalog": {
      title: "Catalogue Anime — 1500+ animés avec trailers",
      description: "Fiches complètes, trailers et résumés de plus de 1500 animés : shonen, seinen, isekai et classiques.",
    },
    "/anime-countdown": {
      title: "Anime à venir — Countdown live des sorties",
      description: "Compte à rebours live des prochains épisodes et sorties anime saison par saison.",
    },
    "/chaine-youtube": {
      title: "AnimemomentsAnimeofficiel — Chaîne YouTube officielle",
      description: "Chaîne YouTube officielle Lovanet : moments cultes, shorts, compilations et épisodes anime.",
    },
    "/prime-video": {
      title: "Anime.Moments.officiel — Prime Video",
      description: "Lecture immersive Prime Video des animés partenaires Lovanet.",
    },
    "/tiktok": {
      title: "Anime.Moments.officiel — TikTok",
      description: "Compte TikTok officiel Lovanet : shorts verticaux, moments cultes et tendances anime.",
    },
    "/contact": {
      title: "Contact — Lovanet",
      description: "Contactez l'équipe Lovanet pour partenariats, support boutique et demandes presse.",
    },
    "/legals": {
      title: "Mentions légales — Lovanet",
      description: "Mentions légales, CGV et politique de confidentialité Lovanet / AnimemomentsAnimeofficiel.",
    },
  },
  en: {
    "/": {
      title: "Lovanet — Official anime platform, videos & shop",
      description: "Anime.Moments.officiel & AnimemomentsAnimeofficiel: videos, 1500+ anime catalog, collector shop and upcoming releases.",
    },
    "/decouvrir": {
      title: "Discover Lovanet — Videos, products & anime universe",
      description: "Full Lovanet showcase: YouTube channel, TikTok, Prime Video, anime catalog and official shop.",
    },
    "/shop": {
      title: "Lovanet Shop — Anime posters, collectors & apparel",
      description: "76 official products: posters, figures, hoodies, sneakers and anime collectibles shipped worldwide.",
    },
    "/anime-catalog": {
      title: "Anime Catalog — 1500+ shows with trailers",
      description: "Complete cards, trailers and synopses for 1500+ anime: shonen, seinen, isekai and classics.",
    },
    "/anime-countdown": {
      title: "Upcoming Anime — Live release countdown",
      description: "Live countdown to the next anime episodes and season releases.",
    },
    "/chaine-youtube": {
      title: "AnimemomentsAnimeofficiel — Official YouTube channel",
      description: "Official Lovanet YouTube channel: iconic moments, shorts, compilations and anime episodes.",
    },
    "/prime-video": {
      title: "Anime.Moments.officiel — Prime Video",
      description: "Immersive Prime Video streaming of Lovanet partner anime.",
    },
    "/tiktok": {
      title: "Anime.Moments.officiel — TikTok",
      description: "Official Lovanet TikTok account: vertical shorts, iconic anime moments and trends.",
    },
    "/contact": {
      title: "Contact — Lovanet",
      description: "Reach the Lovanet team for partnerships, shop support and press inquiries.",
    },
    "/legals": {
      title: "Legal notice — Lovanet",
      description: "Legal notice, terms of sale and privacy policy for Lovanet / AnimemomentsAnimeofficiel.",
    },
  },
  es: {
    "/": {
      title: "Lovanet — Plataforma oficial de anime, vídeos y tienda",
      description: "Anime.Moments.officiel y AnimemomentsAnimeofficiel: vídeos, catálogo de 1500+ animes, tienda coleccionista y próximos estrenos.",
    },
    "/decouvrir": {
      title: "Descubre Lovanet — Vídeos, productos y universo anime",
      description: "Escaparate completo Lovanet: canal YouTube, TikTok, Prime Video, catálogo anime y tienda oficial.",
    },
    "/shop": {
      title: "Tienda Lovanet — Pósteres, coleccionables y ropa anime",
      description: "76 productos oficiales: pósteres, figuras, sudaderas, zapatillas y coleccionables anime con envío mundial.",
    },
    "/anime-catalog": {
      title: "Catálogo de anime — 1500+ series con tráilers",
      description: "Fichas completas, tráilers y sinopsis de más de 1500 animes: shonen, seinen, isekai y clásicos.",
    },
    "/anime-countdown": {
      title: "Próximos animes — Cuenta atrás en directo",
      description: "Cuenta atrás en vivo de los próximos episodios y estrenos de anime por temporada.",
    },
    "/chaine-youtube": {
      title: "AnimemomentsAnimeofficiel — Canal oficial de YouTube",
      description: "Canal YouTube oficial Lovanet: momentos icónicos, shorts, recopilaciones y episodios de anime.",
    },
    "/prime-video": {
      title: "Anime.Moments.officiel — Prime Video",
      description: "Streaming inmersivo Prime Video de los animes asociados a Lovanet.",
    },
    "/tiktok": {
      title: "Anime.Moments.officiel — TikTok",
      description: "Cuenta TikTok oficial Lovanet: shorts verticales, momentos icónicos y tendencias anime.",
    },
    "/contact": {
      title: "Contacto — Lovanet",
      description: "Contacta con el equipo Lovanet para colaboraciones, soporte de tienda y prensa.",
    },
    "/legals": {
      title: "Aviso legal — Lovanet",
      description: "Aviso legal, condiciones de venta y política de privacidad de Lovanet / AnimemomentsAnimeofficiel.",
    },
  },
  de: {
    "/": {
      title: "Lovanet — Offizielle Anime-Plattform, Videos & Shop",
      description: "Anime.Moments.officiel & AnimemomentsAnimeofficiel: Videos, 1500+ Anime-Katalog, Sammlershop und kommende Releases.",
    },
    "/decouvrir": {
      title: "Lovanet entdecken — Videos, Produkte & Anime-Universum",
      description: "Komplette Lovanet-Vitrine: YouTube-Kanal, TikTok, Prime Video, Anime-Katalog und offizieller Shop.",
    },
    "/shop": {
      title: "Lovanet Shop — Anime-Poster, Sammlerstücke & Kleidung",
      description: "76 offizielle Produkte: Poster, Figuren, Hoodies, Sneaker und Anime-Sammlerstücke, weltweiter Versand.",
    },
    "/anime-catalog": {
      title: "Anime-Katalog — 1500+ Serien mit Trailern",
      description: "Vollständige Steckbriefe, Trailer und Synopsen für 1500+ Anime: Shonen, Seinen, Isekai und Klassiker.",
    },
    "/anime-countdown": {
      title: "Kommende Anime — Live-Countdown der Releases",
      description: "Live-Countdown zu den nächsten Anime-Episoden und Season-Releases.",
    },
    "/chaine-youtube": {
      title: "AnimemomentsAnimeofficiel — Offizieller YouTube-Kanal",
      description: "Offizieller Lovanet YouTube-Kanal: Kultmomente, Shorts, Compilations und Anime-Episoden.",
    },
    "/prime-video": {
      title: "Anime.Moments.officiel — Prime Video",
      description: "Immersives Prime-Video-Streaming der Lovanet-Partneranime.",
    },
    "/tiktok": {
      title: "Anime.Moments.officiel — TikTok",
      description: "Offizieller Lovanet-TikTok-Account: Vertical Shorts, Kultmomente und Anime-Trends.",
    },
    "/contact": {
      title: "Kontakt — Lovanet",
      description: "Kontaktieren Sie das Lovanet-Team für Partnerschaften, Shop-Support und Presseanfragen.",
    },
    "/legals": {
      title: "Impressum — Lovanet",
      description: "Impressum, AGB und Datenschutzerklärung Lovanet / AnimemomentsAnimeofficiel.",
    },
  },
  it: {
    "/": {
      title: "Lovanet — Piattaforma ufficiale anime, video e shop",
      description: "Anime.Moments.officiel e AnimemomentsAnimeofficiel: video, catalogo 1500+ anime, shop da collezione e prossime uscite.",
    },
    "/decouvrir": {
      title: "Scopri Lovanet — Video, prodotti e universo anime",
      description: "Vetrina completa Lovanet: canale YouTube, TikTok, Prime Video, catalogo anime e shop ufficiale.",
    },
    "/shop": {
      title: "Shop Lovanet — Poster, oggetti da collezione e abbigliamento anime",
      description: "76 prodotti ufficiali: poster, figure, felpe, sneakers e oggetti collector anime spediti nel mondo.",
    },
    "/anime-catalog": {
      title: "Catalogo anime — 1500+ serie con trailer",
      description: "Schede complete, trailer e trame di oltre 1500 anime: shonen, seinen, isekai e classici.",
    },
    "/anime-countdown": {
      title: "Anime in arrivo — Countdown live delle uscite",
      description: "Countdown live dei prossimi episodi e uscite anime stagionali.",
    },
    "/chaine-youtube": {
      title: "AnimemomentsAnimeofficiel — Canale YouTube ufficiale",
      description: "Canale YouTube ufficiale Lovanet: momenti cult, shorts, compilation ed episodi anime.",
    },
    "/prime-video": {
      title: "Anime.Moments.officiel — Prime Video",
      description: "Streaming immersivo Prime Video degli anime partner Lovanet.",
    },
    "/tiktok": {
      title: "Anime.Moments.officiel — TikTok",
      description: "Account TikTok ufficiale Lovanet: shorts verticali, momenti cult e trend anime.",
    },
    "/contact": {
      title: "Contatti — Lovanet",
      description: "Contatta il team Lovanet per partnership, supporto shop e richieste stampa.",
    },
    "/legals": {
      title: "Note legali — Lovanet",
      description: "Note legali, condizioni di vendita e privacy policy di Lovanet / AnimemomentsAnimeofficiel.",
    },
  },
  pt: {
    "/": {
      title: "Lovanet — Plataforma oficial de anime, vídeos e loja",
      description: "Anime.Moments.officiel e AnimemomentsAnimeofficiel: vídeos, catálogo 1500+ animes, loja de colecionador e próximos lançamentos.",
    },
    "/decouvrir": {
      title: "Descubra Lovanet — Vídeos, produtos e universo anime",
      description: "Vitrine completa Lovanet: canal YouTube, TikTok, Prime Video, catálogo anime e loja oficial.",
    },
    "/shop": {
      title: "Loja Lovanet — Pôsteres, colecionáveis e roupas anime",
      description: "76 produtos oficiais: pôsteres, figures, moletons, tênis e colecionáveis anime enviados para todo o mundo.",
    },
    "/anime-catalog": {
      title: "Catálogo anime — 1500+ séries com trailers",
      description: "Fichas completas, trailers e sinopses de mais de 1500 animes: shonen, seinen, isekai e clássicos.",
    },
    "/anime-countdown": {
      title: "Próximos animes — Contagem regressiva ao vivo",
      description: "Contagem regressiva ao vivo dos próximos episódios e lançamentos de anime por temporada.",
    },
    "/chaine-youtube": {
      title: "AnimemomentsAnimeofficiel — Canal oficial no YouTube",
      description: "Canal YouTube oficial Lovanet: momentos icônicos, shorts, compilações e episódios de anime.",
    },
    "/prime-video": {
      title: "Anime.Moments.officiel — Prime Video",
      description: "Streaming imersivo Prime Video dos animes parceiros Lovanet.",
    },
    "/tiktok": {
      title: "Anime.Moments.officiel — TikTok",
      description: "Conta TikTok oficial Lovanet: shorts verticais, momentos icônicos e tendências anime.",
    },
    "/contact": {
      title: "Contato — Lovanet",
      description: "Fale com a equipe Lovanet para parcerias, suporte da loja e imprensa.",
    },
    "/legals": {
      title: "Aviso legal — Lovanet",
      description: "Aviso legal, termos de venda e política de privacidade da Lovanet / AnimemomentsAnimeofficiel.",
    },
  },
  ja: {
    "/": {
      title: "Lovanet — 公式アニメプラットフォーム・動画・ショップ",
      description: "Anime.Moments.officiel と AnimemomentsAnimeofficiel：動画、1500本以上のアニメカタログ、コレクターショップ、今後の配信予定。",
    },
    "/decouvrir": {
      title: "Lovanet を発見 — 動画・商品・アニメの世界",
      description: "Lovanet の全ショーケース：YouTube チャンネル、TikTok、Prime Video、アニメカタログ、公式ショップ。",
    },
    "/shop": {
      title: "Lovanet ショップ — アニメポスター・コレクション・アパレル",
      description: "公式商品76点：ポスター、フィギュア、パーカー、スニーカー、コレクターアイテムを世界配送。",
    },
    "/anime-catalog": {
      title: "アニメカタログ — 1500本以上・予告編付き",
      description: "1500本以上のアニメの詳細情報、予告編、あらすじ：少年、青年、異世界、名作。",
    },
    "/anime-countdown": {
      title: "配信予定アニメ — ライブ カウントダウン",
      description: "次回エピソードとシーズンリリースへのライブ カウントダウン。",
    },
    "/chaine-youtube": {
      title: "AnimemomentsAnimeofficiel — 公式 YouTube チャンネル",
      description: "Lovanet 公式 YouTube チャンネル：名シーン、ショート、コンピレーション、アニメエピソード。",
    },
    "/prime-video": {
      title: "Anime.Moments.officiel — Prime Video",
      description: "Lovanet パートナー作品を Prime Video で没入配信。",
    },
    "/tiktok": {
      title: "Anime.Moments.officiel — TikTok",
      description: "Lovanet 公式 TikTok アカウント：縦型ショート、名シーン、アニメトレンド。",
    },
    "/contact": {
      title: "お問い合わせ — Lovanet",
      description: "パートナーシップ、ショップサポート、報道関係のお問い合わせは Lovanet チームまで。",
    },
    "/legals": {
      title: "法的通知 — Lovanet",
      description: "Lovanet / AnimemomentsAnimeofficiel の法的通知、販売条件、プライバシーポリシー。",
    },
  },
  zh: {
    "/": {
      title: "Lovanet — 官方动漫平台、视频与商店",
      description: "Anime.Moments.officiel 与 AnimemomentsAnimeofficiel：视频、1500+ 动漫目录、收藏商店与即将上线。",
    },
    "/decouvrir": {
      title: "发现 Lovanet — 视频、产品与动漫宇宙",
      description: "Lovanet 完整展示：YouTube 频道、TikTok、Prime Video、动漫目录与官方商店。",
    },
    "/shop": {
      title: "Lovanet 商店 — 动漫海报、收藏品与服饰",
      description: "76 款官方商品：海报、手办、连帽衫、运动鞋与动漫收藏品，全球发货。",
    },
    "/anime-catalog": {
      title: "动漫目录 — 1500+ 部作品含预告",
      description: "1500+ 部动漫的完整资料、预告片与剧情：少年、青年、异世界与经典。",
    },
    "/anime-countdown": {
      title: "即将上线动漫 — 实时倒计时",
      description: "下一集与季度上线的实时倒计时。",
    },
    "/chaine-youtube": {
      title: "AnimemomentsAnimeofficiel — 官方 YouTube 频道",
      description: "Lovanet 官方 YouTube 频道：经典时刻、短片、合集与动漫剧集。",
    },
    "/prime-video": {
      title: "Anime.Moments.officiel — Prime Video",
      description: "在 Prime Video 沉浸式观看 Lovanet 合作动漫。",
    },
    "/tiktok": {
      title: "Anime.Moments.officiel — TikTok",
      description: "Lovanet 官方 TikTok 账号：竖屏短片、经典时刻与动漫潮流。",
    },
    "/contact": {
      title: "联系我们 — Lovanet",
      description: "有关合作、商店支持与媒体咨询，请联系 Lovanet 团队。",
    },
    "/legals": {
      title: "法律声明 — Lovanet",
      description: "Lovanet / AnimemomentsAnimeofficiel 的法律声明、销售条款与隐私政策。",
    },
  },
};

// hreflang codes advertised to Google. `x-default` maps to French (canonical).
export const HREFLANG_MAP: Record<Locale, string> = {
  fr: "fr",
  en: "en",
  es: "es",
  de: "de",
  it: "it",
  pt: "pt",
  ja: "ja",
  zh: "zh",
};

export function detectLocale(search: string, navLang: string | undefined): Locale {
  const params = new URLSearchParams(search);
  const hl = params.get("hl")?.toLowerCase();
  if (hl && (SUPPORTED_LOCALES as readonly string[]).includes(hl)) return hl as Locale;
  const nav = (navLang || "").slice(0, 2).toLowerCase();
  if ((SUPPORTED_LOCALES as readonly string[]).includes(nav)) return nav as Locale;
  return DEFAULT_LOCALE;
}

export function normalizeRoute(pathname: string): RouteKey {
  const key = pathname.split("?")[0].replace(/\/+$/, "") || "/";
  return (ROUTES.includes(key as RouteKey) ? (key as RouteKey) : "/");
}

export function metaFor(locale: Locale, route: RouteKey): Meta {
  return SEO_I18N[locale][route] ?? SEO_I18N[DEFAULT_LOCALE][route];
}