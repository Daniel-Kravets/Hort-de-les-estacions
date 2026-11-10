// Estat de la sessió: qui està jugant ara mateix.
// (A la fase 7 la partida es carregarà i es desarà al servidor en JSON.)
import { Partida } from "./models/Partida.js";

export const estat = {
  classe: null,
  alumne: null,
  partida: null,
};

// Per a la demo: http://localhost:3000/?llavors=50 comença amb 50 llavors
const llavorsDemo = Number(new URLSearchParams(location.search).get("llavors")) || 0;

export function començarPartida(classe, alumne) {
  estat.classe = classe;
  estat.alumne = alumne;
  estat.partida = new Partida({ idAlumne: alumne.id, llavors: llavorsDemo });
}
