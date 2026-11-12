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
