// Pantalla 5 · EL MEU HORT: un hort per estació que creix gastant llavors
import { html, capcalera, dialeg } from "../utils.js";
import { obtenirMon } from "../services/api.js";
import { urlPictograma } from "../services/arasaac.js";
import { dibuixPlantes } from "../plantes.js";
import { crearCargolet, celebrar } from "../cargolet.js";
import { estat, desar } from "../estat.js";

// On va cada bancal dins de l'hort (centre, en %)
const POSICIONS = [
  { x: 20, y: 30 }, { x: 50, y: 25 }, { x: 80, y: 30 },
  { x: 34, y: 65 }, { x: 66, y: 65 },
];

const NOMS_FASE = ["", "BROT", "PLANTA", "FRUIT"];

export default {
  id: "hort",

  crear(nav, { estacio }) {
    const { alumne, partida } = estat;
    const hort = partida.hort(estacio);

    const pantalla = html(`
      <section>
        <div class="pantalla__cos pantalla__cos--compacte">
          <div class="hort">
            <svg class="hort__camp" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
              <path d="M40 90 Q30 30 110 26 L880 18 Q975 20 970 100 L978 470 Q982 540 900 538 L100 545 Q22 546 28 470Z" fill="#DDE3C6"/>
              <path d="M40 90 Q30 30 110 26 L880 18 Q975 20 970 100" fill="none" stroke="#C9D3A9" stroke-width="10" stroke-dasharray="4 26" stroke-linecap="round"/>
            </svg>
            <div class="hort__progres" aria-label="Hort completat">
              <span class="hort__barra"><span class="hort__ple"></span></span>
            </div>
          </div>
        </div>
      </section>
    `);
    const cap = capcalera(nav, `HORT DE ${estacio.toUpperCase()}`, { alumne, llavors: partida.llavors, ajuda: "hort" });
    pantalla.prepend(cap);

    const camp = pantalla.querySelector(".hort");

    // Actualitza el comptador de llavors de la capçalera
    const refrescarLlavors = () => {
      cap.querySelector(".llavors").lastChild.textContent = partida.llavors;
    };

    obtenirMon(estacio).then((mon) => {
      const { preus, bancals } = mon.hort;
      const idsBancals = bancals.map((b) => b.id);
      const idsMillores = mon.botiga.map((a) => a.id);

      // Decoracions comprades a la botiga, cadascuna al seu lloc
      mon.botiga.filter((article) => hort.teMillora(article.id)).forEach((article) => {
        const { x, y, mida } = article.lloc;
        camp.append(html(`
          <img class="hort__millora" src="${urlPictograma(article.pictograma, 300)}" alt="${article.nom}"
               style="left:${x}%; top:${y}%; width:${mida}%">`));
      });

      const refrescarProgres = () => {
        const percent = hort.percentatge(idsBancals, idsMillores);
        camp.querySelector(".hort__ple").style.width = `${percent}%`;
        camp.classList.toggle("hort--florit", percent === 100);
      };

      bancals.forEach((bancal, i) => {
        const { x, y } = POSICIONS[i];
        const element = html(`
          <button class="bancal" style="left:${x}%; top:${y}%; --gir:${i % 2 ? 1.5 : -1.5}deg"
                  aria-label="${bancal.cultiu}"></button>
        `);

        // Dibuixa el bancal segons la fase actual
        const pintar = () => {
          const preu = hort.preuSeguent(bancal.id, preus);
          element.innerHTML = `
            <span class="bancal__terra"></span>
            ${dibuixPlantes(bancal.cultiu, hort.fase(bancal.id))}
            ${preu === null
              ? `<span class="bancal__preu bancal__preu--fet">&#10003;</span>`
              : `<span class="bancal__preu"><span class="llavors__llavor"></span>${preu}</span>`}
          `;
        };
        pintar();

        element.addEventListener("click", () => {
          const preu = hort.preuSeguent(bancal.id, preus);
          if (preu === null) return celebrar(cargolet);   // ja està al màxim

          const seguent = hort.fase(bancal.id) + 1;

          if (partida.llavors < preu) {
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
            titol: `FEM CRÉIXER ${article(bancal.cultiu)}?`,
            contingut: `
              <div class="dialeg__planta"><span class="bancal__terra"></span>${dibuixPlantes(bancal.cultiu, seguent)}</div>
              <p class="llavors"><span class="llavors__llavor"></span>${preu}</p>`,
            botons: [
              { text: "NO", classe: "boto--suau" },
              {
                text: "SÍ",
                accio: () => {
                  partida.gastarLlavors(preu);
                  hort.creixer(bancal.id);
                  desar();
                  pintar();
                  element.classList.add("bancal--creix");
                  setTimeout(() => element.classList.remove("bancal--creix"), 700);
                  refrescarLlavors();
                  refrescarProgres();
                  celebrar(cargolet);
                },
              },
            ],
          });
        });

        camp.append(element);
      });

      // En Cargolet, el botó JUGAR i la botiga
      const cargolet = crearCargolet(110);
      cargolet.classList.add("hort__cargolet");
      camp.append(cargolet);

      const jugar = html(`<button class="boto boto--gegant hort__jugar">JUGAR</button>`);
      jugar.addEventListener("click", () => nav.anar("activitats", { estacio }));
      camp.append(jugar);

      const botiga = html(`
        <button class="boto boto--mostassa hort__botiga">
          <img src="${urlPictograma(35695, 300)}" alt=""> BOTIGA
        </button>
      `);
      botiga.addEventListener("click", () => nav.anar("botiga", { estacio }));
      camp.append(botiga);

      refrescarProgres();
    });

    return pantalla;
  },
};

// "LA CARBASSA", "L'ENCIAM"... (per al text del diàleg)
function article(cultiu) {
  const femenins = ["carbassa", "pastanaga", "col", "remolatxa"];
  const nom = cultiu.toUpperCase();
  return femenins.includes(cultiu) ? `LA ${nom}` : `L'${nom}`;
}
