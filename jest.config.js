/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  coverageProvider: "v8",
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  preset: "ts-jest",
};
