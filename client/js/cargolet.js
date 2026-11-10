// En Cargolet: la mascota que acompanya els infants.
// Respira, parpelleja i salta quan l'infant encerta.

const SVG = `
<svg viewBox="0 0 260 210" role="img" aria-label="En Cargolet">
  <g class="cargolet__cos">
    <!-- antenes (surten de sota el barret) -->
    <g class="cargolet__antenes" stroke="#D9B488" stroke-width="6" stroke-linecap="round">
      <line x1="196" y1="66" x2="180" y2="22"/>
      <line x1="210" y1="64" x2="230" y2="20"/>
      <circle cx="180" cy="20" r="7" fill="#D9B488" stroke="none"/>
      <circle cx="230" cy="18" r="7" fill="#D9B488" stroke="none"/>
    </g>

    <!-- cos -->
    <path d="M34 192 Q18 192 22 178 Q30 160 84 160 L170 160 L170 98 Q170 62 202 62 Q234 62 234 98 L234 176 Q234 194 214 194 Z" fill="#EBCFA6"/>
    <path d="M30 186 Q60 196 214 194 Q234 194 234 176 L234 184 Q232 200 210 200 L40 200 Q24 198 30 186Z" fill="#DDBB8C"/>

    <!-- closca -->
    <circle cx="110" cy="110" r="64" fill="#C8A27A"/>
    <path d="M107.0 112.0 L106.7 111.6 L106.4 111.1 L106.2 110.5 L106.1 109.9 L106.1 109.2 L106.2 108.5 L106.4 107.8 L106.8 107.1 L107.2 106.4 L107.8 105.8 L108.5 105.2 L109.3 104.7 L110.2 104.3 L111.2 104.1 L112.3 103.9 L113.4 103.9 L114.5 104.1 L115.7 104.4 L116.8 104.9 L117.9 105.6 L118.9 106.4 L119.9 107.4 L120.7 108.6 L121.4 109.8 L121.9 111.2 L122.3 112.7 L122.5 114.3 L122.4 115.9 L122.2 117.5 L121.7 119.2 L121.0 120.8 L120.1 122.3 L119.0 123.8 L117.7 125.1 L116.1 126.3 L114.4 127.3 L112.6 128.1 L110.6 128.6 L108.5 128.9 L106.4 129.0 L104.2 128.7 L102.1 128.2 L99.9 127.4 L97.9 126.3 L96.0 125.0 L94.2 123.4 L92.6 121.5 L91.2 119.4 L90.1 117.2 L89.3 114.7 L88.7 112.2 L88.5 109.5 L88.6 106.8 L89.1 104.1 L89.9 101.4 L91.1 98.8 L92.6 96.4 L94.4 94.1 L96.5 92.0 L98.9 90.2 L101.5 88.6 L104.4 87.4 L107.4 86.6 L110.5 86.1 L113.8 86.0 L117.0 86.3 L120.3 87.0 L123.4 88.2 L126.5 89.7 L129.3 91.6 L132.0 93.9 L134.3 96.6 L136.4 99.5 L138.0 102.7 L139.3 106.2 L140.2 109.8 L140.6 113.5 L140.5 117.3 L139.9 121.1 L138.9 124.9 L137.4 128.5 L135.5 132.0 L133.1 135.2 L130.3 138.2 L127.1 140.8 L123.6 143.0 L119.8 144.7 L115.8 146.0 L111.6 146.9 L107.2 147.1 L102.9 146.9 L98.5 146.1 L94.3 144.7 L90.2 142.9 L86.3 140.5 L82.7 137.6 L79.5 134.3 L76.7 130.5 L74.3 126.4 L72.5 122.1 L71.2 117.4 L70.5 112.6 L70.3 107.7 L70.8 102.8 L71.9 97.9 L73.6 93.2 L75.9 88.7 L78.7 84.4 L82.1 80.5 L86.0 77.0 L90.3 74.0 L95.0 71.6 L100.0 69.7 L105.2 68.4 L110.6 67.8 L116.0 67.8 L121.5 68.6 L126.9 70.0 L132.1 72.1 L137.0 74.8"
          fill="none" stroke="#9E7B55" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="80" cy="74" rx="14" ry="8" fill="#FFFDF7" opacity=".35" transform="rotate(-30 80 74)"/>

    <!-- cara -->
    <g class="cargolet__ulls">
      <ellipse cx="192" cy="106" rx="11" ry="13" fill="#FFFDF7"/>
      <ellipse cx="216" cy="106" rx="11" ry="13" fill="#FFFDF7"/>
      <circle cx="195" cy="109" r="6.5" fill="#4A4036"/>
      <circle cx="219" cy="109" r="6.5" fill="#4A4036"/>
      <circle cx="197" cy="106" r="2" fill="#FFFDF7"/>
      <circle cx="221" cy="106" r="2" fill="#FFFDF7"/>
    </g>
    <ellipse cx="184" cy="129" rx="7" ry="4" fill="#E3A07E" opacity=".55"/>
    <ellipse cx="226" cy="129" rx="7" ry="4" fill="#E3A07E" opacity=".55"/>
    <path d="M197 128 Q205 137 213 128" fill="none" stroke="#4A4036" stroke-width="3.5" stroke-linecap="round"/>

    <!-- barret de palla -->
    <g transform="rotate(-8 204 62)">
      <ellipse cx="204" cy="66" rx="42" ry="10" fill="#EBCB86"/>
      <path d="M184 66 Q184 38 204 38 Q224 38 224 66 Z" fill="#E2BC6E"/>
      <rect x="184.5" y="55" width="39" height="7" fill="#7C8B52"/>
      <path d="M168 68 Q204 78 240 68" fill="none" stroke="#D3AE62" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;

// Crea un Cargolet nou. mida = amplada en píxels
export function crearCargolet(mida = 240) {
  const element = document.createElement("div");
  element.className = "cargolet";
  element.style.width = `${mida}px`;
  element.innerHTML = SVG;
  return element;
}

// Fa saltar en Cargolet (quan l'infant encerta)
export function celebrar(cargolet) {
  cargolet.classList.remove("cargolet--salta");
  void cargolet.offsetWidth;          // reinicia l'animació si ja estava saltant
  cargolet.classList.add("cargolet--salta");
}
