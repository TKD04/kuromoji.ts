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

const fs = require("fs");
const node_zlib = require("zlib");
const DictionaryLoader = require("./DictionaryLoader");

/**
 * NodeDictionaryLoader inherits DictionaryLoader
 * @param {string} dic_path Dictionary path
 * @constructor
 */
export default class NodeDictionaryLoader {
  constructor(dic_path) {
    DictionaryLoader.apply(this, [dic_path]);
  }

  static = Object.create(DictionaryLoader.prototype);

  /**
   * Utility function
   * @param {string} file Dictionary file path
   * @param {NodeDictionaryLoader~onLoad} callback Callback function
   */
  static loadArrayBuffer(file, callback) {
    fs.readFile(file, (err, buffer) => {
      if (err) {
        return callback(err);
      }
      node_zlib.gunzip(buffer, (err2, decompressed) => {
        if (err2) {
          return callback(err2);
        }
        const typed_array = new Uint8Array(decompressed);
        callback(null, typed_array.buffer);
      });
    });
  }

  /**
   * @callback NodeDictionaryLoader~onLoad
   * @param {Object} err Error object
   * @param {Uint8Array} buffer Loaded buffer
   */
}
