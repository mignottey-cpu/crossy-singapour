# Crossy Singapour 🇸🇬

Un Crossy Road personnalisé pour jouer en famille, basé sur
[Expo-Crossy-Road](https://github.com/EvanBacon/Expo-Crossy-Road) d'Evan Bacon (licence MIT).

**Jouer :** https://mignottey-cpu.github.io/crossy-singapour/ (rien à installer, ordinateur ou téléphone).

## Deux modes

- **Singapour** : promenade de Marina Bay, Supertrees, Merlion, tours de la ville
  (Marina Bay Sands, Pinnacle@Duxton…), Grab et bus verts, supercars, piste
  cyclable avec peloton, billets de dollars de Singapour et MacBook sur l'eau.
- **Exam** : copies Seyès, tableau noir, rivière de formules de maths,
  fournitures de bureau, bibliothèques, campus ESSEC, étudiants en costume.

On change de mode avec le bouton à gauche de l'écran de fin de partie. Le
gameplay est le même dans les deux modes.

## Développement

```sh
bun install
npx expo start --web
```

Les décors sont construits en voxels dans le code :
`src/Singapore.ts`, `src/Exam.ts`, `src/Cycling.ts`, `src/Avatar.ts`.

Version web en un seul fichier :

```sh
npx expo export -p web --output-dir dist
# rendre les chemins relatifs puis :
python3 scripts/build-single-html.py <dossier-web> crossy-singapour.html
```
