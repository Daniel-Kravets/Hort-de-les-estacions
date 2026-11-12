// Classe Partida (diagrama UML): tot el progrés d'un alumne.
import { Hort } from "./Hort.js";

export class Partida {
  constructor({ idAlumne, llavors = 0, horts = {}, estrelles = {} }) {
    this.idAlumne = idAlumne;
    this.llavors = llavors;
    this.estrelles = estrelles;   // millor resultat de cada activitat: { "comptar-llavors": 2 }
    this.horts = {};              // un Hort per estació
    for (const [estacio, h] of Object.entries(horts)) {
      this.horts[estacio] = new Hort(estacio, h.bancals, h.millores);
    }
  }

  afegirLlavors(n) {
    this.llavors += n;
  }

  // Gasta llavors si n'hi ha prou. Retorna true si s'han pogut gastar
  gastarLlavors(n) {
    if (n > this.llavors) return false;
    this.llavors -= n;
    return true;
  }

  // L'hort d'una estació (si encara no existeix, el crea buit)
  hort(estacio) {
    this.horts[estacio] ??= new Hort(estacio);
    return this.horts[estacio];
  }

  // Compra un article de la botiga per a l'hort d'una estació. Retorna true si s'ha pogut
  comprar(estacio, article) {
    const hort = this.hort(estacio);
    if (hort.teMillora(article.id) || !this.gastarLlavors(article.preu)) return false;
    hort.afegirMillora(article.id);
    return true;
  }

  millorsEstrelles(idActivitat) {
    return this.estrelles[idActivitat] ?? 0;
  }

  desarEstrelles(idActivitat, estrelles) {
    this.estrelles[idActivitat] = Math.max(this.millorsEstrelles(idActivitat), estrelles);
  }
}
