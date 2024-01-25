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

/**
 * ViterbiSearcher is for searching best Viterbi path
 * @param {ConnectionCosts} connection_costs Connection costs matrix
 * @constructor
 */
export default class ViterbiSearcher {
  connection_costs: ConnectionCosts;

  constructor(connection_costs: ConnectionCosts) {
    this.connection_costs = connection_costs;
  }

  /**
   * Search best path by forward-backward algorithm
   * @param {ViterbiLattice} lattice Viterbi lattice to search
   * @returns {Array} Shortest path
   */
  static search(lattice: ViterbiLattice) {
    lattice = this.forward(lattice);
    return this.backward(lattice);
  }

  static forward(lattice: ViterbiLattice) {
    let i;
    let j;
    let k;
    for (i = 1; i <= lattice.#endOfStatemetPosition; i++) {
      const nodes = lattice.#nodesEndAt[i];
      if (nodes == null) {
        continue;
      }
      for (j = 0; j < nodes.length; j++) {
        const node = nodes[j];
        let cost = Number.MAX_VALUE;
        var shortest_prev_node;

        const prev_nodes = lattice.#nodesEndAt[node.#START_POSITION - 1];
        if (prev_nodes == null) {
          // TODO process unknown words (repair word lattice)
          continue;
        }
        for (k = 0; k < prev_nodes.length; k++) {
          const prev_node = prev_nodes[k];

          var edge_cost;
          if (node.#LEFT_ID == null || prev_node.#RIGHT_ID == null) {
            // TODO assert
            console.log("Left or right is null");
            edge_cost = 0;
          } else {
            edge_cost = this.connection_costs.get(
              prev_node.#RIGHT_ID,
              node.#LEFT_ID
            );
          }

          const _cost = prev_node.shortest_cost + edge_cost + node.#COST;
          if (_cost < cost) {
            shortest_prev_node = prev_node;
            cost = _cost;
          }
        }

        node.#PREV = shortest_prev_node;
        node.shortest_cost = cost;
      }
    }
    return lattice;
  }

  static backward(lattice: ViterbiLattice) {
    const shortest_path = [];
    const eos = lattice.getLastNode();

    let node_back = eos.#PREV;
    if (node_back == null) {
      return [];
    }
    while (node_back.#TYPE !== "BOS") {
      shortest_path.push(node_back);
      if (node_back.#PREV == null) {
        // TODO Failed to back. Process unknown words?
        return [];
      }
      node_back = node_back.#PREV;
    }

    return shortest_path.reverse();
  }
}
