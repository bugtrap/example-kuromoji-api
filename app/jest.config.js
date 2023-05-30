/** @type {import('ts-jest/dist/types').JestConfigWithTsJest } */
module.exports = {
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    collectCoverage: false,
    coverageReporters: ["text"],
    reporters: [
        "default",
        [
            "jest-junit",
            {
                outputDirectory: "./reports",
                outputName: "junit.xml",
            },
        ],
    ],
    roots: ["<rootDir>/src"],
    testEnvironment: "node",
    testMatch: ["**/*.test.ts", "**/*.spec.ts"],
    testPathIgnorePatterns: ["/node_modules"],
};
