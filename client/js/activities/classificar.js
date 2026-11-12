// Minijoc · CLASSIFICAR FRUITES PER COLOR
// Surt una fruita i l'infant la porta a la cistella del seu color:
// la pot arrossegar amb el dit o tocar directament la cistella.
import { escala } from "../escala.js";
import { urlPictograma } from "../services/arasaac.js";

const NOM_COLOR = { vermell: "VERMELLA", groc: "GROGA", verd: "VERDA" };   // "la cistella VERMELLA"

const barrejar = (llista) => [...llista].sort(() => Math.random() - 0.5);
const ambArticle = (fruita) => `${fruita.article} ${fruita.nom}`.toUpperCase();

export default {
  tipus: "classificar",

  generarPreguntes(nivell, activitat, quantes = 5) {
    const { fruites, colors, cistella } = activitat.contingut;
    return barrejar(fruites).slice(0, quantes).map((fruita) => ({
      enunciat: `Posa ${fruita.article} ${fruita.nom} a la cistella del seu color`,
      fruita,
      colors,
      cistella,
    }));
  },

  pintar(pregunta, zona, { respondre }) {
    const { fruita, colors, cistella } = pregunta;

    zona.innerHTML = `
      <div class="classificar">
        <div class="classificar__origen">
          <span class="picto classificar__fruita" style="--gir:-3deg">
            <img src="${urlPictograma(fruita.pictograma)}" alt="${fruita.nom}" draggable="false">
          </span>
        </div>
        <div class="classificar__cistelles">
          ${colors.map((color) => `
            <button class="cistella cistella--${color}" data-color="${color}" aria-label="Cistella ${NOM_COLOR[color]}">
              <span class="cistella__taca"></span>
              <img src="${urlPictograma(cistella, 300)}" alt="" draggable="false">
            </button>`).join("")}
        </div>
      </div>`;

    const peca = zona.querySelector(".classificar__fruita");
    let acabat = false;

    // Deixa la fruita a una cistella i comprova si és la bona
    function deixar(cistellaEl) {
      if (acabat) return;
      if (cistellaEl.dataset.color === fruita.color) {
        acabat = true;
        volarFins(peca, cistellaEl);
        cistellaEl.classList.add("cistella--encert");
        respondre(true);
      } else {
        tornarAlLloc(peca);
        cistellaEl.classList.remove("es-incorrecta");
        void cistellaEl.offsetWidth;
        cistellaEl.classList.add("es-incorrecta");
        respondre(false,
          `AQUESTA CISTELLA ÉS ${NOM_COLOR[cistellaEl.dataset.color]}. DE QUIN COLOR ÉS ${ambArticle(fruita)}?`);
      }
    }

    // Opció 1: tocar la cistella directament
    zona.querySelectorAll(".cistella").forEach((c) => c.addEventListener("click", () => deixar(c)));

    // Opció 2: arrossegar la fruita (ratolí, dit o llapis: Pointer Events)
    let inici = null;
    peca.addEventListener("pointerdown", (e) => {
      if (acabat) return;
      inici = { x: e.clientX, y: e.clientY };
      peca.setPointerCapture(e.pointerId);
      peca.classList.add("classificar__fruita--agafada");
    });
    peca.addEventListener("pointermove", (e) => {
      if (!inici) return;
      peca.style.translate = `${(e.clientX - inici.x) / escala()}px ${(e.clientY - inici.y) / escala()}px`;
      // Il·lumina la cistella que hi ha a sota
      const sota = cistellaSota(e.clientX, e.clientY);
      zona.querySelectorAll(".cistella").forEach((c) => c.classList.toggle("cistella--sobre", c === sota));
    });
    peca.addEventListener("pointerup", (e) => {
      if (!inici) return;
      inici = null;
      peca.classList.remove("classificar__fruita--agafada");
      zona.querySelectorAll(".cistella").forEach((c) => c.classList.remove("cistella--sobre"));
      const sota = cistellaSota(e.clientX, e.clientY);
      if (sota) deixar(sota);
      else tornarAlLloc(peca);
    });

    function cistellaSota(x, y) {
      return document.elementsFromPoint(x, y).find((el) => el.classList?.contains("cistella")) ?? null;
    }
  },
};

function tornarAlLloc(peca) {
  peca.style.transition = "translate 300ms cubic-bezier(.34, 1.56, .64, 1)";
  peca.style.translate = "0 0";
  setTimeout(() => (peca.style.transition = ""), 320);
}

// La fruita vola fins a dins de la cistella i s'hi fa petita
function volarFins(peca, cistellaEl) {
  const a = peca.getBoundingClientRect();
  const b = cistellaEl.getBoundingClientRect();
  const actual = (peca.style.translate || "0px 0px").split(" ").map(parseFloat);
  const dx = (actual[0] || 0) + ((b.left + b.width / 2) - (a.left + a.width / 2)) / escala();
  const dy = (actual[1] || 0) + ((b.top + b.height / 3) - (a.top + a.height / 2)) / escala();
  peca.style.transition = "translate 450ms ease-in, scale 450ms ease-in";
  peca.style.translate = `${dx}px ${dy}px`;
  peca.style.scale = "0.45";
}
