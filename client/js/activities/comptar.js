// Minijoc · COMPTAR LLAVORS
// Surten unes quantes llavors i l'infant toca el número correcte.

const RANGS = { I3: [1, 4], I4: [1, 6], I5: [3, 9] };   // de quant a quant es compta per classe
const NUMEROS = ["zero", "u", "dos", "tres", "quatre", "cinc", "sis", "set", "vuit", "nou", "deu"];

const aleatori = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const barrejar = (llista) => llista.sort(() => Math.random() - 0.5);

export default {
  tipus: "comptar",

  // Crea les preguntes de la partida segons la classe
  generarPreguntes(nivell, activitat, quantes = 5) {
    const [min, max] = RANGS[nivell] ?? RANGS.I4;
    const preguntes = [];
    for (let i = 0; i < quantes; i++) {
      let llavors;
      do { llavors = aleatori(min, max); } while (llavors === preguntes.at(-1)?.llavors);

      // Tres opcions diferents: la correcta i dues de properes
      const opcions = new Set([llavors]);
      while (opcions.size < 3) {
        const altre = llavors + aleatori(-2, 2);
        if (altre >= 1 && altre <= max + 1) opcions.add(altre);
      }
      preguntes.push({
        enunciat: "Quantes llavors hi ha?",
        llavors,
        opcions: [...opcions].sort((a, b) => a - b),
      });
    }
    return preguntes;
  },

  // Dibuixa la pregunta dins de "zona". Quan l'infant respon, crida respondre(correcta, pista)
  pintar(pregunta, zona, { respondre, parlar }) {
    zona.innerHTML = `
      <div class="comptar">
        <div class="comptar__safata"></div>
        <div class="comptar__opcions">
          ${pregunta.opcions.map((n) => `<button class="opcio-numero" data-n="${n}">${n}</button>`).join("")}
        </div>
      </div>`;

    // Llavors repartides per la safata, sense trepitjar-se (graella de 5 x 2 amb una mica de desordre)
    const safata = zona.querySelector(".comptar__safata");
    const llocs = barrejar([...Array(10).keys()]).slice(0, pregunta.llavors);
    llocs.forEach((lloc) => {
      const llavor = document.createElement("span");
      llavor.className = "comptar__llavor";
      llavor.style.left = `${10 + (lloc % 5) * 19 + aleatori(-3, 3)}%`;
      llavor.style.top = `${22 + Math.floor(lloc / 5) * 46 + aleatori(-6, 6)}%`;
      llavor.style.setProperty("--gir", `${aleatori(-40, 40)}deg`);
      safata.append(llavor);
    });

    zona.querySelectorAll(".opcio-numero").forEach((boto) => {
      boto.addEventListener("click", async () => {
        const triat = Number(boto.dataset.n);
        const correcta = triat === pregunta.llavors;
        boto.classList.add(correcta ? "es-correcta" : "es-incorrecta");

        if (correcta) {
          respondre(true);
        } else {
          respondre(false, "COMPTEM-LES JUNTS!");
          zona.querySelectorAll(".opcio-numero").forEach((b) => (b.disabled = true));
          await comptarJunts(safata, parlar);
          boto.classList.remove("es-incorrecta");
          zona.querySelectorAll(".opcio-numero").forEach((b) => (b.disabled = false));
        }
      });
    });
  },
};

// Pista: les llavors s'il·luminen una a una i la veu les compta
async function comptarJunts(safata, parlar) {
  const llavors = [...safata.querySelectorAll(".comptar__llavor")]
    .sort((a, b) => parseFloat(a.style.top) - parseFloat(b.style.top) || parseFloat(a.style.left) - parseFloat(b.style.left));
  for (const [i, llavor] of llavors.entries()) {
    llavor.dataset.numero = i + 1;
    llavor.classList.add("comptar__llavor--comptada");
    await Promise.all([parlar(NUMEROS[i + 1] ?? String(i + 1)), new Promise((r) => setTimeout(r, 650))]);
  }
  setTimeout(() => llavors.forEach((l) => l.classList.remove("comptar__llavor--comptada")), 800);
}
