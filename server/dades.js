// Lectura i escriptura dels fitxers JSON de server/data/
// Tota la "base de dades" del joc són fitxers JSON.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CARPETA_DADES = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");

export async function llegirJSON(nomFitxer) {
  const text = await readFile(path.join(CARPETA_DADES, nomFitxer), "utf-8");
  return JSON.parse(text);
}

export async function escriureJSON(nomFitxer, dades) {
  const text = JSON.stringify(dades, null, 2);
  await writeFile(path.join(CARPETA_DADES, nomFitxer), text + "\n", "utf-8");
}
