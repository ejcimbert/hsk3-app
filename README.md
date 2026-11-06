# Applications HSK 1, 2 et 3 — Apprentissage du chinois (hsk3-app)

Trois applications web statiques pour réviser le vocabulaire des niveaux
**HSK 1** (汉语水平考试一级), **HSK 2** (汉语水平考试二级) et **HSK 3**
(汉语水平考试三级) :

- **Fiches** : cartes mémoire retournables (hanzi → pinyin + traduction française), par chapitre, avec mode mélangé.
- **Quiz** : QCM de 50 questions (trouver la traduction française du mot), avec score final. À la fin, on peut refaire un nouveau quiz ou rejouer uniquement les mots échoués.
- **Liste de mots** : table complète du vocabulaire avec recherche (hanzi, pinyin ou français).

Le vocabulaire suit le programme officiel **HSK 2.0** (standard 2012) : HSK 1 (150 mots),
HSK 2 (150 mots nouveaux) et HSK 3 (300 mots nouveaux), dans l'ordre officiel (pinyin
alphabétique), organisés en chapitres d'environ 20 mots.

Chaque application propose aussi l'écoute de la prononciation (synthèse vocale
chinoise, Web Speech API), et un sélecteur permet de passer d'un niveau à l'autre.

## Utilisation

Aucune installation ni dépendance : ouvrez simplement `index.html` dans un navigateur,
ou servez le dossier :

```bash
python3 -m http.server 8000
# HSK 3 : http://localhost:8000
# HSK 1 : http://localhost:8000/hsk1/
# HSK 2 : http://localhost:8000/hsk2/
```

Compatible GitHub Pages (déploiement direct depuis la branche `main`).

## Structure

| Chemin          | Rôle                                        |
|-----------------|---------------------------------------------|
| `index.html`    | Application HSK 3 (racine)                  |
| `style.css`     | Mise en page, cartes 3D, responsive          |
| `data.js`       | Vocabulaire HSK 3 (hanzi, pinyin, français, chapitre) |
| `app.js`        | Logique fiches / quiz / liste (commune aux trois niveaux) |
| `hsk1/`         | Application HSK 1 (index.html, style.css, app.js, data.js) |
| `hsk2/`         | Application HSK 2 (index.html, style.css, app.js, data.js) |

Chaque dossier de niveau est auto-contenu : mêmes `app.js` et `style.css`,
seul `data.js` (et le titre de la page) diffère.

## Personnaliser le vocabulaire

Ajoutez des entrées dans le `data.js` du niveau souhaité au format :

```js
{ h: "汉字", p: "hànzì", f: "traduction française", c: 1 }
```

Les chapitres et sélecteurs sont générés automatiquement.
