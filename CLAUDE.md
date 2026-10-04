# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

**MonPortfolio** : site portfolio statique en HTML, CSS et JavaScript vanilla. Aucun framework.

Pas de build, de dépendances, de tests ni de linter. Le site doit être servi en HTTP (ex. Live Server de VS Code), car les projets sont chargés par `fetch()`, qui échoue en `file://`.

Les projets de la section Projets sont dans `data/projects.json` (`name`, `description`, `languages`, `url`, `lastUpdated` au format `YYYY-MM-DD`) ; les cartes sont générées par `loadProjects()` dans `js/main.js`.

Les opérations GitHub passent par la CLI `gh` (compte `flolebobo`) ; pas de serveur MCP GitHub.

## Design

- Minimaliste et professionnel.
- Mode sombre par défaut, mode clair disponible via un bouton dans la navbar.
- Mobile-first : on écrit d'abord les styles pour mobile, puis on les étend pour les écrans plus larges avec des media queries `min-width`.

### Palette et typographie

Définies comme variables CSS dans `css/style.css` :

| Variable | Sombre (défaut) | Clair | Usage |
|---|---|---|---|
| `--color-bg` | `#0a0a0a` | `#ffffff` | fond de page |
| `--color-surface` | `#171a21` | `#f5f5f5` | cartes, blocs |
| `--color-text` | `#e0e0e0` | `#1a1a1a` | texte principal |
| `--color-text-muted` | `#9aa0a8` | `#555b65` | texte secondaire |
| `--color-accent` | `#64ffda` | `#0a7a60` | liens, boutons |
| `--color-border` | `#2a2f3a` | `#d9dce1` | bordures discrètes (navbar, footer) ; trop pâle pour les champs de formulaire, qui utilisent `--color-text-muted` (contraste 3:1 requis) |
| `--font-main` | `'Inter', sans-serif` | idem | toute la typographie (Google Fonts) |

Thème : attribut `data-theme` sur `<html>`. La règle `:root[data-theme="light"]` ne redéfinit que des variables. Au chargement : choix sauvegardé dans `localStorage`, sinon `prefers-color-scheme`.

## Architecture

### Thème (réparti sur 3 fichiers)

- `index.html` : script inline dans le `<head>` qui pose `data-theme` avant le premier rendu (évite le flash).
- `js/main.js` : bouton de bascule, clé `localStorage` `theme`, mise à jour du `aria-label`.
- `css/style.css` : variables. Les icônes soleil/lune sont affichées via les variables `--theme-icon-sun` / `--theme-icon-moon`, pas en JS.

Ajouter une couleur demande 4 modifications dans `style.css` : une déclaration `@property` (sans elle, la transition de thème ne s'anime pas), la valeur dans `:root`, la valeur dans `:root[data-theme="light"]`, et l'ajout à la liste `transition` de `:root`.

### Conventions CSS/JS

- Classes en BEM (`bloc__element--modificateur`). Les boutons partagent le bloc `.button` ; leur classe propre (`hero__cta`, `contact-form__button`) ne gère que le placement.
- `js/main.js` est découpé en fonctions `init…()` appelées en bas du fichier.
- Classes d'état ajoutées uniquement par le JS : `navbar--open`, `section--animated`, `section--visible`. L'état caché des sections est posé par le JS (et non dans le HTML) pour que le contenu reste visible si le JS échoue.
- Points de rupture : `768px` (tablette) et `1024px` (desktop).
- `prefers-reduced-motion` est respecté à la fois dans le CSS et dans le JS. Les effets de survol sont dans `@media (hover: hover)`.

### État actuel

- Le formulaire de contact n'a pas de backend : la soumission est bloquée dans `js/main.js`, qui affiche un message dans la zone `role="status"` `#contact-form-status`.
- Les corrections d'accessibilité sont consignées dans `accessibility-log.md`.
- Contenus provisoires : lien LinkedIn du footer (`href="#"`) et bloc « Photo » dans la section À propos.

## Langues

- **Code en anglais** : noms de variables, fonctions, classes CSS, identifiants et fichiers.
- **Contenu visible en français** : textes affichés sur le site, attributs `alt`, `title`, `aria-label`, etc.
