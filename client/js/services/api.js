// Crides al servidor (fitxers JSON)

async function demanar(ruta) {
  const resposta = await fetch(ruta);
  if (!resposta.ok) throw new Error(`Error ${resposta.status} a ${ruta}`);
  return resposta.json();
}

// Retorna la classe amb els seus alumnes: { id, nivell, alumnes: [...] }
export function obtenirGrup(idGrup) {
  return demanar(`/api/grups/${idGrup}`);
}
