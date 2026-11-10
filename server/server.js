// Servidor de L'Hort de les Estacions
// De moment només serveix els fitxers de la carpeta client/.
// Més endavant hi afegirem l'API per desar les partides en JSON.

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();

// Fitxers estàtics: HTML, CSS, JS, fonts i imatges
app.use(express.static(path.join(__dirname, "..", "client")));

app.listen(PORT, () => {
  console.log(`L'Hort de les Estacions funcionant a http://localhost:${PORT}`);
});
