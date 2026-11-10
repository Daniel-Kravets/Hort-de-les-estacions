// Pictogrames d'ARASAAC (https://arasaac.org)
// Autor: Sergio Palao. Origen: ARASAAC. Llicència: CC BY-NC-SA. Propietat: Govern d'Aragó.

const STATIC = "https://static.arasaac.org/pictograms";

// URL de la imatge d'un pictograma a partir del seu número
export function urlPictograma(id, mida = 500) {
  return `${STATIC}/${id}/${id}_${mida}.png`;
}
