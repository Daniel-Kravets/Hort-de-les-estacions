// Pantalla 10 · ACCÉS DOCENT: usuari i contrasenya
import { html, capcalera } from "../utils.js";
import { iniciarSessioDocent } from "../services/api.js";

export default {
  id: "acces-docent",

  crear(nav) {
    const pantalla = html(`
      <section>
        <div class="pantalla__cos pantalla__cos--compacte">
          <form class="targeta acces" autocomplete="on">
            <h2>ACCÉS DOCENT</h2>
            <label class="camp">
              <span>USUARI</span>
              <input name="usuari" autocomplete="username" required>
            </label>
            <label class="camp">
              <span>CONTRASENYA</span>
              <input name="contrasenya" type="password" autocomplete="current-password" required>
            </label>
            <p class="acces__error" role="alert"></p>
            <button class="boto" type="submit">ENTRAR</button>
          </form>
        </div>
      </section>
    `);
    pantalla.prepend(capcalera(nav, ""));

    const form = pantalla.querySelector("form");
    const error = pantalla.querySelector(".acces__error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      error.textContent = "";
      const boto = form.querySelector("button");
      boto.disabled = true;
      try {
        await iniciarSessioDocent(form.usuari.value.trim(), form.contrasenya.value);
        nav.anar("panell");
      } catch (err) {
        error.textContent = err.codi === 401 || err.codi === 429 ? err.message : "NO ES POT CONNECTAR AMB EL SERVIDOR";
        form.contrasenya.value = "";           // l'usuari es queda escrit
        form.contrasenya.focus();
      } finally {
        boto.disabled = false;
      }
    });

    setTimeout(() => form.usuari.focus(), 500);
    return pantalla;
  },
};
