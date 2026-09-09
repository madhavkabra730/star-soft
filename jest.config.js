// Plain CommonJS (not .ts) on purpose: Jest can only load a TypeScript
// config file via Node's native type-stripping (Node ≥ 22.6) or ts-node,
// neither of which we want to require just to boot the test runner —
// this needs to work on Node 20 too (the Docker image's runtime).
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
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/app/**/layout.tsx", "!src/mocks/**"],
};

// next/jest handles SWC transforms, CSS/SCSS module mocking, and env loading.
module.exports = createJestConfig(config);
