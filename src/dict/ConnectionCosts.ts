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

type ConnectionCostsBuffer = [
  forwardDimension: number,
  backwardDimension: number,
];

/**
 * Connection costs matrix from cc.dat file.
 */
export default class ConnectionCosts {
  #forwardDimension: number;

  #backwardDimension: number;

  #buffer: Int16Array;

  /**
   * 2 dimension matrix [forward_id][backward_id] -> cost
   */
  constructor(forwardDimension: number, backwardDimension: number) {
    this.#forwardDimension = forwardDimension;
    this.#backwardDimension = backwardDimension;
    // leading 2 integers for forward_dimension, backward_dimension, respectively
    this.#buffer = new Int16Array(forwardDimension * backwardDimension + 2);
    this.#buffer[0] = forwardDimension;
    this.#buffer[1] = backwardDimension;
  }

  get forwardDimension() {
    return this.#forwardDimension;
  }

  get backwardDimension() {
    return this.#backwardDimension;
  }

  get buffer() {
    return this.#buffer.slice();
  }

  get(forwardId: number, backwardId: number): number {
    const index = forwardId * this.#backwardDimension + backwardId + 2;

    if (this.#buffer.length < index + 1) {
      throw new Error("ConnectionCosts buffer overflow");
    }
    const cost = this.#buffer[index];
    if (typeof cost === "undefined") {
      throw new Error("cost must not be undefined");
    }

    return cost;
  }

  put(forwardId: number, backwardId: number, cost: number): void {
    const index = forwardId * this.#backwardDimension + backwardId + 2;

    if (this.#buffer.length < index + 1) {
      throw new Error("ConnectionCosts buffer overflow");
    }

    this.#buffer[index] = cost;
  }

  loadConnectionCosts(connectionCostsBuffer: ConnectionCostsBuffer): void {
    [this.#forwardDimension, this.#backwardDimension] = connectionCostsBuffer;
    this.#buffer = new Int16Array(connectionCostsBuffer);
  }
}
