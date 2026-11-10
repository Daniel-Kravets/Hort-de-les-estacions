// Pantalla 1 · INICI
import { html } from "../utils.js";
import { crearCargolet, celebrar } from "../cargolet.js";

export default {
  id: "inici",

  crear(nav) {
    const pantalla = html(`
      <section class="pantalla-inici">
        <div class="pantalla__cos">
          <h1 class="inici__titol">L'HORT<span>DE LES ESTACIONS</span></h1>
          <div class="inici__mascota">
            <p class="bafarada inici__hola">HOLA!</p>
          </div>
          <button class="boto boto--gegant" data-accio="jugar">JUGAR</button>
        </div>
        <button class="boto boto--suau inici__docent" data-accio="docent">ACCÉS DOCENT</button>
      </section>
    `);

    // En Cargolet saluda i salta si el toquen
    const cargolet = crearCargolet(260);
    cargolet.addEventListener("click", () => celebrar(cargolet));
    pantalla.querySelector(".inici__mascota").append(cargolet);

    pantalla.querySelector('[data-accio="jugar"]').addEventListener("click", () => nav.anar("triar-classe"));
    pantalla.querySelector('[data-accio="docent"]').addEventListener("click", () => nav.anar("acces-docent"));
    return pantalla;
  },
};
