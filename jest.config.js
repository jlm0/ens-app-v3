const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "." });

const customJestConfig = {
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.yarn/**",
    "!**/.next/**",
    "!**/cypress",
  ],
  testMatch: [
    "<rootDir>/__tests__/**/?(*.)+(spec|test).[jt]s?(x)",
    "<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  moduleNameMapper: {
    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": `<rootDir>/__mocks__/fileMock.js`,

    // Handle module aliases
    "^__tests__/(.*)$": "<rootDir>/__tests__/$1",
    "^pages/(.*)$": "<rootDir>/pages/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", "jest-plugin-context/setup"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.yarn/",
    "<rootDir>/.next/",
    "<rootDir>/cypress/",
  ],
  transformIgnorePatterns: [
    "/node_modules/",
    "/.yarn/",
    "/.next/",
    "^.+\\.module\\.(css|sass|scss)$",
    "cypress",
    ".storybook",

    "config.js",
    "coverage",

    "_document.tsx",
    "_app.tsx",
    "_error.tsx",
    "404.tsx",
    "500.tsx",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.yarn/",
    "/.next/",
    "^.+\\.module\\.(css|sass|scss)$",
    "cypress",

    ".config.",
    "coverage",

    "_document.tsx",
    "_app.tsx",
    "_error.tsx",
    "404.tsx",
    "500.tsx",
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
