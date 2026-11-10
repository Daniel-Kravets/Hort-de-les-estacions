// Punt d'entrada de l'aplicació
import { Navegador } from "./navegador.js";
import inici from "./screens/inici.js";
import triarClasse from "./screens/triar-classe.js";

const nav = new Navegador(document.getElementById("app"));

nav
  .registrar(inici)
  .registrar(triarClasse);

nav.anar("inici");
