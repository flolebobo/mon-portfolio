---
description: Checklist pré-déploiement
---

Exécute dans l'ordre :
1. Vérifie que `data/projects.json` est un JSON valide et que chaque projet a `name`, `description`, `languages`, `url` et `lastUpdated` (format `YYYY-MM-DD`)
2. Cherche les `console.log` restants dans `js/`
3. Cherche les liens provisoires `href="#"` exacts (les ancres comme `href="#about"` sont normales)
4. Vérifie que les fichiers référencés par `index.html` (CSS, JS) existent
5. Affiche un résumé : ✅ prêt / ❌ bloqué (avec la raison)
