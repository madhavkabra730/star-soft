/**
 * Generates deterministic placeholder "NFT art" as local SVG files.
 *
 * The real Starsoft Challenge API (which used to serve NFT artwork URLs) has
 * been permanently decommissioned (the Heroku host returns "No such app").
 * Rather than hot-linking to a third-party placeholder service — which would
 * make the app depend on network access and an origin we don't control — we
 * generate our own square, abstract gradient artwork at build time and serve
 * it from /public/nfts. This keeps next/image optimisation fully local and
 * the app fully functional offline.
 *
 * Run with: `npm run generate:mocks`
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "nfts");

const PALETTES = [
  ["#FF8310", "#7B2FF7"],
  ["#00C2FF", "#7B2FF7"],
  ["#FF3D68", "#FF8310"],
  ["#22C55E", "#00C2FF"],
  ["#F7B733", "#FC4A1A"],
  ["#845EC2", "#D65DB1"],
  ["#0093E9", "#80D0C7"],
  ["#FF9A8B", "#FF6A88"],
  ["#4E65FF", "#92EFFD"],
  ["#F857A6", "#FF5858"],
  ["#00DBDE", "#FC00FF"],
  ["#43CBFF", "#9708CC"],
];

const SIZE = 600;

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function shapeForIndex(index, rand) {
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const variant = index % 4;

  if (variant === 0) {
    // Concentric rings
    const rings = Array.from({ length: 5 }, (_, i) => {
      const r = 260 - i * 45;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,${0.15 + i * 0.05})" stroke-width="6" />`;
    }).join("");
    return rings;
  }

  if (variant === 1) {
    // Rotated polygon "gem"
    const sides = 6;
    const r = 200;
    const rotation = rand() * Math.PI;
    const points = Array.from({ length: sides }, (_, i) => {
      const angle = rotation + (i / sides) * Math.PI * 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");
    return `<polygon points="${points}" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" stroke-width="4" />`;
  }

  if (variant === 2) {
    // Organic blob made of a closed bezier path
    const points = 6;
    const baseR = 190;
    const coords = Array.from({ length: points }, (_, i) => {
      const angle = (i / points) * Math.PI * 2;
      const r = baseR + (rand() - 0.5) * 80;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    });
    let d = `M ${coords[0][0]} ${coords[0][1]} `;
    for (let i = 0; i < coords.length; i++) {
      const [x1, y1] = coords[i];
      const [x2, y2] = coords[(i + 1) % coords.length];
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      d += `Q ${x1} ${y1} ${mx} ${my} `;
    }
    d += "Z";
    return `<path d="${d}" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" stroke-width="4" />`;
  }

  // Scatter of small squares (pixel-art nod)
  const cells = 8;
  const cellSize = 34;
  let squares = "";
  for (let i = 0; i < 26; i++) {
    const gx = Math.floor(rand() * cells);
    const gy = Math.floor(rand() * cells);
    const x = cx - (cells * cellSize) / 2 + gx * cellSize;
    const y = cy - (cells * cellSize) / 2 + gy * cellSize;
    const opacity = (0.1 + rand() * 0.3).toFixed(2);
    squares += `<rect x="${x}" y="${y}" width="${cellSize - 4}" height="${cellSize - 4}" rx="4" fill="rgba(255,255,255,${opacity})" />`;
  }
  return squares;
}

function buildSvg(index) {
  const [from, to] = PALETTES[index % PALETTES.length];
  const rand = seededRandom(index * 97 + 13);
  const gradientId = `grad-${index}`;
  const angle = Math.floor(rand() * 360);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <defs>
    <linearGradient id="${gradientId}" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#${gradientId})" />
  ${shapeForIndex(index, rand)}
</svg>`;
}

function main(count = 24) {
  mkdirSync(OUT_DIR, { recursive: true });
  for (let i = 0; i < count; i++) {
    const svg = buildSvg(i);
    const filePath = path.join(OUT_DIR, `nft-${String(i + 1).padStart(2, "0")}.svg`);
    writeFileSync(filePath, svg, "utf-8");
  }
  console.log(`Generated ${count} placeholder NFT artworks in ${OUT_DIR}`);
}

main();
