// Minijoc · QUÈ CREIX A LA TARDOR?
// Surten 3 aliments i l'infant toca el que és de l'estació.
import { urlPictograma } from "../services/arasaac.js";

const DE_ESTACIO = { tardor: "DE TARDOR", hivern: "D'HIVERN", primavera: "DE PRIMAVERA", estiu: "D'ESTIU" };
const OPCIONS_PER_PREGUNTA = 3;

const barrejar = (llista) => [...llista].sort(() => Math.random() - 0.5);

// "LA SÍNDRIA", "EL MELÓ", "ELS BOLETS"
const ambArticle = (aliment) => `${aliment.article} ${aliment.nom}`.toUpperCase();

export default {
  tipus: "triar",

  generarPreguntes(nivell, activitat, quantes = 5) {
    const { estacio, aliments } = activitat.contingut;
    const correctes = barrejar(aliments.filter((a) => a.estacio === estacio)).slice(0, quantes);
    const altres = aliments.filter((a) => a.estacio !== estacio);

    return correctes.map((correcte) => ({
      enunciat: `Què creix a la ${estacio}?`,
      estacio,
      correcte,
      opcions: barrejar([correcte, ...barrejar(altres).slice(0, OPCIONS_PER_PREGUNTA - 1)]),
    }));
  },

  pintar(pregunta, zona, { respondre }) {
    zona.innerHTML = `
      <div class="triar">
        ${pregunta.opcions.map((aliment, i) => `
          <button class="opcio" data-i="${i}">
            <span class="picto" style="--gir:${[-2, 1.5, -1][i]}deg">
              <img src="${urlPictograma(aliment.pictograma)}" alt="">
            </span>
            <span class="opcio__nom">${aliment.nom}</span>
          </button>`).join("")}
      </div>`;

    zona.querySelectorAll(".opcio").forEach((boto) => {
      boto.addEventListener("click", () => {
        const triat = pregunta.opcions[Number(boto.dataset.i)];

        if (triat === pregunta.correcte) {
          boto.classList.add("es-correcta");
          respondre(true);
          return;
        }

        // Error: diem de quina estació és el que ha tocat
        boto.classList.remove("es-incorrecta");
        void boto.offsetWidth;
        boto.classList.add("es-incorrecta");
        setTimeout(() => boto.classList.remove("es-incorrecta"), 900);
        respondre(false,
          `${ambArticle(triat)} ${triat.nom.endsWith("s") ? "SÓN" : "ÉS"} ${DE_ESTACIO[triat.estacio]}. ` +
          `BUSCA'N UNA ${DE_ESTACIO[pregunta.estacio]}!`);
      });
    });
  },
};
