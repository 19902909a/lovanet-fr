## Problèmes constatés

1. **404 sur `/legals`** : aucune route `/legals` n'existe dans `src/App.tsx` (routes actuelles : `/`, `/chaine-youtube`, `/lecteurs-video`, `/prime-video`, `/tiktok`, `/shop`, `/nlounq`, `/contact`). Tout lien vers `/legals` tombe donc sur `NotFound`.
2. **Ancienne description Google** : `index.html` contient encore `<title>Lovanet</title>` et `<meta name="description" content="Lovanet.">`. Le snippet "NLOUNQ & NLOUNQQ — musique, vidéos et plateformes…" que vous voyez sur Google vient d'une version précédente que Google a mise en cache. Aujourd'hui même le code source est trop pauvre, donc on doit d'abord poser un vrai title + description + canonical, puis demander à Google de re-crawler.

## Plan

### 1. Créer la page Mentions légales
- Nouveau fichier `src/pages/Legals.tsx` : page sobre, design system existant, sections :
  - Éditeur du site (NLOUNQ / Lovanet)
  - Hébergement (Lovable)
  - Propriété intellectuelle
  - Données personnelles & cookies
  - Contact (lien `/contact`)
- Title H1 unique, balises sémantiques, `useEffect` pour fixer `document.title` et `<meta name="description">`.
- Ajouter `<Route path="/legals" element={<Legals />} />` dans `src/App.tsx`.
- Ajouter un lien "Mentions légales" dans le footer si présent (sinon dans `Navbar` mobile/menu) pour que la page soit accessible et indexable.

### 2. Corriger le SEO de la home (`index.html`)
- `<title>` → `NLOUNQ & NLOUNQQ — Musique, vidéos et plateformes | Lovanet`
- `<meta name="description">` → courte description actuelle du site (~155 c.), p.ex. : `Lovanet : univers NLOUNQ & NLOUNQQ — streaming musique, clips vidéo, DJ mixer en ligne, boutique et chaînes officielles.`
- Ajouter `<link rel="canonical" href="https://lovanet.fr/" />`
- Mettre à jour `og:title`, `og:description`, `twitter:title`, `twitter:description` avec les mêmes valeurs.
- Ajouter `og:url` = `https://lovanet.fr/`.

### 3. Indexation
- Vérifier `public/robots.txt` et `public/sitemap.xml` (ajouter `/legals` au sitemap).
- Indiquer à l'utilisateur qu'après publication il faut soumettre l'URL dans Google Search Console ("Inspecter l'URL" → "Demander une indexation") pour rafraîchir le snippet — Google met sinon plusieurs semaines.

## Question

Souhaitez-vous que je rédige les mentions légales avec des valeurs génériques (à compléter ensuite) ou avez-vous des informations précises à insérer (nom de l'éditeur, email de contact, SIRET éventuel) ?
