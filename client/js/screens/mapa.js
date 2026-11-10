// Pantalla 4 · MAPA D'ESTACIONS: un camí amb les 4 estacions de l'any
import { html, capcalera, icones } from "../utils.js";
import { obtenirMons } from "../services/api.js";
import { crearCargolet } from "../cargolet.js";
import { estat } from "../estat.js";

// On cau cada parada sobre el camí (coordenades del dibuix, de 1000 x 460)
const PARADES = {
  tardor:    { x: 120, y: 360 },
  hivern:    { x: 370, y: 190 },
  primavera: { x: 640, y: 330 },
  estiu:     { x: 890, y: 160 },
};

// Dibuix de cada estació
const DIBUIXOS = {
  tardor: `<svg viewBox="0 0 48 48"><path d="M8 40C6 22 18 8 42 6c2 24-12 36-34 34z" fill="currentColor"/><path d="M8 40 32 16M18 30h8M22 26v-8" stroke="#B0813C" stroke-width="3" stroke-linecap="round"/></svg>`,
  hivern: `<svg viewBox="0 0 48 48" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M24 6v36M8.4 15l31.2 18M8.4 33l31.2-18"/><path d="M19 9l5 4 5-4M19 39l5-4 5 4" fill="none"/></svg>`,
  primavera: `<svg viewBox="0 0 48 48" fill="currentColor"><circle cx="24" cy="12" r="7"/><circle cx="35" cy="20" r="7"/><circle cx="31" cy="33" r="7"/><circle cx="17" cy="33" r="7"/><circle cx="13" cy="20" r="7"/><circle cx="24" cy="24" r="6" fill="#D9A55B"/></svg>`,
  estiu: `<svg viewBox="0 0 48 48" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linecap="round"><circle cx="24" cy="24" r="9" stroke="none"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M10 38l4-4M34 14l4-4"/></svg>`,
};

const CAMI = `
  <svg class="mapa__cami" viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden="true">
    <path d="M20 400 C 60 390, 80 370, 120 360 C 220 335, 270 190, 370 190 C 480 190, 530 335, 640 330 C 760 325, 790 165, 890 160 C 930 158, 960 140, 990 120"
          fill="none" stroke="#EEDFCB" stroke-width="54" stroke-linecap="round"/>
    <path d="M20 400 C 60 390, 80 370, 120 360 C 220 335, 270 190, 370 190 C 480 190, 530 335, 640 330 C 760 325, 790 165, 890 160 C 930 158, 960 140, 990 120"
          fill="none" stroke="#D8C3A4" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 22"/>
  </svg>`;

export default {
  id: "mapa",

  crear(nav) {
    const { alumne, partida } = estat;

    const pantalla = html(`
      <section>
        <div class="pantalla__cos pantalla__cos--compacte">
          <h1>TRIA UNA ESTACIÓ</h1>
          <div class="mapa">${CAMI}</div>
        </div>
      </section>
    `);
    pantalla.prepend(capcalera(nav, "", { alumne, llavors: partida.llavors }));

    const mapa = pantalla.querySelector(".mapa");

    obtenirMons().then((mons) => {
      mons.forEach((mon) => {
        const { x, y } = PARADES[mon.id];
        const parada = html(`
          <button class="parada parada--${mon.id} ${mon.disponible ? "" : "parada--bloquejada"}"
                  style="left:${x / 10}%; top:${(y / 460) * 100}%">
            <span class="parada__cercle">
              ${DIBUIXOS[mon.id]}
              ${mon.disponible ? "" : `<span class="parada__cadenat">${icones.cadenat}</span>`}
            </span>
            <span class="parada__nom">${mon.nom}</span>
          </button>
        `);

        parada.addEventListener("click", () => {
          if (mon.disponible) {
            nav.anar("hort", { estacio: mon.id });
          } else {
            avisar(parada, "AVIAT!");
          }
        });
        mapa.append(parada);
      });

      // En Cargolet espera al costat de la primera estació
      const cargolet = crearCargolet(130);
      cargolet.classList.add("mapa__cargolet");
      mapa.append(cargolet);
    });

    return pantalla;
  },
};

// Bafarada petita que surt sobre una parada bloquejada i desapareix sola
function avisar(parada, text) {
  parada.classList.remove("es-incorrecta");
  void parada.offsetWidth;
  parada.classList.add("es-incorrecta");
  if (parada.querySelector(".parada__avis")) return;

  const avis = html(`<span class="bafarada parada__avis">${text}</span>`);
  parada.append(avis);
  setTimeout(() => avis.remove(), 1800);
}
