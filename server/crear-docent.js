// Afegeix o actualitza un docent a server/data/docents.json
//
//   npm run docent -- <usuari> <contrasenya> <grups> "<nom>"
//   npm run docent -- mestra.i4 unaContrasenya I4 "Marta"
//   npm run docent -- coordinacio altraContrasenya I3,I4,I5 "Coordinació"

import { llegirJSON, escriureJSON } from "./dades.js";
import { xifrarContrasenya } from "./seguretat.js";

const [usuari, contrasenya, grups, nom] = process.argv.slice(2);

if (!usuari || !contrasenya || !grups) {
  console.log('Ús: npm run docent -- <usuari> <contrasenya> <grups separats per comes> "<nom>"');
  process.exit(1);
}

let dades;
try {
  dades = await llegirJSON("docents.json");
} catch {
  dades = { docents: [] };
}

const docent = {
  usuari: usuari.toLowerCase(),
  nom: nom ?? usuari,
  grups: grups.toUpperCase().split(",").map((g) => g.trim()),
  contrasenya: xifrarContrasenya(contrasenya),
};

dades.docents = dades.docents.filter((d) => d.usuari !== docent.usuari);
dades.docents.push(docent);
await escriureJSON("docents.json", dades);

console.log(`Docent "${docent.usuari}" desat amb les classes ${docent.grups.join(", ")}`);
