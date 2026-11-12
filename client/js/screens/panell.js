// Pantalla 11 · PANELL DOCENT: progrés de la classe, detall de cada alumne, CSV i reiniciar
import { html, dialeg, imatgeAlumne } from "../utils.js";
import { obtenirMon, obtenirProgresGrup, reiniciarPartida, docentActual, tancarSessioDocent } from "../services/api.js";
import { urlPictograma } from "../services/arasaac.js";
import { Partida } from "../models/Partida.js";

const ESTACIO = "tardor";           // al MVP només hi ha contingut de Tardor

const estrelles = (n) => (n ? "★".repeat(n) + "☆".repeat(3 - n) : "—");
const dia = (iso) => (iso ? new Date(iso).toLocaleDateString("ca-ES", { day: "2-digit", month: "2-digit" }) : "—");
const diaHora = (iso) => new Date(iso).toLocaleString("ca-ES", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

// Resum d'un alumne per a la taula
function resumir(alumne, mon) {
  const partida = new Partida(alumne.partida);
  const historial = partida.historial;
  const errors = historial.reduce((s, h) => s + h.errors, 0);
  return {
    alumne,
    partida,
    estrelles: mon.activitats.map((a) => partida.millorsEstrelles(a.id)),
    llavors: partida.llavors,
    hort: partida.hort(ESTACIO).percentatge(mon.hort.bancals.map((b) => b.id), mon.botiga.map((a) => a.id)),
    partides: historial.length,
    errors,
    minuts: historial.reduce((s, h) => s + h.minuts, 0),
    ultim: historial.at(-1)?.data,
    // A revisar: almenys 2 partides i una mitjana de 3 errors o més per partida
    revisar: historial.length >= 2 && errors / historial.length >= 3,
  };
}

export default {
  id: "panell",

  crear(nav) {
    const docent = docentActual();
    if (!docent) {
      setTimeout(() => nav.anar("acces-docent"));
      return html(`<section></section>`);
    }

    const pantalla = html(`
      <section class="panell">
        <header class="capcalera">
          <button class="boto boto--sortir" data-accio="sortir">SORTIR</button>
          <p class="capcalera__titol">PANELL DOCENT · ${docent.nom}</p>
        </header>
        <div class="panell__cos">
          <div class="panell__eines">
            <div class="panell__classes">
              ${docent.grups.map((g) => `<button class="boto boto--suau panell__classe" data-grup="${g}">${g}</button>`).join("")}
            </div>
            <button class="boto boto--ajuda" data-accio="csv">DESCARREGAR CSV</button>
          </div>
          <div class="panell__taula"><p class="carregant">UN MOMENT...</p></div>
          <p class="panell__llegenda"><span class="panell__marca"></span> MOLTS ERRORS: CAL REVISAR · TOCA UN ALUMNE PER VEURE EL DETALL</p>
        </div>
      </section>
    `);

    const zona = pantalla.querySelector(".panell__taula");
    let mon = null;
    let grupActual = docent.grups[0];
    let files = [];

    async function carregar(idGrup) {
      grupActual = idGrup;
      pantalla.querySelectorAll(".panell__classe").forEach((b) => b.classList.toggle("panell__classe--activa", b.dataset.grup === idGrup));
      zona.innerHTML = `<p class="carregant">UN MOMENT...</p>`;
      try {
        mon ??= await obtenirMon(ESTACIO);
        const grup = await obtenirProgresGrup(idGrup);
        files = grup.alumnes.map((a) => resumir(a, mon));
        pintarTaula();
      } catch (error) {
        if (error.codi === 401) return nav.anar("acces-docent");   // sessió caducada
        zona.innerHTML = `<p class="carregant">NO ES PODEN CARREGAR LES DADES</p>`;
      }
    }

    function pintarTaula() {
      zona.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>ALUMNE</th>
              ${mon.activitats.map((a) => `<th title="${a.nom}"><img src="${urlPictograma(a.pictograma, 300)}" alt="${a.nom}"></th>`).join("")}
              <th>LLAVORS</th><th>HORT</th><th>PARTIDES</th><th>ERRORS</th><th>MINUTS</th><th>ÚLTIM DIA</th>
            </tr>
          </thead>
          <tbody>
            ${files.map((f, i) => `
              <tr data-i="${i}" class="${f.revisar ? "fila--revisar" : ""}" tabindex="0">
                <td><span class="panell__alumne"><img src="${imatgeAlumne(f.alumne)}" alt="">${f.alumne.nom}</span></td>
                ${f.estrelles.map((n) => `<td class="panell__estrelles">${estrelles(n)}</td>`).join("")}
                <td>${f.llavors}</td>
                <td class="panell__hort"><span class="panell__barra"><span style="width:${f.hort}%"></span></span>${f.hort}%</td>
                <td>${f.partides}</td><td>${f.errors}</td><td>${f.minuts}</td><td>${dia(f.ultim)}</td>
              </tr>`).join("")}
          </tbody>
        </table>`;

      zona.querySelectorAll("tbody tr").forEach((tr) => {
        const obrir = () => detall(files[Number(tr.dataset.i)]);
        tr.addEventListener("click", obrir);
        tr.addEventListener("keydown", (e) => e.key === "Enter" && obrir());
      });
    }

    function detall(fila) {
      const nomActivitat = (id) => mon.activitats.find((a) => a.id === id)?.nom ?? id;
      const historial = [...fila.partida.historial].reverse();
      dialeg({
        titol: fila.alumne.nom,
        classe: "dialeg--ample",
        contingut: historial.length === 0
          ? `<p>ENCARA NO HA JUGAT CAP PARTIDA</p>`
          : `<div class="panell__historial"><table>
              <thead><tr><th>DIA</th><th>ACTIVITAT</th><th>ERRORS</th><th>ESTRELLES</th><th>LLAVORS</th><th>MINUTS</th></tr></thead>
              <tbody>${historial.map((h) => `
                <tr><td>${diaHora(h.data)}</td><td>${nomActivitat(h.activitat)}</td><td>${h.errors}</td>
                    <td class="panell__estrelles">${estrelles(h.estrelles)}</td><td>+${h.llavors}</td><td>${h.minuts}</td></tr>`).join("")}
              </tbody></table></div>`,
        botons: [
          { text: "REINICIAR PARTIDA", classe: "boto--sortir", accio: () => confirmarReinici(fila) },
          { text: "TANCAR" },
        ],
      });
    }

    function confirmarReinici(fila) {
      dialeg({
        titol: `REINICIAR LA PARTIDA DE ${fila.alumne.nom}?`,
        contingut: `<p>ES PERDRAN LES LLAVORS, L'HORT I L'HISTORIAL. NO ES POT DESFER.</p>`,
        botons: [
          { text: "NO", classe: "boto--suau" },
          {
            text: "SÍ, REINICIAR",
            classe: "boto--sortir",
            accio: async () => {
              await reiniciarPartida(fila.alumne.id);
              carregar(grupActual);
            },
          },
        ],
      });
    }

    function descarregarCSV() {
      const capcaleres = ["Alumne", "Classe", ...mon.activitats.map((a) => `${a.nom} (estrelles)`),
        "Llavors", "Hort %", "Partides", "Errors", "Minuts", "Últim dia"];
      const linies = files.map((f) => [f.alumne.nom, grupActual, ...f.estrelles, f.llavors, f.hort,
        f.partides, f.errors, f.minuts, dia(f.ultim)]);
      // Separador ";" i BOM perquè l'Excel en català/castellà ho obri bé
      const csv = "﻿" + [capcaleres, ...linies].map((l) => l.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(";")).join("\r\n");
      const enllac = document.createElement("a");
      enllac.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      enllac.download = `progres-${grupActual}-${new Date().toISOString().slice(0, 10)}.csv`;
      enllac.click();
      URL.revokeObjectURL(enllac.href);
    }

    pantalla.querySelectorAll(".panell__classe").forEach((b) => b.addEventListener("click", () => carregar(b.dataset.grup)));
    pantalla.querySelector('[data-accio="csv"]').addEventListener("click", () => files.length && descarregarCSV());
    pantalla.querySelector('[data-accio="sortir"]').addEventListener("click", async () => {
      await tancarSessioDocent();
      nav.tornarA("inici");
    });

    carregar(grupActual);
    return pantalla;
  },
};
