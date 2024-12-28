/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  coverageProvider: "v8",
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
};
