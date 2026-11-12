// Pantalla 6 · ACTIVITATS de l'estació (s'hi arriba amb el botó JUGAR de l'hort)
import { html, capcalera } from "../utils.js";
import { obtenirMon } from "../services/api.js";
import { urlPictograma } from "../services/arasaac.js";
import { estat } from "../estat.js";

export default {
  id: "activitats",

  crear(nav, { estacio }) {
    const { alumne, partida } = estat;

    const pantalla = html(`
      <section>
        <div class="pantalla__cos pantalla__cos--compacte">
          <h1>A QUÈ JUGUEM?</h1>
          <div class="activitats"><p class="carregant">UN MOMENT...</p></div>
        </div>
      </section>
    `);
    pantalla.prepend(capcalera(nav, "", { alumne, llavors: partida.llavors, ajuda: "activitats" }));

    const llista = pantalla.querySelector(".activitats");

    obtenirMon(estacio).then((mon) => {
      llista.innerHTML = "";
      mon.activitats.forEach((activitat) => {
        const estrelles = partida.millorsEstrelles(activitat.id);
        const targeta = html(`
          <button class="targeta activitat">
            <span class="picto"><img src="${urlPictograma(activitat.pictograma)}" alt=""></span>
            <span class="activitat__nom">${activitat.nom}</span>
            <span class="estrelles estrelles--petites">
              ${[1, 2, 3].map((n) => `<span class="estrella ${n <= estrelles ? "guanyada" : ""}"></span>`).join("")}
            </span>
          </button>
        `);
        targeta.addEventListener("click", () => nav.anar("activitat", { estacio, activitat }));
        llista.append(targeta);
      });
    });

    return pantalla;
  },
};
