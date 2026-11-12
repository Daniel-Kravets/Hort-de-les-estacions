// Contrasenyes i sessions dels docents.
// Les contrasenyes es guarden xifrades amb scrypt (mòdul crypto de Node, sense dependències).

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// ---------- Contrasenyes ----------

export function xifrarContrasenya(contrasenya, sal = randomBytes(16).toString("hex")) {
  const hash = scryptSync(contrasenya, sal, 64).toString("hex");
  return { sal, hash };
}

export function contrasenyaCorrecta(contrasenya, { sal, hash }) {
  const provat = scryptSync(contrasenya, sal, 64);
  return timingSafeEqual(provat, Buffer.from(hash, "hex"));
}

// ---------- Sessions (en memòria: es perden si es reinicia el servidor) ----------

const DURADA_SESSIO = 8 * 60 * 60 * 1000;   // 8 hores, una jornada
const sessions = new Map();                  // token -> { usuari, grups, caduca }

export function obrirSessio(docent) {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, { usuari: docent.usuari, grups: docent.grups, caduca: Date.now() + DURADA_SESSIO });
  return token;
}

export function tancarSessio(token) {
  sessions.delete(token);
}

// Middleware d'Express: deixa passar només si hi ha una sessió vàlida
export function nomesDocents(req, res, next) {
  const token = (req.get("Authorization") ?? "").replace("Bearer ", "");
  const sessio = sessions.get(token);

  if (!sessio || sessio.caduca < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: "Cal iniciar sessió" });
  }
  req.docent = sessio;
  req.token = token;
  next();
}

// ---------- Intents fallits: 5 errors seguits bloquegen l'usuari 1 minut ----------

const intents = new Map();   // usuari -> { errors, bloquejatFins }

export function estaBloquejat(usuari) {
  return (intents.get(usuari)?.bloquejatFins ?? 0) > Date.now();
}

export function apuntarIntent(usuari, correcte) {
  if (correcte) return intents.delete(usuari);
  const actual = intents.get(usuari) ?? { errors: 0, bloquejatFins: 0 };
  actual.errors++;
  if (actual.errors >= 5) {
    actual.errors = 0;
    actual.bloquejatFins = Date.now() + 60 * 1000;
  }
  intents.set(usuari, actual);
}
