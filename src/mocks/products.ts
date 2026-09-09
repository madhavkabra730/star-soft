import type { Product } from "@/types/product";

/**
 * Local seed data standing in for the (now offline) Starsoft Challenge API.
 *
 * Shape matches the documented contract exactly:
 * `Product { id, name, description, image, price, createdAt, cryptoSymbol, cryptoIconPath }`
 * so `src/lib/api.ts` can be pointed at a real backend later with no
 * changes to components, Redux, or React Query hooks.
 */
const NAMES = [
  "Cosmic Ape #001",
  "Neon Dreamscape",
  "Void Walker",
  "Chromatic Skull",
  "Digital Mirage",
  "Astral Fox",
  "Glitch Oracle",
  "Prism Serpent",
  "Solar Flare Bull",
  "Quantum Owl",
  "Crystal Nomad",
  "Synthwave Tiger",
  "Nebula Drifter",
  "Obsidian Phoenix",
  "Pixel Samurai",
  "Aurora Wolf",
  "Hologram Jelly",
  "Fractal Turtle",
  "Ember Raven",
  "Mystic Koi",
  "Static Panther",
  "Lunar Golem",
  "Cyber Mantis",
  "Velvet Comet",
];

const DESCRIPTIONS = [
  "A one-of-a-kind piece from a generative collection exploring color and motion.",
  "Hand-tuned traits, minted on-chain, ready for your collection.",
  "Part of a limited series celebrating abstract digital art.",
  "Rare drop with unique attributes and provable scarcity.",
  "An algorithmically generated artwork with verified ownership.",
];

function makePrice(index: number): number {
  // Deterministic pseudo-random price between 0.05 and 4.2 ETH
  const base = ((index * 137) % 415) / 100;
  return Math.round((0.05 + base) * 1000) / 1000;
}

function makeDate(index: number): string {
  const date = new Date("2025-01-01T00:00:00.000Z");
  date.setUTCDate(date.getUTCDate() + index * 3);
  return date.toISOString();
}

export const MOCK_PRODUCTS: Product[] = NAMES.map((name, index) => ({
  id: index + 1,
  name,
  description: DESCRIPTIONS[index % DESCRIPTIONS.length],
  image: `/nfts/nft-${String(index + 1).padStart(2, "0")}.svg`,
  price: makePrice(index),
  createdAt: makeDate(index),
  cryptoSymbol: "ETH",
  cryptoIconPath: "/icons/eth.svg",
}));
