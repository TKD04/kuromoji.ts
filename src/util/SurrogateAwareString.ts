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

import isSurrogatePair from "./isSurrogatePair";

/**
 * String wrapper for UTF-16 surrogate pair (4 bytes)
 */
export default class SurrogateAwareString {
  readonly #str: string;

  readonly #indexMapping: number[];

  readonly #length: number;

  /**
   * @param str String to wrap
   */
  constructor(str: string) {
    this.#str = str;
    this.#indexMapping = [];

    const strLen = str.length;
    for (let pos = 0; pos < strLen; pos += 1) {
      const char = str.charAt(pos);
      this.#indexMapping.push(pos);
      if (isSurrogatePair(char)) {
        pos += 1;
      }
    }
    // Surrogate aware length
    this.#length = this.#indexMapping.length;
  }

  get indexMapping() {
    return this.#indexMapping.slice();
  }

  get length() {
    return this.#length;
  }

  charAt(index: number): string {
    if (this.#str.length <= index) {
      return "";
    }
    const surrogateAwareStartIndex = this.#indexMapping[index];
    const surrogateAwareEndIndex = this.#indexMapping[index + 1];

    if (typeof surrogateAwareStartIndex === "undefined") {
      throw new Error("surrogateAwareStartIndex must not be undefined");
    }
    if (typeof surrogateAwareEndIndex === "undefined") {
      return this.#str.slice(surrogateAwareStartIndex);
    }

    return this.#str.slice(surrogateAwareStartIndex, surrogateAwareEndIndex);
  }

  charCodeAt(index: number): number {
    if (this.#indexMapping.length <= index) {
      return NaN;
    }
    const surrogateAwareIndex = this.#indexMapping[index];
    if (typeof surrogateAwareIndex === "undefined") {
      throw new Error("surrogateAwareIndex must not be undefined");
    }
    const upper = this.#str.charCodeAt(surrogateAwareIndex);
    let lower;

    if (
      upper >= 0xd800 &&
      upper <= 0xdbff &&
      surrogateAwareIndex < this.#str.length
    ) {
      lower = this.#str.charCodeAt(surrogateAwareIndex + 1);
      if (lower >= 0xdc00 && lower <= 0xdfff) {
        return (upper - 0xd800) * 0x400 + lower - 0xdc00 + 0x10000;
      }
    }

    return upper;
  }

  toString(): string {
    return this.#str;
  }

  slice(index: number): string {
    if (this.#indexMapping.length <= index) {
      return "";
    }
    const surrogateAwareIndex = this.#indexMapping[index];

    if (typeof surrogateAwareIndex === "undefined") {
      throw new Error("surrogateAwareIndex must not be undefined");
    }

    return this.#str.slice(surrogateAwareIndex);
  }
}
