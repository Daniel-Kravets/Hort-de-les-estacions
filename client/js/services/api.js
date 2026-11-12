// Crides al servidor (fitxers JSON)

async function demanar(ruta, opcions) {
  const resposta = await fetch(ruta, opcions);
  if (!resposta.ok) throw new Error(`Error ${resposta.status} a ${ruta}`);
  return resposta.json();
}

// Retorna la classe amb els seus alumnes: { id, nivell, alumnes: [...] }
export function obtenirGrup(idGrup) {
  return demanar(`/api/grups/${idGrup}`);
}

// Retorna les estacions del joc en ordre: [{ id, nom, ordre, disponible }]
export function obtenirMons() {
  return demanar("/api/mons");
}

// Retorna un món amb les seves activitats
export function obtenirMon(idMon) {
  return demanar(`/api/mons/${idMon}`);
}

// La partida guardada d'un alumne (o una de buida si és nou)
export function obtenirPartida(idAlumne) {
  return demanar(`/api/partides/${idAlumne}`);
}

// Desa la partida al servidor (fitxer JSON)
export function desarPartida(partida) {
  return demanar(`/api/partides/${partida.idAlumne}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partida),
  });
}


// ---------- Docents ----------
// El token de la sessió es guarda a sessionStorage: es perd en tancar la pestanya.

const CLAU_TOKEN = "hort.docent";

function token() {
  try { return JSON.parse(sessionStorage.getItem(CLAU_TOKEN))?.token ?? ""; } catch { return ""; }
}

// Crida protegida: si la sessió ha caducat, llança un error amb codi 401
async function demanarDocent(ruta, opcions = {}) {
  const resposta = await fetch(ruta, {
    ...opcions,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}`, ...opcions.headers },
  });
  const dades = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw Object.assign(new Error(dades.error ?? `Error ${resposta.status}`), { codi: resposta.status });
  return dades;
}

// Retorna { nom, grups } si l'usuari i la contrasenya són correctes; si no, llança l'error amb el missatge
export async function iniciarSessioDocent(usuari, contrasenya) {
  const dades = await demanarDocent("/api/docent/login", {
    method: "POST",
    body: JSON.stringify({ usuari, contrasenya }),
  });
  try { sessionStorage.setItem(CLAU_TOKEN, JSON.stringify(dades)); } catch { /* sense emmagatzematge: només aquesta pantalla */ }
  return dades;
}

export function docentActual() {
  try { return JSON.parse(sessionStorage.getItem(CLAU_TOKEN)); } catch { return null; }
}

export async function tancarSessioDocent() {
  await demanarDocent("/api/docent/logout", { method: "POST" }).catch(() => {});
  try { sessionStorage.removeItem(CLAU_TOKEN); } catch { /* res */ }
}

export function obtenirProgresGrup(idGrup) {
  return demanarDocent(`/api/docent/grups/${idGrup}`);
}

export function reiniciarPartida(idAlumne) {
  return demanarDocent(`/api/docent/partides/${idAlumne}`, { method: "DELETE" });
}
