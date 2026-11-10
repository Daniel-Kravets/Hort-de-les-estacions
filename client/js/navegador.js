// Navegador: canvia de pantalla dins del mateix index.html (una sola pàgina).
// Recorda el camí que ha fet l'infant per poder TORNAR enrere.

const DURADA_SORTIDA = 360; // ms, igual que l'animació de css/pantalles.css

export class Navegador {
  #contenidor;
  #pantalles = new Map();   // id -> definició de la pantalla
  #historial = [];          // pantalles visitades: [{ id, dades }]
  #actual = null;           // element HTML de la pantalla que es veu ara

  constructor(contenidor) {
    this.#contenidor = contenidor;
  }

  // Afegeix una pantalla. Cada pantalla és un objecte { id, crear(nav, dades) }
  registrar(pantalla) {
    this.#pantalles.set(pantalla.id, pantalla);
    return this;
  }

  // Va a una pantalla nova (endavant)
  anar(id, dades = {}) {
    if (!this.#pantalles.has(id)) {
      console.warn(`La pantalla "${id}" encara no existeix`);
      return;
    }
    this.#historial.push({ id, dades });
    this.#mostrar(id, dades, "endavant");
  }

  // Torna a la pantalla anterior
  tornar() {
    if (this.#historial.length <= 1) return;
    this.#historial.pop();
    const { id, dades } = this.#historial.at(-1);
    this.#mostrar(id, dades, "enrere");
  }

  // Torna a una pantalla concreta i oblida el camí que hi havia després
  tornarA(id) {
    const posicio = this.#historial.findLastIndex((pas) => pas.id === id);
    if (posicio === -1) return this.anar(id);
    this.#historial = this.#historial.slice(0, posicio + 1);
    this.#mostrar(id, this.#historial.at(-1).dades, "enrere");
  }

  #mostrar(id, dades, direccio) {
    const nova = this.#pantalles.get(id).crear(this, dades);
    nova.classList.add("pantalla", `entra-${direccio}`);

    const vella = this.#actual;
    if (vella) {
      vella.classList.add(`surt-${direccio}`);
      setTimeout(() => vella.remove(), DURADA_SORTIDA);
    }

    this.#contenidor.append(nova);
    this.#actual = nova;
  }
}
