import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import {
  SUPPORTED_LOCALES,
  HREFLANG_MAP,
  DEFAULT_LOCALE,
  detectLocale,
  normalizeRoute,
  metaFor,
} from "@/lib/seoI18n";

const SITE = "https://lovanet.fr";

// Emits per-route <title>, <meta description>, canonical, og:*, twitter:*,
// html lang, and a full <link rel="alternate" hreflang="..."> set. Selection
// is driven by ?hl=<code> (explicit) or navigator.language (implicit) and
// stays in sync with react-router navigation.
export function LocalizedHead() {
  const location = useLocation();
  const navLang = typeof navigator !== "undefined" ? navigator.language : undefined;
  const locale = detectLocale(location.search, navLang);
  const route = normalizeRoute(location.pathname);
  const { title, description } = metaFor(locale, route);
  const canonicalPath = route === "/" ? "/" : route;
  const canonical = `${SITE}${canonicalPath}`;

  return (
    <Helmet>
      <html lang={HREFLANG_MAP[locale]} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={
        locale === "fr" ? "fr_FR"
        : locale === "en" ? "en_US"
        : locale === "es" ? "es_ES"
        : locale === "de" ? "de_DE"
        : locale === "it" ? "it_IT"
        : locale === "pt" ? "pt_BR"
        : locale === "ja" ? "ja_JP"
        : "zh_CN"
      } />
      {SUPPORTED_LOCALES.filter((l) => l !== locale).map((l) => (
        <meta key={`ogalt-${l}`} property="og:locale:alternate" content={
          l === "fr" ? "fr_FR"
          : l === "en" ? "en_US"
          : l === "es" ? "es_ES"
          : l === "de" ? "de_DE"
          : l === "it" ? "it_IT"
          : l === "pt" ? "pt_BR"
          : l === "ja" ? "ja_JP"
          : "zh_CN"
        } />
      ))}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* hreflang alternates — one per supported language + x-default (French canonical) */}
      {SUPPORTED_LOCALES.map((l) => (
        <link
          key={`hreflang-${l}`}
          rel="alternate"
          hrefLang={HREFLANG_MAP[l]}
          href={`${SITE}${canonicalPath}${l === DEFAULT_LOCALE ? "" : `?hl=${l}`}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE}${canonicalPath}`} />
    </Helmet>
  );
}