// El joc està dissenyat per a 1024 x 768. En pantalles més grans (pissarra digital)
// tot creix proporcionalment perquè els infants ho vegin bé de lluny.

const AMPLADA_BASE = 1024;
const ALCADA_BASE = 768;

let factor = 1;

export function escala() {
  return factor;
}

function ajustar() {
  factor = Math.max(1, Math.min(innerWidth / AMPLADA_BASE, innerHeight / ALCADA_BASE));
  document.documentElement.style.setProperty("--escala", factor);
}

ajustar();
addEventListener("resize", ajustar);
