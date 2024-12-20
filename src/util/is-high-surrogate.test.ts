import { describe, expect, it } from "@jest/globals";

import isHighSurrogate from "./is-high-surrogate";

describe("function isHighSurrogate()", () => {
  it("returns true when the codePoint is a high surrogate", () => {
    expect.assertions(1);

    // 😃 = 0x1_f6_03
    // A high surrogate = 0xd8_3d;
    // A low surrogate = 0xde_03;
    const highSurrogateCodePoint = 0xd8_3d;

    const actual = isHighSurrogate(highSurrogateCodePoint);

    expect(actual).toBe(true);
  });

  it("returns false when the codePoint is not a high surrogate", () => {
    expect.assertions(1);

    const notHighSurrogateCodePoint = 0x61;

    const actual = isHighSurrogate(notHighSurrogateCodePoint);

    expect(actual).toBe(false);
  });

  it("returns false when the codePoint is a low surrogate", () => {
    expect.assertions(1);

    const lowSurrogateCodePoint = 0xde_03;

    const actual = isHighSurrogate(lowSurrogateCodePoint);

    expect(actual).toBe(false);
  });
});
