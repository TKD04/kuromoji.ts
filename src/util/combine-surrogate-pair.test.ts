import { describe, expect, it } from "@jest/globals";

import combineSurrogatePair from "./combine-surrogate-pair";

describe("function convertToSurrogatePair()", () => {
  it("converts to a surrogate pair code point from the high and low surrogate code points", () => {
    expect.assertions(1);

    // 😃 = 0x1_f6_03
    // A high surrogate = 0xd8_3d;
    // A low surrogate = 0xde_03;
    const highSurrogateCodePoint = 0xd8_3d;
    const lowSurrogateCodePoint = 0xde_03;

    const actual = combineSurrogatePair(
      highSurrogateCodePoint,
      lowSurrogateCodePoint
    );

    expect(actual).toBe(0x1_f6_03);
  });

  it("throws a RangeError when highSurrogateCodePoint is not a high surrogate", () => {
    expect.assertions(1);

    expect(() => {
      const notHighSurrogateCodePoint = 0x61;
      const lowSurrogateCodePoint = 0xde_03;

      combineSurrogatePair(notHighSurrogateCodePoint, lowSurrogateCodePoint);
    }).toThrow(
      new RangeError("highSurrogateCodePoint (0x61) is not a high surrogate.")
    );
  });

  it("throws a RangeError when lowSurrogateCodePoint is not a low surrogate", () => {
    expect.assertions(1);

    expect(() => {
      const highSurrogateCodePoint = 0xd8_3d;
      const notLowSurrogateCodePoint = 0x61;

      combineSurrogatePair(highSurrogateCodePoint, notLowSurrogateCodePoint);
    }).toThrow(
      new RangeError("lowSurrogateCodePoint (0x61) is not a low surrogate.")
    );
  });
});
