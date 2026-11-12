// Minijoc · CICLE DE LA PLANTA
// Quatre forats: LLAVOR → BROT → PLANTA → FRUIT. La llavor ja hi és;
// l'infant toca (o arrossega) la carta que ve després.
import { escala } from "../escala.js";
import { dibuixPlantes } from "../plantes.js";

const FASES = ["LLAVOR", "BROT", "PLANTA", "FRUIT"];
const ARA_TENIM = ["UNA LLAVOR", "UN BROT", "UNA PLANTA"];

const barrejar = (llista) => [...llista].sort(() => Math.random() - 0.5);

function carta(cultiu, fase) {
  return `
    <span class="cicle__dibuix">
      <span class="bancal__terra"></span>
      ${dibuixPlantes(cultiu, fase)}
    </span>
    <span class="cicle__nom">${FASES[fase]}</span>`;
}

export default {
  tipus: "ordenar",

  generarPreguntes(nivell, activitat) {
    const { cultius, rondes = 3 } = activitat.contingut;
    return barrejar(cultius).slice(0, rondes).map((cultiu) => ({
      enunciat: `Ordena com creix ${cultiu === "enciam" ? "l'enciam" : `la ${cultiu}`}`,
      cultiu,
    }));
  },

  pintar(pregunta, zona, { respondre, avisar }) {
    const { cultiu } = pregunta;

    zona.innerHTML = `
      <div class="cicle">
        <div class="cicle__forats">
          ${FASES.map((_, i) => `
            <span class="cicle__forat ${i === 0 ? "cicle__forat--ple" : ""}" data-fase="${i}">
              ${i === 0 ? carta(cultiu, 0) : `<span class="cicle__numero">${i + 1}</span>`}
            </span>
            ${i < FASES.length - 1 ? `<span class="cicle__fletxa">&#10140;</span>` : ""}`).join("")}
        </div>
        <div class="cicle__cartes">
          ${barrejar([1, 2, 3]).map((fase) => `
            <button class="cicle__carta" data-fase="${fase}">${carta(cultiu, fase)}</button>`).join("")}
        </div>
      </div>`;

    let seguent = 1;          // la fase que toca col·locar ara

    function provar(cartaEl) {
      const fase = Number(cartaEl.dataset.fase);

      if (fase === seguent) {
        // Va al seu forat
        const forat = zona.querySelector(`.cicle__forat[data-fase="${fase}"]`);
        forat.innerHTML = carta(cultiu, fase);
        forat.classList.add("cicle__forat--ple", "cicle__forat--nou");
        cartaEl.remove();
        avisar(FASES[fase]);                    // en Cargolet diu la fase
        seguent++;
        if (seguent === FASES.length) respondre(true);
        return;
      }

      tornarAlLloc(cartaEl);
      cartaEl.classList.remove("es-incorrecta");
      void cartaEl.offsetWidth;
      cartaEl.classList.add("es-incorrecta");
      setTimeout(() => cartaEl.classList.remove("es-incorrecta"), 900);
      respondre(false, `ARA TENIM ${ARA_TENIM[seguent - 1]}. QUÈ VE DESPRÉS?`);
    }

    zona.querySelectorAll(".cicle__carta").forEach((cartaEl) => {
      let inici = null;
      let mogut = false;

      // Arrossegar (ratolí, dit o llapis). Si gairebé no s'ha mogut, compta com un toc.
      cartaEl.addEventListener("pointerdown", (e) => {
        inici = { x: e.clientX, y: e.clientY };
        mogut = false;
        cartaEl.setPointerCapture(e.pointerId);
      });
      cartaEl.addEventListener("pointermove", (e) => {
        if (!inici) return;
        const dx = e.clientX - inici.x;
        const dy = e.clientY - inici.y;
        if (Math.hypot(dx, dy) > 12) mogut = true;
        if (mogut) {
          cartaEl.classList.add("cicle__carta--agafada");
          cartaEl.style.translate = `${dx / escala()}px ${dy / escala()}px`;
        }
      });
      cartaEl.addEventListener("pointerup", (e) => {
        if (!inici) return;
        inici = null;
        cartaEl.classList.remove("cicle__carta--agafada");
        if (!mogut) return provar(cartaEl);                          // toc
        const sobreForats = document.elementsFromPoint(e.clientX, e.clientY)
          .some((el) => el.classList?.contains("cicle__forats"));
        if (sobreForats) provar(cartaEl);
        else tornarAlLloc(cartaEl);
      });
    });
  },
};

function tornarAlLloc(el) {
  el.style.transition = "translate 300ms cubic-bezier(.34, 1.56, .64, 1)";
  el.style.translate = "0 0";
  setTimeout(() => (el.style.transition = ""), 320);
}
