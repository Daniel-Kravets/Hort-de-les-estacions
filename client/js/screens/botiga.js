// Pantalla 9 · BOTIGA DE L'HORT: decoracions que es compren amb llavors
import { html, capcalera, dialeg } from "../utils.js";
import { obtenirMon } from "../services/api.js";
import { urlPictograma } from "../services/arasaac.js";
import { crearCargolet, celebrar } from "../cargolet.js";
import { parlar } from "../services/veu.js";
import { estat, desar } from "../estat.js";

// "L'ESPANTAOCELLS", "LA FONT", "EL BANC"
const ambArticle = (a) => (a.article.endsWith("'") ? `${a.article}${a.nom}` : `${a.article} ${a.nom}`).toUpperCase();

export default {
  id: "botiga",

  crear(nav, { estacio }) {
    const { alumne, partida } = estat;
    const hort = partida.hort(estacio);

    const pantalla = html(`
      <section>
        <div class="pantalla__cos pantalla__cos--compacte">
          <div class="botiga__cap">
            <div class="botiga__cargolet"></div>
            <p class="bafarada">QUÈ VOLS PER AL TEU HORT?</p>
          </div>
          <div class="botiga"><p class="carregant">UN MOMENT...</p></div>
        </div>
      </section>
    `);
    const cap = capcalera(nav, "BOTIGA", { alumne, llavors: partida.llavors, ajuda: "botiga" });
    pantalla.prepend(cap);

    const cargolet = crearCargolet(120);
    pantalla.querySelector(".botiga__cargolet").append(cargolet);
    const llista = pantalla.querySelector(".botiga");

    obtenirMon(estacio).then((mon) => {
      llista.innerHTML = "";

      mon.botiga.forEach((article) => {
        const targeta = html(`<button class="targeta article" aria-label="${article.nom}"></button>`);

        const pintar = () => {
          const comprat = hort.teMillora(article.id);
          const falten = article.preu - partida.llavors;
          targeta.classList.toggle("article--comprat", comprat);
          targeta.classList.toggle("article--car", !comprat && falten > 0);
          targeta.innerHTML = `
            <span class="picto"><img src="${urlPictograma(article.pictograma, 300)}" alt=""></span>
            <span class="article__info">
              <span class="article__nom">${article.nom}</span>
              ${comprat
                ? `<span class="article__estat article__estat--teu">&#10003; JA ÉS TEU</span>`
                : `<span class="article__estat"><span class="llavors__llavor"></span>${article.preu}</span>`}
            </span>`;
        };
        pintar();

        targeta.addEventListener("click", () => {
          if (hort.teMillora(article.id)) return celebrar(cargolet);

          if (partida.llavors < article.preu) {
            parlar("Et falten llavors! Juga per guanyar-ne més");
            dialeg({
              titol: "ET FALTEN LLAVORS!",
              contingut: `<p>JUGA PER GUANYAR-NE MÉS</p>`,
              botons: [
                { text: "TORNAR", classe: "boto--suau" },
                { text: "JUGAR", accio: () => nav.anar("activitats", { estacio }) },
              ],
            });
            return;
          }

          dialeg({
            titol: `VOLS ${ambArticle(article)}?`,
            contingut: `
              <span class="picto dialeg__picto"><img src="${urlPictograma(article.pictograma, 300)}" alt=""></span>
              <p class="llavors"><span class="llavors__llavor"></span>${article.preu}</p>`,
            botons: [
              { text: "NO", classe: "boto--suau" },
              {
                text: "SÍ",
                accio: () => {
                  partida.comprar(estacio, article);
                  desar();
                  llista.querySelectorAll(".article").forEach((t) => t.dispatchEvent(new Event("repintar")));
                  cap.querySelector(".llavors").lastChild.textContent = partida.llavors;
                  celebrar(cargolet);
                  parlar("Ja és al teu hort!");
                  dialeg({
                    titol: "JA ÉS AL TEU HORT!",
                    contingut: `<span class="picto dialeg__picto"><img src="${urlPictograma(article.pictograma, 300)}" alt=""></span>`,
                    botons: [
                      { text: "SEGUIR COMPRANT", classe: "boto--suau" },
                      { text: "A L'HORT!", accio: () => nav.tornarA("hort") },
                    ],
                  });
                },
              },
            ],
          });
        });

        targeta.addEventListener("repintar", pintar);   // quan canvien les llavors, totes es tornen a pintar
        llista.append(targeta);
      });
    });

    return pantalla;
  },
};
