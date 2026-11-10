// Punt d'entrada de l'aplicació
import { Navegador } from "./navegador.js";
import inici from "./screens/inici.js";
import triarClasse from "./screens/triar-classe.js";
import quiEts from "./screens/qui-ets.js";
import mapa from "./screens/mapa.js";
import hort from "./screens/hort.js";
import activitats from "./screens/activitats.js";

const nav = new Navegador(document.getElementById("app"));

nav
  .registrar(inici)
  .registrar(triarClasse)
  .registrar(quiEts)
  .registrar(mapa)
  .registrar(hort)
  .registrar(activitats);

nav.anar("inici");
