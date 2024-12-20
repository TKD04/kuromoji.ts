import { describe, expect, it } from "@jest/globals";

import convertToSurrogatePair from "./convert-to-surrogate-pair";

describe("function convertToSurrogatePair()", () => {
  it("converts to a surrogate pair code point from the high and low surrogate code points", () => {
    expect.assertions(1);

    const highSurrogateCodePoint = 0xd8_3d;
    const lowSurrogateCodePoint = 0xde_03;

    const actual = convertToSurrogatePair(
      highSurrogateCodePoint,
      lowSurrogateCodePoint
    );

    // 😃 = 0x1_f6_03
    expect(actual).toBe(0x1_f6_03);
  });
});
