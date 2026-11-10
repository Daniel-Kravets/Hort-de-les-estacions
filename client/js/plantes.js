// Dibuix de les plantes de l'hort segons la fase de creixement
//   fase 0: terra acabada de sembrar
//   fase 1: brot          (1 estrella)
//   fase 2: planta        (2 estrelles)
//   fase 3: planta + fruit (3 estrelles)

const VERD = "#7C8B52";
const VERD_CLAR = "#A3B07A";

// El fruit de cada cultiu (es dibuixa a la fase 3)
const FRUITS = {
  carbassa: `<ellipse cx="0" cy="-12" rx="22" ry="16" fill="#D9A55B"/>
             <path d="M-8 -26 Q-12 -12 -8 2 M8 -26 Q12 -12 8 2" stroke="#B0813C" stroke-width="2.5" fill="none"/>
             <rect x="-2" y="-34" width="5" height="9" rx="2" fill="#7C6A3B"/>`,
  pastanaga: `<path d="M-11 -6 Q0 -16 11 -6 L4 8 Q0 12 -4 8Z" fill="#D9824A"/>`,
  col:       `<circle cx="0" cy="-14" r="19" fill="#9DB07A"/><circle cx="-6" cy="-18" r="11" fill="#B9C99A"/>
              <path d="M0 -33 Q4 -14 0 4" stroke="#7C8B52" stroke-width="2.5" fill="none"/>`,
  enciam:    `<path d="M-22 -4 Q-24 -26 -8 -30 Q0 -40 8 -30 Q24 -26 22 -4 Q0 4 -22 -4Z" fill="#C3D49A"/>
              <path d="M-12 -6 Q-10 -22 0 -26 Q10 -22 12 -6" stroke="#9DB07A" stroke-width="2.5" fill="none"/>`,
  remolatxa: `<circle cx="0" cy="-6" r="13" fill="#9A4E62"/><path d="M0 7 L0 14" stroke="#9A4E62" stroke-width="3" stroke-linecap="round"/>`,
};

function brot() {
  return `<path d="M0 0 V-16" stroke="${VERD}" stroke-width="4" stroke-linecap="round"/>
          <path d="M0 -12 Q-14 -22 -16 -10 Q-8 -6 0 -12Z" fill="${VERD_CLAR}"/>
          <path d="M0 -14 Q14 -26 17 -12 Q8 -8 0 -14Z" fill="${VERD_CLAR}"/>`;
}

function planta() {
  return `<path d="M0 0 V-34" stroke="${VERD}" stroke-width="5" stroke-linecap="round"/>
          <path d="M0 -10 Q-26 -18 -26 -34 Q-8 -32 0 -14Z" fill="${VERD}"/>
          <path d="M0 -16 Q24 -26 26 -42 Q6 -40 0 -20Z" fill="${VERD_CLAR}"/>
          <path d="M0 -30 Q-14 -44 -6 -56 Q6 -46 0 -32Z" fill="${VERD_CLAR}"/>`;
}

// Una planta en una posició x de la línia de terra
function plantaEn(x, cultiu, fase) {
  if (fase === 0) {
    return `<g transform="translate(${x} 0) scale(1.3)"><ellipse cx="0" cy="-2" rx="5" ry="3" fill="#9E7B55"/></g>`;
  }
  const dibuix = fase === 1 ? brot() : planta();
  const fruit = fase === 3 ? `<g transform="translate(0 2)">${FRUITS[cultiu]}</g>` : "";
  return `<g transform="translate(${x} 0) scale(1.3)">${dibuix}${fruit}</g>`;
}

// Fila de 3 plantes per a un bancal (SVG de 220 x 120, la terra a y = 92)
export function dibuixPlantes(cultiu, fase) {
  return `
    <svg viewBox="0 0 220 120" class="bancal__plantes" aria-hidden="true">
      <g transform="translate(0 92)">
        ${plantaEn(84, cultiu, fase)}
        ${plantaEn(134, cultiu, fase)}
        ${plantaEn(184, cultiu, fase)}
      </g>
    </svg>`;
}
