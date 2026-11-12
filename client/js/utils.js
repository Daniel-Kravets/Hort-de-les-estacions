// Petites eines per crear HTML des de JavaScript
import { urlPictograma } from "./services/arasaac.js";

// Converteix un text HTML en un element real
export function html(text) {
  const plantilla = document.createElement("template");
  plantilla.innerHTML = text.trim();
  return plantilla.content.firstElementChild;
}

// Imatge de l'alumne: la foto si en té, i si no, el seu animal d'ARASAAC
export function imatgeAlumne(alumne) {
  return alumne.foto ?? urlPictograma(alumne.avatar.pictograma);
}

// Icones SVG que es fan servir a molts llocs
export const icones = {
  enrere: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>`,
  altaveu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M17 9a4 4 0 0 1 0 6"/><path d="M19.5 6.5a8 8 0 0 1 0 11"/></svg>`,
  cadenat: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 10V7a5 5 0 0 1 10 0v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1zm2 0h6V7a3 3 0 0 0-6 0v3z"/></svg>`,
};

// Capçalera comuna: TORNAR, títol, (llavors i animal de l'alumne) i AJUDA
export function capcalera(nav, titol, { alumne, llavors, ajuda = "general" } = {}) {
  const element = html(`
    <header class="capcalera">
      <button class="boto boto--suau" data-accio="tornar">${icones.enrere} TORNAR</button>
      <p class="capcalera__titol">${titol}</p>
      ${llavors !== undefined ? `<div class="llavors"><span class="llavors__llavor"></span>${llavors}</div>` : ""}
      ${alumne ? `<img class="capcalera__alumne" src="${imatgeAlumne(alumne)}" alt="${alumne.nom}">` : ""}
      <button class="boto boto--ajuda boto--rodo" aria-label="Ajuda" data-accio="ajuda">?</button>
    </header>
  `);
  element.querySelector('[data-accio="tornar"]').addEventListener("click", () => nav.tornar());
  element.querySelector('[data-accio="ajuda"]').addEventListener("click", async () => {
    const { mostrarAjuda } = await import("./ajuda.js");   // import dinàmic: ajuda.js també fa servir utils.js
    mostrarAjuda(ajuda);
  });
  return element;
}

// Finestra de confirmació. botons = [{ text, classe, accio }]
// Retorna l'element per si cal tancar-lo des de fora.
export function dialeg({ titol, contingut = "", botons, classe = "" }) {
  const fons = html(`
    <div class="dialeg-fons">
      <div class="dialeg ${classe}" role="dialog" aria-modal="true">
        <h2>${titol}</h2>
        ${contingut}
        <div class="dialeg__botons"></div>
      </div>
    </div>
  `);
  const zona = fons.querySelector(".dialeg__botons");
  for (const { text, classe = "", accio } of botons) {
    const boto = html(`<button class="boto ${classe}">${text}</button>`);
    boto.addEventListener("click", () => {
      fons.remove();
      accio?.();
    });
    zona.append(boto);
  }
  document.body.append(fons);
  return fons;
}
