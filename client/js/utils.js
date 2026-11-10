// Petites eines per crear HTML des de JavaScript

// Converteix un text HTML en un element real
export function html(text) {
  const plantilla = document.createElement("template");
  plantilla.innerHTML = text.trim();
  return plantilla.content.firstElementChild;
}

// Icones SVG que es fan servir a molts llocs
export const icones = {
  enrere: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>`,
  altaveu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M17 9a4 4 0 0 1 0 6"/><path d="M19.5 6.5a8 8 0 0 1 0 11"/></svg>`,
};

// Capçalera comuna: botó TORNAR, títol i botó d'AJUDA
export function capcalera(nav, titol) {
  const element = html(`
    <header class="capcalera">
      <button class="boto boto--suau" data-accio="tornar">${icones.enrere} TORNAR</button>
      <p class="capcalera__titol">${titol}</p>
      <button class="boto boto--ajuda boto--rodo" aria-label="Ajuda" data-accio="ajuda">?</button>
    </header>
  `);
  element.querySelector('[data-accio="tornar"]').addEventListener("click", () => nav.tornar());
  element.querySelector('[data-accio="ajuda"]').addEventListener("click", () => nav.anar("ajuda"));
  return element;
}
