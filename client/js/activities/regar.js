// Minijoc · REGAR I RECOLLIR
// En Cargolet demana "REGA LA PASTANAGA" o "RECULL EL TOMÀQUET".
// L'infant tria l'eina (regadora o cistella) i després toca la planta.
import { urlPictograma } from "../services/arasaac.js";

const ACCIONS = {
  regar:    { verb: "Rega",   eina: "LA REGADORA", serveix: "AMB LA REGADORA REGUEM" },
  recollir: { verb: "Recull", eina: "LA CISTELLA", serveix: "AMB LA CISTELLA RECOLLIM" },
};
const PLANTES_PER_PREGUNTA = 3;

const barrejar = (llista) => [...llista].sort(() => Math.random() - 0.5);

// "la pastanaga", "l'enciam", "el tomàquet"
const ambArticle = (planta) =>
  planta.article.endsWith("'") ? `${planta.article}${planta.nom}` : `${planta.article} ${planta.nom}`;

export default {
  tipus: "regar",

  generarPreguntes(nivell, activitat, quantes = 5) {
    const { plantes, eines } = activitat.contingut;
    return barrejar(plantes).slice(0, quantes).map((objectiu) => {
      const accio = Math.random() < 0.5 ? "regar" : "recollir";
      const altres = barrejar(plantes.filter((p) => p !== objectiu)).slice(0, PLANTES_PER_PREGUNTA - 1);
      return {
        enunciat: `${ACCIONS[accio].verb} ${ambArticle(objectiu)}`,
        accio,
        objectiu,
        eines,
        plantes: barrejar([objectiu, ...altres]),
      };
    });
  },

  pintar(pregunta, zona, { respondre, avisar }) {
    zona.innerHTML = `
      <div class="regar">
        <div class="regar__eines">
          ${Object.entries(pregunta.eines).map(([accio, pictograma]) => `
            <button class="eina" data-accio="${accio}">
              <img src="${urlPictograma(pictograma, 300)}" alt="" draggable="false">
              <span>${accio === "regar" ? "REGAR" : "RECOLLIR"}</span>
            </button>`).join("")}
        </div>
        <div class="regar__plantes">
          ${pregunta.plantes.map((planta, i) => `
            <button class="test" data-i="${i}" aria-label="${planta.nom}">
              <img src="${urlPictograma(planta.pictograma)}" alt="" draggable="false">
              <span class="test__olla"></span>
            </button>`).join("")}
        </div>
      </div>`;

    let einaTriada = null;

    // 1r pas: triar l'eina
    zona.querySelectorAll(".eina").forEach((boto) => {
      boto.addEventListener("click", () => {
        einaTriada = boto.dataset.accio;
        zona.querySelectorAll(".eina").forEach((b) => b.classList.toggle("eina--triada", b === boto));
      });
    });

    // 2n pas: tocar la planta
    zona.querySelectorAll(".test").forEach((test) => {
      test.addEventListener("click", () => {
        const planta = pregunta.plantes[Number(test.dataset.i)];

        if (!einaTriada) {
          avisar("PRIMER TRIA UNA EINA!");          // no compta com a error
          zona.querySelector(".regar__eines").classList.add("regar__eines--crida");
          setTimeout(() => zona.querySelector(".regar__eines")?.classList.remove("regar__eines--crida"), 900);
          return;
        }

        const bonaEina = einaTriada === pregunta.accio;
        const bonaPlanta = planta === pregunta.objectiu;

        if (bonaEina && bonaPlanta) {
          test.classList.add(pregunta.accio === "regar" ? "test--regat" : "test--recollit");
          respondre(true);
          return;
        }

        test.classList.remove("es-incorrecta");
        void test.offsetWidth;
        test.classList.add("es-incorrecta");
        setTimeout(() => test.classList.remove("es-incorrecta"), 900);

        if (!bonaEina) {
          respondre(false, `${ACCIONS[einaTriada].serveix}. AGAFA ${ACCIONS[pregunta.accio].eina}!`);
        } else {
          respondre(false, `AQUESTA ÉS ${ambArticle(planta).toUpperCase()}. BUSCA ${ambArticle(pregunta.objectiu).toUpperCase()}!`);
        }
      });
    });
  },
};
