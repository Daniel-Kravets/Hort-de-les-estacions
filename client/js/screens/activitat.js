// Pantalla 7 · ACTIVITAT: contenidor comú dels minijocs.
// Mostra la capçalera (sortir, progrés, llavors), en Cargolet amb la instrucció,
// carrega el minijoc i compta encerts, errors i llavors.
import { html, icones, dialeg, imatgeAlumne } from "../utils.js";
import { crearCargolet, celebrar } from "../cargolet.js";
import { parlar, callar } from "../services/veu.js";
import { mostrarAjuda } from "../ajuda.js";
import { estat, desar } from "../estat.js";
import comptar from "../activities/comptar.js";
import triar from "../activities/triar.js";
import classificar from "../activities/classificar.js";
import regar from "../activities/regar.js";
import ordenar from "../activities/ordenar.js";

// Minijocs disponibles, segons el "tipus" de l'activitat a mons.json
const MINIJOCS = { comptar, triar, classificar, regar, ordenar };

const LLAVORS_A_LA_PRIMERA = 2;
const LLAVORS_DESPRES_DERROR = 1;

export default {
  id: "activitat",

  crear(nav, { estacio, activitat }) {
    const { alumne, partida, classe } = estat;
    const minijoc = MINIJOCS[activitat.tipus];

    const pantalla = html(`
      <section>
        <header class="capcalera">
          <button class="boto boto--sortir" data-accio="sortir">SORTIR</button>
          <div class="progres" aria-label="Progrés"></div>
          <span class="capcalera__titol"></span>
          <div class="llavors"><span class="llavors__llavor"></span><span class="llavors__n">${partida.llavors}</span></div>
          <img class="capcalera__alumne" src="${imatgeAlumne(alumne)}" alt="${alumne.nom}">
          <button class="boto boto--ajuda boto--rodo" aria-label="Ajuda" data-accio="ajuda">?</button>
        </header>
        <div class="activitat-joc">
          <div class="activitat-joc__instruccio">
            <div class="activitat-joc__cargolet"></div>
            <div class="bafarada">
              <button class="boto boto--mostassa boto--rodo" aria-label="Escoltar" data-accio="escoltar">${icones.altaveu}</button>
              <span class="bafarada__text"></span>
            </div>
          </div>
          <div class="activitat-joc__zona"></div>
        </div>
      </section>
    `);

    const cargolet = crearCargolet(150);
    pantalla.querySelector(".activitat-joc__cargolet").append(cargolet);

    const textBafarada = pantalla.querySelector(".bafarada__text");
    const zona = pantalla.querySelector(".activitat-joc__zona");
    const progres = pantalla.querySelector(".progres");
    const comptador = pantalla.querySelector(".llavors");

    // Si encara no hi ha el minijoc programat
    if (!minijoc) {
      textBafarada.textContent = "AVIAT PODRÀS JUGAR-HI!";
      progres.remove();
      pantalla.querySelector('[data-accio="sortir"]').addEventListener("click", () => nav.tornar());
      return pantalla;
    }

    const preguntes = minijoc.generarPreguntes(classe, activitat);
    const inici = Date.now();
    let actual = 0;
    let errorsPregunta = 0;
    let errorsTotals = 0;
    let llavorsGuanyades = 0;

    progres.innerHTML = preguntes.map(() => `<span class="progres__pas"></span>`).join("");
    const passos = [...progres.children];

    const dir = (text) => {
      textBafarada.textContent = text;
      return parlar(text);
    };

    function mostrarPregunta() {
      errorsPregunta = 0;
      passos.forEach((pas, i) => {
        pas.classList.toggle("fet", i < actual);
        pas.classList.toggle("actual", i === actual);
      });
      const pregunta = preguntes[actual];
      minijoc.pintar(pregunta, zona, { respondre, parlar, avisar: dir });
      dir(pregunta.enunciat);
    }

    function respondre(correcta, pista) {
      if (!correcta) {
        errorsPregunta++;
        errorsTotals++;
        dir(pista ?? "GAIREBÉ! TORNA-HO A PROVAR");
        return;
      }

      // Encert: llavors, salt d'en Cargolet i següent pregunta
      const guanyades = errorsPregunta === 0 ? LLAVORS_A_LA_PRIMERA : LLAVORS_DESPRES_DERROR;
      llavorsGuanyades += guanyades;
      partida.afegirLlavors(guanyades);
      comptador.querySelector(".llavors__n").textContent = partida.llavors;
      comptador.classList.remove("ha-guanyat");
      void comptador.offsetWidth;
      comptador.classList.add("ha-guanyat");
      mostrarPremi(comptador, guanyades);

      celebrar(cargolet);
      zona.querySelectorAll("button").forEach((b) => (b.disabled = true));
      const felicitacio = ["MOLT BÉ!", "MOLT BONA FEINA!", "FANTÀSTIC!"][actual % 3];
      // Esperem que acabi de parlar, i com a mínim 1,4 s perquè l'infant vegi l'encert
      Promise.all([dir(felicitacio), espera(1400)]).then(() => {
        actual++;
        if (actual < preguntes.length) {
          mostrarPregunta();
        } else {
          acabar();
        }
      });
    }

    function acabar() {
      const estrelles = errorsTotals === 0 ? 3 : errorsTotals <= 2 ? 2 : 1;
      partida.desarEstrelles(activitat.id, estrelles);
      partida.registrarSessio({
        activitat: activitat.id,
        estacio,
        data: new Date().toISOString(),
        encerts: preguntes.length,
        errors: errorsTotals,
        estrelles,
        llavors: llavorsGuanyades,
        minuts: Math.max(1, Math.round((Date.now() - inici) / 60000)),
      });
      desar();
      nav.anar("resultats", { estacio, activitat, estrelles, llavorsGuanyades, total: preguntes.length });
    }

    // Botons de la capçalera i de la bafarada
    pantalla.querySelector('[data-accio="escoltar"]').addEventListener("click", () => parlar(textBafarada.textContent));
    pantalla.querySelector('[data-accio="ajuda"]').addEventListener("click", () => mostrarAjuda(activitat.tipus));
    const preguntarSortir = () => {
      if (document.querySelector(".dialeg-fons")) return;   // ja està preguntant
      dialeg({
        titol: "VOLS SORTIR?",
        contingut: `<p>LES LLAVORS QUE HAS GUANYAT ES GUARDEN</p>`,
        botons: [
          { text: "NO, SEGUIM", classe: "boto--suau" },
          { text: "SÍ, SORTIR", classe: "boto--sortir", accio: () => { callar(); desar(); nav.tornarA("hort"); } },
        ],
      });
    };
    pantalla.querySelector('[data-accio="sortir"]').addEventListener("click", preguntarSortir);
    nav.protegir(preguntarSortir);   // l'"enrere" del navegador també pregunta

    // Comencem quan la pantalla ja ha entrat
    setTimeout(mostrarPregunta, 450);
    return pantalla;
  },
};

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// "+2" que surt del comptador de llavors i puja
function mostrarPremi(comptador, n) {
  const premi = document.createElement("span");
  premi.className = "premi-llavors";
  premi.textContent = `+${n}`;
  comptador.append(premi);
  setTimeout(() => premi.remove(), 1000);
}
