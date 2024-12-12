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

export default class CharacterClass {
  readonly #CLASS_ID: number;

  readonly #CLASS_NAME: string;

  readonly #IS_ALWAYS_INVOKE: boolean;

  readonly #IS_GROUPING: boolean;

  readonly #MAX_LENGTH: number;

  /**
   * @param classId
   * @param className
   * @param isAlwaysInvoke
   * @param isGrouping
   * @param maxLength
   */
  constructor(
    classId: number,
    className: string,
    isAlwaysInvoke: boolean,
    isGrouping: boolean,
    maxLength: number
  ) {
    this.#CLASS_ID = classId;
    this.#CLASS_NAME = className;
    this.#IS_ALWAYS_INVOKE = isAlwaysInvoke;
    this.#IS_GROUPING = isGrouping;
    this.#MAX_LENGTH = maxLength;
  }

  get classId() {
    return this.#CLASS_ID;
  }

  get className() {
    return this.#CLASS_NAME;
  }

  get isAlwaysInvoke() {
    return this.#IS_ALWAYS_INVOKE;
  }

  get isGrouping() {
    return this.#IS_GROUPING;
  }

  get maxLength() {
    return this.#MAX_LENGTH;
  }
}
