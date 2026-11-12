// Servidor de L'Hort de les Estacions
// Serveix els fitxers de client/ i una API que llegeix i desa fitxers JSON.

import express from "express";
import path from "node:path";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { llegirJSON, escriureJSON, rutaDades } from "./dades.js";
import {
  contrasenyaCorrecta, obrirSessio, tancarSessio, nomesDocents, estaBloquejat, apuntarIntent,
} from "./seguretat.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Express 4 no captura els errors de les funcions async: aquest embolcall els passa al gestor d'errors
const segur = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Només acceptem ids com "alumne-007": així ningú pot llegir o escriure altres fitxers
const ID_VALID = /^alumne-\d{3}$/;

function partidaBuida(idAlumne) {
  return { idAlumne, llavors: 0, horts: {}, estrelles: {}, historial: [] };
}

async function llegirPartida(idAlumne) {
  try {
    return await llegirJSON(`partides/${idAlumne}.json`);
  } catch (error) {
    if (error.code === "ENOENT") return partidaBuida(idAlumne);
    throw error;
  }
}


// ========== JOC ==========

// Una classe (I3, I4 o I5) amb els seus alumnes
app.get("/api/grups/:id", segur(async (req, res) => {
  const { grups } = await llegirJSON("grups.json");
  const grup = grups.find((g) => g.id === req.params.id.toUpperCase());

  if (!grup) return res.status(404).json({ error: "Aquesta classe no existeix" });
  res.json(grup);
}));

// Els mons (estacions) del joc, en ordre (sense el detall de les activitats)
app.get("/api/mons", segur(async (req, res) => {
  const { mons } = await llegirJSON("mons.json");
  const resum = mons
    .sort((a, b) => a.ordre - b.ordre)
    .map(({ activitats, botiga, ...mon }) => mon);
  res.json(resum);
}));

// Un món amb les seves activitats, l'hort i la botiga
app.get("/api/mons/:id", segur(async (req, res) => {
  const { mons } = await llegirJSON("mons.json");
  const mon = mons.find((m) => m.id === req.params.id);

  if (!mon) return res.status(404).json({ error: "Aquest món no existeix" });
  res.json(mon);
}));


// ========== PARTIDES (progrés de cada alumne) ==========

// La partida d'un alumne (si encara no ha jugat mai, una de buida)
app.get("/api/partides/:id", segur(async (req, res) => {
  const { id } = req.params;
  if (!ID_VALID.test(id)) return res.status(400).json({ error: "Identificador no vàlid" });
  res.json(await llegirPartida(id));
}));

// Desa la partida d'un alumne
app.put("/api/partides/:id", segur(async (req, res) => {
  const { id } = req.params;
  if (!ID_VALID.test(id)) return res.status(400).json({ error: "Identificador no vàlid" });

  const { llavors, horts, estrelles, historial } = req.body ?? {};
  if (!Number.isInteger(llavors) || llavors < 0 || typeof horts !== "object" ||
      typeof estrelles !== "object" || !Array.isArray(historial)) {
    return res.status(400).json({ error: "Partida no vàlida" });
  }

  await escriureJSON(`partides/${id}.json`, { idAlumne: id, llavors, horts, estrelles, historial });
  res.json({ ok: true });
}));


// ========== DOCENTS (rutes protegides) ==========

// Iniciar sessió
app.post("/api/docent/login", segur(async (req, res) => {
  const usuari = String(req.body?.usuari ?? "").trim().toLowerCase();
  const contrasenya = String(req.body?.contrasenya ?? "");

  if (estaBloquejat(usuari)) {
    return res.status(429).json({ error: "MASSA INTENTS. ESPERA UN MINUT." });
  }

  const { docents } = await llegirJSON("docents.json");
  const docent = docents.find((d) => d.usuari === usuari);
  const correcte = Boolean(docent) && contrasenyaCorrecta(contrasenya, docent.contrasenya);
  apuntarIntent(usuari, correcte);

  // El mateix missatge tant si l'usuari no existeix com si la contrasenya falla
  if (!correcte) return res.status(401).json({ error: "USUARI O CONTRASENYA INCORRECTES" });

  res.json({ token: obrirSessio(docent), nom: docent.nom, grups: docent.grups });
}));

// Tancar sessió
app.post("/api/docent/logout", nomesDocents, (req, res) => {
  tancarSessio(req.token);
  res.json({ ok: true });
});

// Progrés de tota una classe: alumnes amb les seves partides
app.get("/api/docent/grups/:id", nomesDocents, segur(async (req, res) => {
  const idGrup = req.params.id.toUpperCase();
  if (!req.docent.grups.includes(idGrup)) return res.status(403).json({ error: "No és la teva classe" });

  const { grups } = await llegirJSON("grups.json");
  const grup = grups.find((g) => g.id === idGrup);
  if (!grup) return res.status(404).json({ error: "Aquesta classe no existeix" });

  const alumnes = await Promise.all(
    grup.alumnes.map(async (alumne) => ({ ...alumne, partida: await llegirPartida(alumne.id) })),
  );
  res.json({ id: grup.id, alumnes });
}));

// Reiniciar la partida d'un alumne (esborra el seu fitxer)
app.delete("/api/docent/partides/:id", nomesDocents, segur(async (req, res) => {
  const { id } = req.params;
  if (!ID_VALID.test(id)) return res.status(400).json({ error: "Identificador no vàlid" });

  // Només si l'alumne és d'una de les classes del docent
  const { grups } = await llegirJSON("grups.json");
  const esSeu = grups
    .filter((g) => req.docent.grups.includes(g.id))
    .some((g) => g.alumnes.some((a) => a.id === id));
  if (!esSeu) return res.status(403).json({ error: "No és alumne teu" });

  await rm(rutaDades(`partides/${id}.json`), { force: true });
  res.json({ ok: true });
}));


// ========== FITXERS ESTÀTICS: HTML, CSS, JS, fonts i imatges ==========
app.use(express.static(path.join(__dirname, "..", "client")));

// Gestor d'errors: qualsevol error inesperat respon 500 en lloc de deixar la petició penjada
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Error del servidor" });
});

app.listen(PORT, () => {
  console.log(`L'Hort de les Estacions funcionant a http://localhost:${PORT}`);
});
