import { describe, expect, it } from "@jest/globals";

import isLowSurrogate from "./is-low-surrogate";

describe("function isLowSurrogate()", () => {
  it("returns true when the codePoint is a low surrogate", () => {
    expect.assertions(1);

    // 😃 = 0x1_f6_03
    // A high surrogate = 0xd8_3d;
    // A low surrogate = 0xde_03;
    const lowSurrogateCodePoint = 0xde_03;

    const actual = isLowSurrogate(lowSurrogateCodePoint);

    expect(actual).toBe(true);
  });

  it("returns false when the codePoint is not low surrogate", () => {
    expect.assertions(1);

    const notLowSurrogateCodePoint = 0x61;

    const actual = isLowSurrogate(notLowSurrogateCodePoint);

    expect(actual).toBe(false);
  });

  it("returns false when the codePoint is a high surrogate", () => {
    expect.assertions(1);

    const highSurrogateCodePoint = 0xd8_3d;

    const actual = isLowSurrogate(highSurrogateCodePoint);

    expect(actual).toBe(false);
  });
});
