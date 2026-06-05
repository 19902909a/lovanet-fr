## Objectif

1. Afficher les **vidéos les plus récentes en haut** et les **anciennes en bas** sur toutes les pages concernées.
2. Relancer la **synchronisation** pour importer les nouveaux épisodes depuis YouTube et TikTok.

## Changements

### 1. Tri global (récent → ancien)

Appliquer un tri décroissant sur `published_at` (puis `created_at` en fallback) partout où les vidéos importées sont listées :

- `src/components/RecentEpisodesCarousel.tsx` — déjà trié desc ✅ (à vérifier)
- `src/pages/ChaineYoutube.tsx` — forcer `order("published_at", desc)` côté requête Supabase, et filtrer `source = 'youtube'`
- `src/pages/Tiktok.tsx` — idem avec `source = 'tiktok'`
- `src/pages/LecteursVideo.tsx` — tri desc sur la liste agrégée
- `src/pages/Index.tsx` — la section « À regarder sur Lovanet » utilise `videos` (data statique) : trier par `date` desc avant le `.slice(0, 8)`

Comportement final : la vidéo la plus récemment publiée apparaît en première position ; les anciennes glissent en bas de page / fin de liste.

### 2. Synchronisation des nouveaux épisodes

- Appel de l'edge function `sync-videos` (YouTube + TikTok) avec la `YOUTUBE_API_KEY` déjà configurée.
- La détection anti-doublons (contrainte unique `source + external_id`) déjà en place garantit qu'aucune vidéo existante ne sera dupliquée — seules les nouveautés seront insérées.
- Affichage du résultat : nombre de vidéos ajoutées par source.

## Détails techniques

- Requête type :
  ```ts
  supabase.from("imported_videos")
    .select("...")
    .eq("source", "youtube")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  ```
- Pour `src/data/videos.ts` (fallback statique), trier par `date` desc dans le composant qui consomme (pas de mutation du module).
- Aucune migration DB nécessaire.

## Hors scope

- Pas de changement visuel des cartes (badges « Nouveau », titres complets, lazy load déjà en place).
- Pas de pagination supplémentaire.
