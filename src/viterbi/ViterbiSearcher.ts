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

import type ConnectionCosts from "../dict/ConnectionCosts";
import type ViterbiLattice from "./ViterbiLattice";
import type ViterbiNode from "./ViterbiNode";

/**
 * ViterbiSearcher is for searching best Viterbi path
 */
export default class ViterbiSearcher {
  readonly #CONNECTION_COSTS: ConnectionCosts;

  /**
   * @param connectionCosts Connection costs matrix
   */
  constructor(connectionCosts: ConnectionCosts) {
    this.#CONNECTION_COSTS = connectionCosts;
  }

  /**
   * Search best path by forward-backward algorithm
   * @param lattice Viterbi lattice to search
   * @returns Shortest path
   */
  search(lattice: ViterbiLattice): ViterbiNode[] {
    const temp = this.forward(lattice);

    return this.backward(temp);
  }

  forward(lattice: ViterbiLattice) {
    let i;
    for (i = 1; i <= lattice.endOfStatementPosition; i += 1) {
      const nodes = lattice.nodesEndAt[i];
      if (typeof nodes === "undefined") {
        continue;
      }
      nodes.forEach((node) => {
        const prevNodes = lattice.nodesEndAt[node.startPosition - 1];
        let cost = Number.MAX_VALUE;
        let shortestPrevNode;

        if (typeof prevNodes === "undefined") {
          // TODO process unknown words (repair word lattice)
          return;
        }
        prevNodes.forEach((prevNode) => {
          let edgeCost: number;

          if (
            typeof node.leftId === "undefined" ||
            typeof prevNode.rightId === "undefined"
          ) {
            // TODO assert
            console.log("Left or right is null");
            edgeCost = 0;
          } else {
            edgeCost = this.#CONNECTION_COSTS.get(
              prevNode.rightId,
              node.leftId
            );
          }
          const curCost = prevNode.shortestCost + edgeCost + node.cost;
          if (curCost < cost) {
            shortestPrevNode = prevNode;
            cost = curCost;
          }
        });

        node.prev = shortestPrevNode;
        node.shortestCost = cost;
      });
    }
    return lattice;
  }

  backward(lattice: ViterbiLattice): ViterbiNode[] {
    const shortestPath: ViterbiNode[] = [];
    const endOfStatement = lattice.getLastNode();

    let nodeBack = endOfStatement.prev;
    if (typeof nodeBack === "undefined") {
      return [];
    }
    while (nodeBack.type !== "BOS") {
      shortestPath.push(nodeBack);
      if (typeof nodeBack.prev === "undefined") {
        // TODO Failed to back. Process unknown words?
        return [];
      }
      nodeBack = nodeBack?.prev;
    }

    return shortestPath.reverse();
  }
}
