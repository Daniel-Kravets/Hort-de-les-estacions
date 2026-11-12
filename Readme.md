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

> **Veu:** el joc llegeix les instruccions en català amb la veu del navegador.
> **Microsoft Edge** ja porta veus catalanes. A Chrome cal instal·lar la veu catalana a Windows
> (Configuració → Hora i idioma → Veu → Afegeix veus → Català).

**Truc per a la demo:** http://localhost:3000/?llavors=45 suma 45 llavors a l'alumne que entri.

## Usuaris de prova (accés docent)

Tots tenen la contrasenya **`hort2026`**:

| Usuari | Classes que veu |
| --- | --- |
| `mestra.i3` | I3 |
| `mestra.i4` | I4 |
| `mestra.i5` | I5 |
| `coordinacio` | I3, I4, I5 |

Les contrasenyes es guarden xifrades (scrypt) a `server/data/docents.json` i no es poden recuperar.
Per crear un docent o canviar-li la contrasenya:

```bash
npm run docent -- <usuari> <contrasenya> <classes> "<nom>"
npm run docent -- mestra.i4 novaContrasenya I4 "Mestra d'I4"
```

**Abans de fer servir el joc a l'escola, canvieu les contrasenyes de prova.**

## Branques

- `master`: versió estable
- `Dani`, ...: branca de treball de cada membre

## Crèdits

Pictogrames: Sergio Palao. Origen: ARASAAC (https://arasaac.org). Llicència: CC BY-NC-SA. Propietat: Govern d'Aragó.
