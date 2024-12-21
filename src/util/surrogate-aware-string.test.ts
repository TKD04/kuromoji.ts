/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { describe, expect, it } from "@jest/globals";

import SurrogateAwareString from "./surrogate-aware-string";

describe("class SurrogateAwareString", () => {
  describe("property length", () => {
    it("counts a empty string as 0 length", () => {
      expect.assertions(1);

      const emptyString = "";

      const actual = new SurrogateAwareString(emptyString);

      expect(actual).toHaveLength(0);
    });

    it("counts a letter as 1 length", () => {
      expect.assertions(1);

      const letter = "a";

      const actual = new SurrogateAwareString(letter);

      expect(actual).toHaveLength(1);
    });

    it("counts a surrogate pair as 1 length", () => {
      expect.assertions(1);

      const surrogatePair = "𠮷";

      const actual = new SurrogateAwareString(surrogatePair);

      expect(actual).toHaveLength(1);
    });

    it("counts a string as 3 length", () => {
      expect.assertions(1);

      const normalString = "abc";

      const actual = new SurrogateAwareString(normalString);

      expect(actual).toHaveLength(3);
    });

    it("counts a string containing a surrogate pair as 3 length", () => {
      expect.assertions(1);

      const surrogatePairString = "𠮷野屋";

      const actual = new SurrogateAwareString(surrogatePairString);

      expect(actual).toHaveLength(3);
    });
  });

  describe("function charAt()", () => {
    it("returns a letter whne the pos is undefined", () => {
      expect.assertions(1);

      const letter = "a";

      const actual = new SurrogateAwareString(letter);

      expect(actual.charAt()).toBe("a");
    });

    it("returns a surrogate pair, not the high surrogate code point when the pos is undefined", () => {
      expect.assertions(1);

      const surrogatePair = "𠮷";

      const actual = new SurrogateAwareString(surrogatePair);

      expect(actual.charAt()).toBe("𠮷");
    });

    it("returns a letter when the pos is 0", () => {
      expect.assertions(1);

      const letter = "a";

      const actual = new SurrogateAwareString(letter);

      expect(actual.charAt(0)).toBe("a");
    });

    it("returns a surrogate pair, not the high surrogate code point when the pos is 0", () => {
      expect.assertions(1);

      const surrogatePair = "𠮷";

      const actual = new SurrogateAwareString(surrogatePair);

      expect(actual.charAt(0)).toBe("𠮷");
    });

    it("returns a empty string when the pos is equal to the length", () => {
      expect.assertions(1);

      const letter = "a";

      const actual = new SurrogateAwareString(letter);

      expect(actual.charAt(1)).toBe("");
    });

    it("returns a empty string when the pos is equal to the length and a string containing a surrogate pair", () => {
      expect.assertions(1);

      const surrogatePair = "𠮷";

      const actual = new SurrogateAwareString(surrogatePair);

      expect(actual.charAt(1)).toBe("");
    });

    it("returns a empty string when the pos is greater than the length", () => {
      expect.assertions(1);

      const letter = "a";

      const actual = new SurrogateAwareString(letter);

      expect(actual.charAt(2)).toBe("");
    });

    it("returns a empty string when the pos is greater than the length and a string contains a surrogate pair", () => {
      expect.assertions(1);

      const surrogatePair = "𠮷";

      const actual = new SurrogateAwareString(surrogatePair);

      expect(actual.charAt(2)).toBe("");
    });

    it("returns a empty string when the pos is a negative integer", () => {
      expect.assertions(1);

      const letter = "a";

      const actual = new SurrogateAwareString(letter);

      expect(actual.charAt(-1)).toBe("");
    });

    it("returns a empty string when the pos is a negative integer and a string contains a surrogate pair", () => {
      expect.assertions(1);

      const surrogatePair = "𠮷";

      const actual = new SurrogateAwareString(surrogatePair);

      expect(actual.charAt(-1)).toBe("");
    });

    it("returns a letter after a surrogate pair, not the low surrogate code point", () => {
      expect.assertions(1);

      const surrogatePairString = "𠮷野屋";

      const actual = new SurrogateAwareString(surrogatePairString);

      expect(actual.charAt(1)).toBe("野");
    });

    it("returns a surrogate pair after a surrogate pair, not the low surrogate code point", () => {
      expect.assertions(1);

      const surrogatePairString = "𠮷✨";

      const actual = new SurrogateAwareString(surrogatePairString);

      expect(actual.charAt(1)).toBe("✨");
    });
  });

  describe("function codePointAt()", () => {
    it("returns the code point of a letter", () => {
      expect.assertions(1);

      const letter = "a";

      const actual = new SurrogateAwareString(letter);

      expect(actual.codePointAt(0)).toBe(0x61);
    });

    it("returns the code point of a surrogate pair, not the high surrogate code point", () => {
      expect.assertions(1);

      const surrogatePair = "𠮷";

      const actual = new SurrogateAwareString(surrogatePair);

      expect(actual.codePointAt(0)).toBe(0x2_0b_b7);
    });

    it("return NaN when the pos is equal to the length", () => {
      expect.assertions(1);

      const letter = "a";

      const actual = new SurrogateAwareString(letter);

      expect(actual.codePointAt(1)).toBeNaN();
    });

    it("return NaN when the pos is equal to the length and a string contains a surrogate pair", () => {
      expect.assertions(1);

      const surrogatePair = "𠮷";

      const actual = new SurrogateAwareString(surrogatePair);

      expect(actual.codePointAt(1)).toBeNaN();
    });

    it("return NaN when the pos is greater than the length", () => {
      expect.assertions(1);

      const letter = "𠮷";

      const actual = new SurrogateAwareString(letter);

      expect(actual.codePointAt(2)).toBeNaN();
    });

    it("return NaN when the pos is greater than the length and a string contains a surrogate pair", () => {
      expect.assertions(1);

      const surrogatePair = "𠮷";

      const actual = new SurrogateAwareString(surrogatePair);

      expect(actual.codePointAt(2)).toBeNaN();
    });

    it("return NaN when the pos is a negative integer", () => {
      expect.assertions(1);

      const letter = "a";

      const actual = new SurrogateAwareString(letter);

      expect(actual.codePointAt(-1)).toBeNaN();
    });

    it("return NaN when the pos is a negative integer and a string contains a surrogate pair", () => {
      expect.assertions(1);

      const surrogatePair = "𠮷";

      const actual = new SurrogateAwareString(surrogatePair);

      expect(actual.codePointAt(-1)).toBeNaN();
    });
  });

  describe("function slice()", () => {
    it("does not cut a string when the start is undefined", () => {
      expect.assertions(1);

      const normalString = "abc";

      const actual = new SurrogateAwareString(normalString);

      // eslint-disable-next-line unicorn/prefer-spread
      expect(actual.slice()).toBe("abc");
    });

    it("does not cut a string when the start is undefind and a string contains a surrogate pair", () => {
      expect.assertions(1);

      const surrogatePairString = "𠮷野屋";

      const actual = new SurrogateAwareString(surrogatePairString);

      // eslint-disable-next-line unicorn/prefer-spread
      expect(actual.slice()).toBe("𠮷野屋");
    });

    it("does not cut a string when the start is 0", () => {
      expect.assertions(1);

      const normalString = "abc";

      const actual = new SurrogateAwareString(normalString);

      // eslint-disable-next-line unicorn/prefer-spread
      expect(actual.slice(0)).toBe("abc");
    });

    it("does not cut a string when the start is 0 and a string contains a surrogate pair", () => {
      expect.assertions(1);

      const surrogatePairString = "𠮷野屋";

      const actual = new SurrogateAwareString(surrogatePairString);

      // eslint-disable-next-line unicorn/prefer-spread
      expect(actual.slice(0)).toBe("𠮷野屋");
    });

    it("cuts a string when the start is positive integer", () => {
      expect.assertions(2);

      const normalString = "abc";

      const actual = new SurrogateAwareString(normalString);

      expect(actual.slice(1)).toBe("bc");
      expect(actual.slice(2)).toBe("c");
    });

    it("slices a string containing a surrogate pair when the start is positive integer", () => {
      expect.assertions(2);

      const surrogatePairString = "𠮷野屋";

      const actual = new SurrogateAwareString(surrogatePairString);

      expect(actual.slice(1)).toBe("野屋");
      expect(actual.slice(2)).toBe("屋");
    });

    it("returns a empty string when the start is equal to the length", () => {
      expect.assertions(1);

      const normalString = "abc";

      const actual = new SurrogateAwareString(normalString);

      expect(actual.slice(3)).toBe("");
    });

    it("returns a empty string when the start is equal to the length and a string contains a surrogate pair", () => {
      expect.assertions(1);

      const surrogatePairString = "𠮷野屋";

      const actual = new SurrogateAwareString(surrogatePairString);

      expect(actual.slice(3)).toBe("");
    });

    it("returns a empty string when the start is greater than the length", () => {
      expect.assertions(1);

      const normalString = "abc";

      const actual = new SurrogateAwareString(normalString);

      expect(actual.slice(4)).toBe("");
    });

    it("returns a empty string when the start is greater than the length and a string contains a surrogate pair", () => {
      expect.assertions(1);

      const surrogatePairString = "𠮷野屋";

      const actual = new SurrogateAwareString(surrogatePairString);

      expect(actual.slice(4)).toBe("");
    });

    it("cuts a string when the start is negative integer", () => {
      expect.assertions(2);

      const normalString = "abc";

      const actual = new SurrogateAwareString(normalString);

      expect(actual.slice(-1)).toBe("c");
      expect(actual.slice(-2)).toBe("bc");
    });

    it("cuts a string containing a surrogate pair when the start is negative integer", () => {
      expect.assertions(2);

      const surrogatePairString = "𠮷野屋";

      const actual = new SurrogateAwareString(surrogatePairString);

      expect(actual.slice(-1)).toBe("屋");
      expect(actual.slice(-2)).toBe("野屋");
    });

    it("does not cut a string when the start is equal to the negative length", () => {
      expect.assertions(1);

      const normalString = "abc";

      const actual = new SurrogateAwareString(normalString);

      expect(actual.slice(-3)).toBe("abc");
    });

    it("does not cut a string containing a surrogate pair when the start is equal to the negative length", () => {
      expect.assertions(1);

      const surrogatePairString = "𠮷野屋";

      const actual = new SurrogateAwareString(surrogatePairString);

      expect(actual.slice(-3)).toBe("𠮷野屋");
    });

    it("does not cut a string when the start is less than the negative length", () => {
      expect.assertions(1);

      const normalString = "abc";

      const actual = new SurrogateAwareString(normalString);

      expect(actual.slice(-4)).toBe("abc");
    });

    it("does not cut a string containing a surrogate pair when the start is less than the negative length", () => {
      expect.assertions(1);

      const surrogatePairString = "𠮷野屋";

      const actual = new SurrogateAwareString(surrogatePairString);

      expect(actual.slice(-4)).toBe("𠮷野屋");
    });
  });

  describe("function toString()", () => {
    it("returns a string as it is", () => {
      expect.assertions(1);

      const normalString = "abc";

      const actual = new SurrogateAwareString(normalString);

      expect(actual.toString()).toBe("abc");
    });

    it("returns a string containing a pair of surrogates as it is", () => {
      expect.assertions(1);

      const surrogatePairString = "𠮷野屋";

      const actual = new SurrogateAwareString(surrogatePairString);

      expect(actual.toString()).toBe("𠮷野屋");
    });
  });
});
