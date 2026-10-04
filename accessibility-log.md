# Journal des corrections d'accessibilité

Référentiel : WCAG 2.1 niveau AA. Les ratios de contraste sont calculés avec la formule WCAG de luminance relative.

## 2026-10-04 : premier audit (analyse manuelle)

| # | Problème | Critère | Fichier | Modification | Avant → après |
|---|---|---|---|---|---|
| 1 | Bordures des champs du formulaire presque invisibles | 1.4.11 | `css/style.css` (`.contact-form__input`) | Bordure `--color-border` → `--color-text-muted` | Sombre 1.48 → 7.51 · Clair 1.37 → 6.84 |
| 2 | Menu mobile ouvert : le focus clavier passe derrière l'overlay | 2.4.3, 2.4.7 | `js/main.js` (`setMenuOpen`) | `inert` sur le logo, le hero, `main` et le footer pendant l'ouverture ; Échap ferme le menu et rend le focus au bouton ; fermeture automatique à partir de 768px | — |

## 2026-10-04 : audit du subagent `accessibility-checker`

Score annoncé : 7,5/10. Aucun problème critique. Les 5 problèmes « Important » ont été vérifiés dans le code, puis corrigés :

| # | Problème | Critère | Fichier | Modification | Avant → après |
|---|---|---|---|---|---|
| 3 | Boutons « Voir mes projets » et « Envoyer » : contraste insuffisant au survol/focus en thème clair (`opacity: 0.85`) | 1.4.3 | `css/style.css` (`.hero__cta`, `.contact-form__button`) | `opacity` remplacée par `background-color: color-mix(accent 85 %, --color-text)` | Clair 3.99 → 6.37 · Sombre 11.46 → 15.54 |
| 4 | Champs obligatoires non indiqués visuellement | 3.3.2 | `index.html`, `css/style.css` | Mention « Tous les champs sont obligatoires. » en tête du formulaire (`.contact-form__note`) | — |
| 5 | Aucun retour après « Envoyer » (formulaire sans backend) | 4.1.3 | `index.html`, `js/main.js`, `css/style.css` | Zone `role="status"` (`#contact-form-status`) sous le formulaire, remplie à la soumission | — |
| 6 | Focus des champs peu visible (seule la couleur de bordure change) | 2.4.7 | `css/style.css` (`.contact-form__input:focus`) | `outline: none` → `outline: 2px solid var(--color-accent)` + `outline-offset: 2px` | Écart focus/repos : clair 1.29, sombre 2.12 → contour à 5.30 / 15.89 sur le fond |
| 7 | Trois liens « Voir le projet » identiques, ouverture d'un nouvel onglet non signalée | 2.4.4 | `js/main.js` (`createProjectCard`), `index.html` (lien GitHub du contact) | `aria-label` « Voir le projet <nom> (nouvel onglet) » (commence par le texte visible, 2.5.3) ; « (nouvel onglet) » sur le lien GitHub | — |

### Points mineurs (corrigés le même jour)

| # | Problème | Critère | Fichier | Modification |
|---|---|---|---|---|
| 8 | Liens provisoires `href="#"` dans le footer | 2.4.4 | `index.html` | Lien GitHub du footer → `https://github.com/flolebobo` (nouvel onglet signalé). **LinkedIn reste en `#`** : URL à fournir |
| 9 | Texte factice « Photo » lu par les lecteurs d'écran | 1.1.1 | `index.html` | `aria-hidden="true"` sur `.about__photo` (à remplacer par une `<img>` avec `alt` descriptif) |
| 10 | `<ul>` de langages vide (`notes-cli`) | 1.3.1 | `js/main.js` (`createProjectCard`) | La liste n'est créée que si `languages` n'est pas vide |
| 11 | Erreur de chargement des projets non annoncée | 4.1.3 | `js/main.js` (`loadProjects`) | `role="alert"` sur le message |
| 12 | Libellé du bouton du menu qui change en plus de `aria-expanded` | 4.1.2 | `index.html`, `js/main.js` (`setMenuOpen`) | Libellé fixe « Menu » ; l'état est porté par `aria-expanded` seul |
| 13 | Section active non indiquée dans la navigation | 2.4.8 (bonne pratique) | `js/main.js` | `aria-current="true"` sur le lien de la section qui traverse le milieu de l'écran (IntersectionObserver, `rootMargin: -50% 0px -50% 0px`) |
| 14 | Pas de lien d'évitement | 2.4.1 | `index.html`, `css/style.css`, `js/main.js` | Lien « Aller au contenu » → `#main`, visible au focus clavier ; ajouté aux éléments `inert` quand le menu est ouvert |
| 15 | Navbar hors du landmark `<header>`, hero en `<header>` hors de `<main>` | 1.3.1 | `index.html`, `js/main.js` | La navbar est dans `<header>` ; le hero devient une `<section>` dans `<main id="main">` (une seule bannière) ; sélecteur `inert` mis à jour |

### À vérifier dans un navigateur

Ces corrections ont été vérifiées par lecture du code et par calcul, pas encore en conditions réelles : navigation au clavier (lien d'évitement, menu), lecteur d'écran (NVDA), zoom 200 %.
