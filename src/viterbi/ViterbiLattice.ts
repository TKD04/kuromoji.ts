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

import ViterbiNode from "./ViterbiNode";

/**
 * ViterbiLattice is a lattice in Viterbi algorithm
 */
export default class ViterbiLattice {
  readonly #NODES_END_AT: ViterbiNode[][] = [
    [ViterbiNode.createBeginOfStatement()],
  ];

  #endOfStatemetPosition: number = 1;

  get nodesEndAt() {
    return this.#NODES_END_AT.slice();
  }

  get endOfStatementPosition() {
    return this.#endOfStatemetPosition;
  }

  getLastNode(): ViterbiNode {
    const lastNodes = this.#NODES_END_AT.at(-1);

    if (typeof lastNodes === "undefined") {
      throw new Error("lastNodes must not be undefined");
    }
    const lastNode = lastNodes[0];
    if (typeof lastNode === "undefined") {
      throw new Error("lastNode must not be undefined");
    }

    return lastNode;
  }

  /**
   * Append node to ViterbiLattice
   */
  append(node: ViterbiNode): void {
    const lastPosition = node.lastPosition();
    const prevNodes = this.#NODES_END_AT[lastPosition] ?? [];

    if (this.#endOfStatemetPosition < lastPosition) {
      this.#endOfStatemetPosition = lastPosition;
    }
    prevNodes.push(node);
    this.#NODES_END_AT[lastPosition] = prevNodes;
  }

  /**
   * Set ends with EOS (End of Statement)
   */
  appendEos(): void {
    this.#endOfStatemetPosition += 1;
    this.#NODES_END_AT[this.#NODES_END_AT.length] = [
      ViterbiNode.createEndOfStatement(this.#endOfStatemetPosition),
    ];
  }
}
