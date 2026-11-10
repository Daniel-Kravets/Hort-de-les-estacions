// Pantalla 2 · TRIA LA CLASSE (I3, I4, I5)
import { html, capcalera } from "../utils.js";

const CLASSES = ["I3", "I4", "I5"];

export default {
  id: "triar-classe",

  crear(nav) {
    const pantalla = html(`
      <section>
        <div class="pantalla__cos">
          <h1>QUINA ÉS LA TEVA CLASSE?</h1>
          <div class="classes">
            ${CLASSES.map((classe) => `
              <button class="targeta classe classe--${classe.toLowerCase()}" data-classe="${classe}">
                <span class="classe__cercle">${classe}</span>
              </button>
            `).join("")}
          </div>
        </div>
      </section>
    `);

    pantalla.prepend(capcalera(nav, ""));

    pantalla.querySelectorAll("[data-classe]").forEach((boto) => {
      boto.addEventListener("click", () => nav.anar("qui-ets", { classe: boto.dataset.classe }));
    });
    return pantalla;
  },
};
