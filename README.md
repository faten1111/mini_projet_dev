# Quiz Tunisie — Mini projet Web (Sujet 7)

Quiz interactif sur la Tunisie réalisé en **HTML5, CSS3 et JavaScript natif** (sans framework).

**Démo en ligne :** https://faten1111.github.io/mini_projet_dev/

**Vidéo de démonstration :** [demo/demo_quiz.mp4](demo/demo_quiz.mp4)

ISSAT Sousse — Département Informatique — FIA3 — 2026/2027
Réalisé par **Tlili Faten** et **Limam Hiba**.

## Fonctionnalités

- 5 catégories (Histoire, Géographie, Informatique, Comédie, Culture générale) + mode « Toutes catégories »
- 3 niveaux de difficulté : Facile (20 s), Moyen (15 s), Difficile (10 s)
- Questions QCM et Vrai / Faux, avec explication après chaque réponse
- Score en points avec bonus de rapidité
- Meilleurs scores sauvegardés (localStorage) et message « Nouveau record »
- Récapitulatif des questions à revoir en fin de partie
- Raccourcis clavier (1-4 ou A-D), thème sombre automatique, design responsive

## Structure

```
index.html      structure des 4 écrans
style.css       charte graphique, thème sombre, responsive
questions.js    banque de questions
script.js       logique du jeu (ScoreManager, QuizTimer, QuizGame)
images/         captures d'écran
rapport/        rapport PDF et source LaTeX
```

## Lancer le projet

Ouvrir `index.html` dans un navigateur, ou utiliser l'extension Live Server de VS Code.
