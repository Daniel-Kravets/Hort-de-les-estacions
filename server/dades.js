// Lectura i escriptura dels fitxers JSON de server/data/
// Tota la "base de dades" del joc són fitxers JSON.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CARPETA_DADES = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");

export async function llegirJSON(nomFitxer) {
  const text = await readFile(path.join(CARPETA_DADES, nomFitxer), "utf-8");
  return JSON.parse(text);
}

export async function escriureJSON(nomFitxer, dades) {
  const ruta = path.join(CARPETA_DADES, nomFitxer);
  await mkdir(path.dirname(ruta), { recursive: true });   // per si la carpeta encara no existeix
  const text = JSON.stringify(dades, null, 2);
  await writeFile(ruta, text + "\n", "utf-8");
}
