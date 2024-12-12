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

import zlibjs from "zlibjs";
import DictionaryLoader from "./dictionary-loader";

/**
 * BrowserDictionaryLoader inherits DictionaryLoader, using jQuery XHR for download
 * @param {string} dic_path Dictionary path
 * @constructor
 */
export default class BrowserDictionaryLoader extends DictionaryLoader {
  constructor(dic_path) {
    DictionaryLoader.apply(this, [dic_path]);
  }

  /**
   * Utility function to load gzipped dictionary
   * @param {string} url Dictionary URL
   * @param {BrowserDictionaryLoader~onLoad} callback Callback function
   */
  static loadArrayBuffer(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      if (this.status > 0 && this.status !== 200) {
        callback(xhr.statusText, null);
        return;
      }
      const arraybuffer = this.response;

      const gz = new zlibjs.Zlib.Gunzip(new Uint8Array(arraybuffer));
      const typed_array = gz.decompress();
      callback(null, typed_array.buffer);
    };
    xhr.onerror = (err) => {
      callback(err, null);
    };
    xhr.send();
  }

  /**
   * Callback
   * @callback BrowserDictionaryLoader~onLoad
   * @param {Object} err Error object
   * @param {Uint8Array} buffer Loaded buffer
   */
}
