# L'Hort de les Estacions

Serious game web per a l'itinerari d'educació infantil (I3, I4 i I5) de l'escola.
Cada infant té un hort virtual que creix quan supera activitats de l'estació.

Projecte del mòdul **MP0492 Projecte** · CFGS DAW · Curs 2026-2027
Equip: Daniel Kravets · Adrià Patricio

## Tecnologies

- **Client:** HTML5, CSS3 i JavaScript (mòduls ES, sense frameworks)
- **Servidor:** Node.js + Express
- **Persistència:** fitxers JSON
- **Pictogrames:** [ARASAAC](https://arasaac.org)

## Estructura

```
client/            Aplicació que veu l'infant (una sola pàgina)
  index.html
  css/             Colors, tipografia, components i pantalles
  js/
    main.js        Arrencada i navegació entre pantalles
    models/        Classes del diagrama UML
    screens/       Una pantalla per fitxer
    activities/    Els minijocs de l'estació
    services/      ARASAAC, veu i crides al servidor
  assets/          Imatges pròpies i sons
server/
  server.js        Servidor Express (web + API)
  data/            JSON: grups, mons, botiga i partides
```

## Com s'executa

```bash
npm install
npm start
```

Després obre http://localhost:3000 al navegador.

## Branques

- `master`: versió estable
- `Dani`, ...: branca de treball de cada membre

## Crèdits

Pictogrames: Sergio Palao. Origen: ARASAAC (https://arasaac.org). Llicència: CC BY-NC-SA. Propietat: Govern d'Aragó.
