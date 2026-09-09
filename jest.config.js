// Plain CommonJS so this stays runnable without ts-node, on the Node 20 Docker image included.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest.js");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  // Prevents jest-haste-map from tripping over .next/standalone/package.json,
  // which duplicates the root package.json's "name" after a standalone build.
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/app/**/layout.tsx"],
};

// next/jest handles SWC transforms, CSS/SCSS module mocking, and env loading.
module.exports = createJestConfig(config);
