// Servidor de L'Hort de les Estacions
// Serveix els fitxers de client/ i una petita API que llegeix i desa JSON.

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { llegirJSON } from "./dades.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// ---------- API ----------

// Una classe (I3, I4 o I5) amb els seus alumnes
app.get("/api/grups/:id", async (req, res) => {
  const { grups } = await llegirJSON("grups.json");
  const grup = grups.find((g) => g.id === req.params.id.toUpperCase());

  if (!grup) return res.status(404).json({ error: "Aquesta classe no existeix" });
  res.json(grup);
});

// Els mons (estacions) del joc, en ordre
app.get("/api/mons", async (req, res) => {
  const { mons } = await llegirJSON("mons.json");
  res.json(mons.sort((a, b) => a.ordre - b.ordre));
});

// ---------- Fitxers estàtics: HTML, CSS, JS, fonts i imatges ----------
app.use(express.static(path.join(__dirname, "..", "client")));

app.listen(PORT, () => {
  console.log(`L'Hort de les Estacions funcionant a http://localhost:${PORT}`);
});
