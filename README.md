# HSK 3 — Application d'apprentissage (hsk3-app)

Application web statique pour réviser le vocabulaire du **HSK 3** (汉语水平考试三级) :

- **Fiches** : cartes mémoire retournables (hanzi → pinyin + traduction française), par chapitre, avec mode mélangé.
- **Quiz** : QCM de 10 questions (trouver la traduction française du mot), avec score final.
- **Liste de mots** : table complète du vocabulaire avec recherche (hanzi, pinyin ou français).

## Utilisation

Aucune installation ni dépendance : ouvrez simplement `index.html` dans un navigateur,
ou servez le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Compatible GitHub Pages (déploiement direct depuis la branche `main`).

## Structure

| Fichier      | Rôle                                      |
|--------------|-------------------------------------------|
| `index.html` | Structure des trois vues                  |
| `style.css`  | Mise en page, cartes 3D, responsive        |
| `data.js`    | Vocabulaire HSK 3 (hanzi, pinyin, français, chapitre) |
| `app.js`     | Logique fiches / quiz / liste             |

## Personnaliser le vocabulaire

Ajoutez des entrées dans `data.js` au format :

```js
{ h: "汉字", p: "hànzì", f: "traduction française", c: 1 }
```

Les chapitres et sélecteurs sont générés automatiquement.
