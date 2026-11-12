// Classe Hort (diagrama UML): l'hort d'una estació per a un alumne.
// Cada bancal té una fase: 0 terra · 1 brot · 2 planta · 3 planta amb fruit

export const FASE_MAXIMA = 3;

export class Hort {
  constructor(estacio, bancals = {}, millores = []) {
    this.estacio = estacio;
    this.bancals = bancals;     // { carbassa: 2, pastanaga: 0, ... }
    this.millores = millores;   // articles de la botiga col·locats a l'hort
  }

  fase(idBancal) {
    return this.bancals[idBancal] ?? 0;
  }

  estaAlMaxim(idBancal) {
    return this.fase(idBancal) >= FASE_MAXIMA;
  }

  // Quantes llavors costa passar a la fase següent (preus = [brot, planta, fruit])
  preuSeguent(idBancal, preus) {
    return this.estaAlMaxim(idBancal) ? null : preus[this.fase(idBancal)];
  }

  creixer(idBancal) {
    if (!this.estaAlMaxim(idBancal)) this.bancals[idBancal] = this.fase(idBancal) + 1;
  }

  teMillora(idArticle) {
    return this.millores.includes(idArticle);
  }

  afegirMillora(idArticle) {
    if (!this.teMillora(idArticle)) this.millores.push(idArticle);
  }

  // Percentatge completat (0-100): fases dels bancals + millores de la botiga
  percentatge(idsBancals, idsMillores = []) {
    const total = idsBancals.length * FASE_MAXIMA + idsMillores.length;
    if (total === 0) return 0;
    const fases = idsBancals.reduce((suma, id) => suma + this.fase(id), 0);
    const millores = idsMillores.filter((id) => this.teMillora(id)).length;
    return Math.round(((fases + millores) / total) * 100);
  }
}
