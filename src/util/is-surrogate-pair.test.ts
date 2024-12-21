import { describe, expect, it } from "@jest/globals";

import isSurrogatePair from "./is-surrogate-pair";

describe("function isSurrogatePair()", () => {
  it("returns true when the codePoint is a high surrogate", () => {
    expect.assertions(1);

    // 😃 = 0x1_f6_03
    // A high surrogate = 0xd8_3d;
    // A low surrogate = 0xde_03;
    const highSurrogateCodePoint = 0xd8_3d;

    const actual = isSurrogatePair(highSurrogateCodePoint);

    expect(actual).toBe(true);
  });

  it("returns true when the codePoint is a low surrogate", () => {
    expect.assertions(1);

    const lowSurrogateCodePoint = 0xde_03;

    const actual = isSurrogatePair(lowSurrogateCodePoint);

    expect(actual).toBe(true);
  });

  it("returns false when the codePoint is not a high or low surrogate", () => {
    expect.assertions(1);

    const notHighOrLowSurrogate = 0x61;

    const actual = isSurrogatePair(notHighOrLowSurrogate);

    expect(actual).toBe(false);
  });
});
