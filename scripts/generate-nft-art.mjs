/**
 * Generates deterministic placeholder "NFT art" as local SVG files.
 *
 * The real Starsoft Challenge API (which used to serve NFT artwork URLs) has
 * been permanently decommissioned (the Heroku host returns "No such app").
 * Rather than hot-linking to a third-party placeholder service — which would
 * make the app depend on network access and an origin we don't control — we
 * generate our own artwork at build time and serve it from /public/nfts.
 *
 * Style matches the Figma reference: a single vibrant, glowing abstract
 * shape centered on a transparent background (the card itself supplies the
 * dark backdrop), rather than a full-bleed colored square.
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
const CENTER = SIZE / 2;

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/** A closed, organic blob path around (cx, cy) with the given base radius. */
function blobPath(cx, cy, baseR, rand, points = 7) {
  const coords = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2;
    const r = baseR + (rand() - 0.5) * baseR * 0.5;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  let d = `M ${coords[0][0]} ${coords[0][1]} `;
  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length];
    d += `Q ${x1} ${y1} ${(x1 + x2) / 2} ${(y1 + y2) / 2} `;
  }
  return d + "Z";
}

function shapeForIndex(index, rand, gradientId) {
  const variant = index % 4;

  if (variant === 0) {
    // A faceted gem: rotated polygon with an inner highlight facet.
    const sides = 6;
    const r = 150;
    const rotation = rand() * Math.PI;
    const points = Array.from({ length: sides }, (_, i) => {
      const angle = rotation + (i / sides) * Math.PI * 2;
      return `${CENTER + r * Math.cos(angle)},${CENTER + r * Math.sin(angle)}`;
    }).join(" ");
    return `
      <polygon points="${points}" fill="url(#${gradientId})" />
      <polygon points="${points}" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="3" />
      <circle cx="${CENTER}" cy="${CENTER}" r="${r * 0.35}" fill="rgba(255,255,255,0.35)" />
    `;
  }

  if (variant === 1) {
    // Concentric glowing rings.
    return Array.from({ length: 4 }, (_, i) => {
      const r = 150 - i * 32;
      return `<circle cx="${CENTER}" cy="${CENTER}" r="${r}" fill="none" stroke="url(#${gradientId})" stroke-width="${10 - i * 1.5}" opacity="${1 - i * 0.15}" />`;
    }).join("");
  }

  if (variant === 2) {
    // A soft organic blob (potion / orb-like).
    return `<path d="${blobPath(CENTER, CENTER, 140, rand)}" fill="url(#${gradientId})" />`;
  }

  // A star/sparkle burst.
  const spikes = 5;
  const outerR = 160;
  const innerR = 70;
  const rotation = rand() * Math.PI;
  const points = Array.from({ length: spikes * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = rotation + (i / (spikes * 2)) * Math.PI * 2;
    return `${CENTER + r * Math.cos(angle)},${CENTER + r * Math.sin(angle)}`;
  }).join(" ");
  return `<polygon points="${points}" fill="url(#${gradientId})" />`;
}

function buildSvg(index) {
  const [from, to] = PALETTES[index % PALETTES.length];
  const rand = seededRandom(index * 97 + 13);
  const gradientId = `grad-${index}`;
  const glowId = `glow-${index}`;
  const angle = Math.floor(rand() * 360);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <defs>
    <linearGradient id="${gradientId}" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
    <filter id="${glowId}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <g filter="url(#${glowId})" opacity="0.95">
    ${shapeForIndex(index, rand, gradientId)}
  </g>
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
