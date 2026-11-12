// AJUDA: finestra que s'obre a sobre de la pantalla actual amb els passos
// de com es juga AQUÍ. La veu els llegeix un darrere l'altre.
import { html, icones, dialeg } from "./utils.js";
import { urlPictograma } from "./services/arasaac.js";
import { crearCargolet } from "./cargolet.js";
import { parlar, callar } from "./services/veu.js";

// Icones dels passos: un pictograma d'ARASAAC (número) o un dibuix propi
const ICONES = {
  llavor: `<span class="llavors__llavor ajuda__llavor"></span>`,
  estrella: `<span class="estrella guanyada ajuda__estrella"></span>`,
  altaveu: `<span class="ajuda__altaveu">${icones.altaveu}</span>`,
};

const TORNA_A_PROVAR = { icona: "estrella", text: "SI T'EQUIVOQUES, NO PASSA RES: TORNA-HO A PROVAR!" };

const PASSOS = {
  general: [
    { icona: 5063, text: "TRIA LA TARDOR AL MAPA" },
    { icona: "llavor", text: "JUGA I GUANYA LLAVORS" },
    { icona: 23991, text: "AMB LES LLAVORS, EL TEU HORT CREIX" },
    { icona: "altaveu", text: "TOCA L'ALTAVEU PER TORNAR A ESCOLTAR" },
  ],
  hort: [
    { icona: "llavor", text: "TOCA UN BANCAL PER FER-LO CRÉIXER AMB LLAVORS" },
    { icona: 2714, text: "TOCA JUGAR PER GUANYAR MÉS LLAVORS" },
    { icona: 35695, text: "A LA BOTIGA POTS COMPRAR COSES PER A L'HORT" },
    { icona: 23991, text: "OMPLE LA BARRA I L'HORT FLORIRÀ!" },
  ],
  activitats: [
    { icona: 2714, text: "TRIA UN JOC" },
    { icona: "estrella", text: "LES ESTRELLES DIUEN COM HO HAS FET" },
  ],
  botiga: [
    { icona: 35695, text: "TOCA EL QUE VULGUIS COMPRAR" },
    { icona: "llavor", text: "HO PAGUES AMB LLAVORS" },
    { icona: 23991, text: "HO TROBARÀS AL TEU HORT" },
  ],
  // Un per a cada minijoc (segons el "tipus" de l'activitat)
  comptar: [
    { icona: "llavor", text: "COMPTA LES LLAVORS" },
    { icona: 2714, text: "TOCA EL NÚMERO" },
    TORNA_A_PROVAR,
  ],
  triar: [
    { icona: 5063, text: "MIRA ELS TRES DIBUIXOS" },
    { icona: 2679, text: "TOCA EL QUE CREIX A LA TARDOR" },
    TORNA_A_PROVAR,
  ],
  classificar: [
    { icona: 4653, text: "MIRA DE QUIN COLOR ÉS LA FRUITA" },
    { icona: 3012, text: "ARROSSEGA-LA O TOCA LA CISTELLA DEL SEU COLOR" },
    TORNA_A_PROVAR,
  ],
  regar: [
    { icona: "altaveu", text: "ESCOLTA QUÈ DIU EN CARGOLET" },
    { icona: 2817, text: "PRIMER TRIA L'EINA" },
    { icona: 2619, text: "DESPRÉS TOCA LA PLANTA" },
    TORNA_A_PROVAR,
  ],
  ordenar: [
    { icona: "llavor", text: "LA LLAVOR JA HI ÉS" },
    { icona: 23991, text: "TOCA EL QUE VE DESPRÉS: BROT, PLANTA I FRUIT" },
    TORNA_A_PROVAR,
  ],
};

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

export function mostrarAjuda(context = "general") {
  const passos = PASSOS[context] ?? PASSOS.general;

  const finestra = dialeg({
    titol: "COM ES JUGA?",
    classe: "dialeg--ajuda",
    contingut: `
      <div class="ajuda">
        <div class="ajuda__cargolet"></div>
        <ol class="ajuda__passos">
          ${passos.map(({ icona, text }, i) => `
            <li class="ajuda__pas" data-i="${i}">
              <span class="ajuda__icona">${typeof icona === "number"
                ? `<img src="${urlPictograma(icona, 300)}" alt="">` : ICONES[icona]}</span>
              <span>${text}</span>
            </li>`).join("")}
        </ol>
      </div>`,
    botons: [{ text: "ENTESOS!", accio: callar }],
  });

  finestra.querySelector(".ajuda__cargolet").append(crearCargolet(120));

  // La veu llegeix els passos un a un i el que es llegeix s'il·lumina
  (async () => {
    for (const [i, { text }] of passos.entries()) {
      if (!finestra.isConnected) return;               // s'ha tancat
      const pas = finestra.querySelector(`[data-i="${i}"]`);
      pas.classList.add("ajuda__pas--actiu");
      await Promise.all([parlar(text), esperar(1200)]);
      pas.classList.remove("ajuda__pas--actiu");
    }
  })();
}
