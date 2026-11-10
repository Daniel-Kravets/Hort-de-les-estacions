// Pantalla 3 · QUI ETS? L'infant toca el seu animal (a la versió final, la seva foto)
import { html, capcalera, imatgeAlumne } from "../utils.js";
import { obtenirGrup } from "../services/api.js";
import { començarPartida } from "../estat.js";

export default {
  id: "qui-ets",

  crear(nav, { classe }) {
    const pantalla = html(`
      <section>
        <div class="pantalla__cos pantalla__cos--compacte">
          <h1>QUI ETS?</h1>
          <div class="alumnes"><p class="carregant">UN MOMENT...</p></div>
        </div>
      </section>
    `);
    pantalla.prepend(capcalera(nav, classe));

    const llista = pantalla.querySelector(".alumnes");

    obtenirGrup(classe)
      .then((grup) => {
        llista.innerHTML = grup.alumnes.map((alumne) => `
          <button class="targeta alumne" data-id="${alumne.id}">
            <span class="picto"><img src="${imatgeAlumne(alumne)}" alt="${alumne.avatar.animal}"></span>
            <span class="alumne__nom">${alumne.nom}</span>
          </button>
        `).join("");

        llista.querySelectorAll(".alumne").forEach((boto) => {
          const alumne = grup.alumnes.find((a) => a.id === boto.dataset.id);
          boto.addEventListener("click", () => {
            començarPartida(classe, alumne);
            nav.anar("mapa");
          });
        });
      })
      .catch((error) => {
        console.error(error);
        llista.innerHTML = `<p class="carregant">NO ES POT CARREGAR LA CLASSE</p>`;
      });

    return pantalla;
  },
};
