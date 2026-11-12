// Navegador: canvia de pantalla dins del mateix index.html (una sola pàgina).
// Va sincronitzat amb l'historial del navegador: el botó "enrere" del navegador
// fa el mateix que el botó TORNAR del joc.

const DURADA_SORTIDA = 360; // ms, igual que l'animació de css/pantalles.css

export class Navegador {
  #contenidor;
  #pantalles = new Map();   // id -> definició de la pantalla
  #historial = [];          // pantalles visitades: [{ id, dades }]
  #actual = null;           // element HTML de la pantalla que es veu ara
  #protector = null;        // funció que es crida si es vol sortir amb "enrere" (p. ex. dins d'una activitat)
  #navegacioPropia = false; // true quan som nosaltres qui movem l'historial

  constructor(contenidor) {
    this.#contenidor = contenidor;
    window.addEventListener("popstate", (e) => this.#enrereDelNavegador(e.state));
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
    const estat = { pas: this.#historial.length };
    if (this.#historial.length === 1) history.replaceState(estat, "");
    else history.pushState(estat, "");
    this.#mostrar(id, dades, "endavant");
  }

  // Torna a la pantalla anterior (passa per l'historial del navegador)
  tornar() {
    if (this.#historial.length <= 1) return;
    this.#navegacioPropia = true;
    history.back();
  }

  // Torna a una pantalla concreta i oblida el camí que hi havia després
  tornarA(id) {
    const posicio = this.#historial.findLastIndex((pas) => pas.id === id);
    if (posicio === -1) return this.anar(id);
    const passos = this.#historial.length - 1 - posicio;
    if (passos === 0) return;
    this.#navegacioPropia = true;
    history.go(-passos);
  }

  // La pantalla actual pot demanar confirmació abans de sortir amb "enrere" del navegador
  protegir(funcio) {
    this.#protector = funcio;
  }

  #enrereDelNavegador(estat) {
    const desti = estat?.pas ?? 1;
    const propia = this.#navegacioPropia;
    this.#navegacioPropia = false;

    // Endavant del navegador, o pàgina recarregada: no fem res
    if (desti >= this.#historial.length) return;

    // Si la pantalla ho demana (una activitat a mitges), primer preguntem
    if (!propia && this.#protector) {
      history.pushState({ pas: this.#historial.length }, "");
      this.#protector();
      return;
    }

    document.querySelectorAll(".dialeg-fons").forEach((d) => d.remove());
    this.#historial = this.#historial.slice(0, desti);
    const { id, dades } = this.#historial.at(-1);
    this.#mostrar(id, dades, "enrere");
  }

  #mostrar(id, dades, direccio) {
    this.#protector = null;
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
