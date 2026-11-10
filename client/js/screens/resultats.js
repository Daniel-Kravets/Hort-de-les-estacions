// Pantalla 8 · RESULTATS d'una activitat
import { html } from "../utils.js";
import { crearCargolet, celebrar } from "../cargolet.js";
import { parlar } from "../services/veu.js";
import { estat } from "../estat.js";

const FRASES = { 3: "PERFECTE!", 2: "MOLT BÉ!", 1: "HO HAS ACONSEGUIT!" };

export default {
  id: "resultats",

  crear(nav, { estacio, activitat, estrelles, llavorsGuanyades }) {
    const pantalla = html(`
      <section>
        <div class="pantalla__cos">
          <h1>${FRASES[estrelles]}</h1>
          <div class="resultats__premi">
            <div class="resultats__cargolet"></div>
            <div class="resultats__dades">
              <div class="estrelles estrelles--grans">
                ${[1, 2, 3].map((n) => `<span class="estrella ${n <= estrelles ? "guanyada" : ""}"></span>`).join("")}
              </div>
              <p class="llavors"><span class="llavors__llavor"></span>+${llavorsGuanyades}</p>
            </div>
          </div>
          <div class="resultats__botons">
            <button class="boto boto--terra" data-accio="repetir">TORNAR A JUGAR</button>
            <button class="boto boto--gegant" data-accio="hort">A L'HORT!</button>
          </div>
        </div>
      </section>
    `);

    const cargolet = crearCargolet(200);
    pantalla.querySelector(".resultats__cargolet").append(cargolet);
    setTimeout(() => celebrar(cargolet), 500);
    setTimeout(() => parlar(`${FRASES[estrelles]} Has guanyat ${llavorsGuanyades} llavors`), 500);

    pantalla.querySelector('[data-accio="repetir"]').addEventListener("click", () => nav.anar("activitat", { estacio, activitat }));
    pantalla.querySelector('[data-accio="hort"]').addEventListener("click", () => nav.tornarA("hort"));
    return pantalla;
  },
};
