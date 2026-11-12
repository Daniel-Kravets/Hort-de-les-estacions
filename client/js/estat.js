// Estat de la sessió: qui està jugant ara mateix i la seva partida.
import { Partida } from "./models/Partida.js";
import { obtenirPartida, desarPartida } from "./services/api.js";

export const estat = {
  classe: null,
  alumne: null,
  partida: null,
};

// Per a la demo: http://localhost:3000/?llavors=45 suma 45 llavors a l'alumne que entri
const llavorsDemo = Number(new URLSearchParams(location.search).get("llavors")) || 0;

// Carrega la partida guardada de l'alumne (o en crea una de nova)
export async function començarPartida(classe, alumne) {
  const dades = await obtenirPartida(alumne.id);
  estat.classe = classe;
  estat.alumne = alumne;
  estat.partida = new Partida(dades);

  if (llavorsDemo > 0) {
    estat.partida.afegirLlavors(llavorsDemo);
    await desar();
  }
}

// Desa la partida actual. Si falla, el joc continua i ho avisem a la consola.
export async function desar() {
  if (!estat.partida) return;
  try {
    await desarPartida(estat.partida);
  } catch (error) {
    console.error("No s'ha pogut desar la partida", error);
  }
}
