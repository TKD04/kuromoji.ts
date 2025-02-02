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

import combineSurrogatePair from "./combine-surrogate-pair";
import isHighSurrogate from "./is-high-surrogate";

/**
 * Represents a wrapper class of the String object to support a surrogate pair.
 */
export default class SurrogateAwareString {
  /**
   * Returns the length of String object that can correctly counts a surrogate pair.
   * @returns the length of String object that can correctly counts a surrogate pair.
   */
  get length() {
    return this.#SPREADED_STRING.length;
  }

  /**
   * A string array that was converted from rawString using the spread operator to handle a surrogate pair.
   */
  readonly #SPREADED_STRING: string[];

  /**
   * Create a string object that can correctly handle a surrogate pair.
   * @param rawString A string that may contain a surrogate pair.
   */
  constructor(rawString: string) {
    this.#SPREADED_STRING = [...rawString];
  }

  /**
   * Returns the character at the specified index.
   * @param pos The zero-based index of the desired character.
   * If omitted, then the default index is 0.
   * @returns The character at the specified index.
   */
  charAt(pos = 0): string {
    if (this.#isIndexOutOfBounds(pos)) {
      return "";
    }
    const surroageAwareChar = this.#SPREADED_STRING[pos];

    if (surroageAwareChar === undefined) {
      throw new Error("surrogateAwareChar must not be undefined");
    }

    return surroageAwareChar;
  }

  /**
   * Returns a non-negative integer number representing the code point value of the UTF-16 encoded code point.
   * @param pos The zero-based index of the desired character.
   * If omitted, then the default index is 0.
   * @returns A non-negative integer number representing the code point value of the UTF-16 encoded code point.
   */
  codePointAt(pos: number): number {
    if (this.#isIndexOutOfBounds(pos)) {
      return Number.NaN;
    }
    const codePoint = this.#SPREADED_STRING[pos]?.codePointAt(0);

    if (codePoint === undefined) {
      throw new Error("codePoint is undefined");
    }

    if (isHighSurrogate(codePoint)) {
      const lowSurrogateCodePoint = this.#SPREADED_STRING
        .at(pos + 1)
        ?.codePointAt(0);

      if (lowSurrogateCodePoint === undefined) {
        throw new Error("lowSurrogate is undefined");
      }

      return combineSurrogatePair(codePoint, lowSurrogateCodePoint);
    }

    return codePoint;
  }

  /**
   * Returns a section of string.
   * @param start The index to the beginning of the specified portion of String object.
   * If omitted, then the slice begins at index 0.
   * @returns a section of string.
   */
  slice(start = 0): string {
    return this.#SPREADED_STRING.slice(start).join("");
  }

  /**
   * Returns the string that the String object has as it is.
   * @returns the string that the String object has as it is.
   */
  toString(): string {
    return this.#SPREADED_STRING.join("");
  }

  /**
   * Returns a boolean value indicating whether index is out of bounds by the length of the string.
   * @param index the zero-based index.
   * @returns a boolean value indicating whether index is out of bounds by the length of the string.
   */
  #isIndexOutOfBounds(index: number): boolean {
    return this.#SPREADED_STRING.length <= index || index < 0;
  }
}
