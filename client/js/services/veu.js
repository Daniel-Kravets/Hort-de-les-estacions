// Veu del navegador (Web Speech API) en català.
// Si l'ordinador no té cap veu catalana, ho avisem a la consola i no parlem
// (una veu castellana llegint català confondria els infants).

let veuCatala = null;

function buscarVeu() {
  const veus = speechSynthesis.getVoices();
  veuCatala = veus.find((v) => v.lang.toLowerCase().startsWith("ca")) ?? null;
}

if ("speechSynthesis" in window) {
  buscarVeu();
  speechSynthesis.addEventListener("voiceschanged", buscarVeu);
}

export function hiHaVeu() {
  return veuCatala !== null;
}

// Llegeix un text en veu alta. Retorna una promesa que acaba quan ha parlat.
export function parlar(text) {
  return new Promise((resoldre) => {
    if (!("speechSynthesis" in window) || !veuCatala) {
      console.warn("No hi ha veu en català en aquest navegador:", text);
      return resoldre();
    }
    speechSynthesis.cancel();                      // talla el que estigués dient
    const frase = new SpeechSynthesisUtterance(text.toLowerCase());
    frase.voice = veuCatala;
    frase.lang = veuCatala.lang;
    frase.rate = 0.85;                             // una mica més lent, per als petits
    frase.onend = resoldre;
    frase.onerror = resoldre;
    speechSynthesis.speak(frase);
  });
}

export function callar() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}
