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
  readonly #STR: string;

  readonly #INDEX_MAPPING: number[];

  readonly #LENGTH: number;

  /**
   * @param str String to wrap
   */
  constructor(str: string) {
    this.#STR = str;
    this.#INDEX_MAPPING = [];

    const strLen = str.length;
    for (let pos = 0; pos < strLen; pos += 1) {
      const char = str.charAt(pos);
      this.#INDEX_MAPPING.push(pos);
      if (isSurrogatePair(char)) {
        pos += 1;
      }
    }
    // Surrogate aware length
    this.#LENGTH = this.#INDEX_MAPPING.length;
  }

  get indexMapping() {
    return this.#INDEX_MAPPING.slice();
  }

  get length() {
    return this.#LENGTH;
  }

  charAt(index: number): string {
    if (this.#STR.length <= index) {
      return "";
    }
    const surrogateAwareStartIndex = this.#INDEX_MAPPING[index];
    const surrogateAwareEndIndex = this.#INDEX_MAPPING[index + 1];

    if (typeof surrogateAwareStartIndex === "undefined") {
      throw new Error("surrogateAwareStartIndex must not be undefined");
    }
    if (typeof surrogateAwareEndIndex === "undefined") {
      return this.#STR.slice(surrogateAwareStartIndex);
    }

    return this.#STR.slice(surrogateAwareStartIndex, surrogateAwareEndIndex);
  }

  charCodeAt(index: number): number {
    if (this.#INDEX_MAPPING.length <= index) {
      return NaN;
    }
    const surrogateAwareIndex = this.#INDEX_MAPPING[index];
    if (typeof surrogateAwareIndex === "undefined") {
      throw new Error("surrogateAwareIndex must not be undefined");
    }
    const upper = this.#STR.charCodeAt(surrogateAwareIndex);
    let lower;

    if (
      upper >= 0xd800 &&
      upper <= 0xdbff &&
      surrogateAwareIndex < this.#STR.length
    ) {
      lower = this.#STR.charCodeAt(surrogateAwareIndex + 1);
      if (lower >= 0xdc00 && lower <= 0xdfff) {
        return (upper - 0xd800) * 0x400 + lower - 0xdc00 + 0x10000;
      }
    }

    return upper;
  }

  toString(): string {
    return this.#STR;
  }

  slice(index: number): string {
    if (this.#INDEX_MAPPING.length <= index) {
      return "";
    }
    const surrogateAwareIndex = this.#INDEX_MAPPING[index];

    if (typeof surrogateAwareIndex === "undefined") {
      throw new Error("surrogateAwareIndex must not be undefined");
    }

    return this.#STR.slice(surrogateAwareIndex);
  }
}
