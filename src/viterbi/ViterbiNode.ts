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

import type { ViterbiNodeType } from "./ViterbiNodeType";

/**
 * ViterbiNode is a node of ViterbiLattice
 */
export default class ViterbiNode {
  static createBeginOfStatement(): ViterbiNode {
    return new ViterbiNode(-1, 0, 0, 0, "BOS", 0, 0, "");
  }

  static createEndOfStatement(startPos: number): ViterbiNode {
    return new ViterbiNode(-1, 0, startPos, 0, "EOS", 0, 0, "");
  }

  readonly #NAME: number;

  readonly #COST: number;

  readonly #SHORTEST_COST: number;

  readonly #START_POSITION: number;

  readonly #LENGTH: number;

  readonly #TYPE: ViterbiNodeType;

  readonly #LEFT_ID: number | undefined;

  readonly #RIGHT_ID: number | undefined;

  readonly #PREV: ViterbiNode | undefined = undefined;

  readonly #SURFACE_FORM: string;

  /**
   * @param name Word ID
   * @param cost Word cost to generate
   * @param startPosition Start position from 1
   * @param length Word length
   * @param type Node type (KNOWN, UNKNOWN, BOS, EOS, ...)
   * @param leftId Left context ID
   * @param rightId Right context ID
   * @param surfaceForm Surface form of this word
   */
  constructor(
    name: number,
    cost: number,
    startPosition: number,
    length: number,
    type: ViterbiNodeType,
    leftId: number | undefined,
    rightId: number | undefined,
    surfaceForm: string
  ) {
    this.#NAME = name;
    this.#COST = cost;
    this.#SHORTEST_COST = type === "BOS" ? 0 : Number.MAX_SAFE_INTEGER;
    this.#START_POSITION = startPosition;
    this.#LENGTH = length;
    this.#TYPE = type;
    this.#LEFT_ID = leftId;
    this.#RIGHT_ID = rightId;
    this.#SURFACE_FORM = surfaceForm;
  }

  get name() {
    return this.#NAME;
  }

  get cost() {
    return this.#COST;
  }

  get shortestCost() {
    return this.#SHORTEST_COST;
  }

  get startPosition() {
    return this.#START_POSITION;
  }

  get length() {
    return this.#LENGTH;
  }

  get type() {
    return this.#TYPE;
  }

  get leftId() {
    return this.#LEFT_ID;
  }

  get rightId() {
    return this.#RIGHT_ID;
  }

  get prev() {
    return this.#PREV;
  }

  get surfaceForm() {
    return this.#SURFACE_FORM;
  }

  lastPosition(): number {
    return this.#START_POSITION + this.#LENGTH - 1;
  }

  hasLeftId(): boolean {
    return typeof this.#LEFT_ID !== "undefined";
  }

  hasRightId(): boolean {
    return typeof this.#RIGHT_ID !== "undefined";
  }
}
