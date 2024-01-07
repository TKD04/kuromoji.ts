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

const { expect } = require("chai");
const DictionaryLoader = require("./NodeDictionaryLoader");

const DIC_DIR = "dict/";

describe("dictionaryLoader", () => {
  let dictionaries = null; // target object

  before(function (done) {
    this.timeout(5 * 60 * 1000); // 5 min

    const loader = new DictionaryLoader(DIC_DIR);
    loader.load((err, dic) => {
      dictionaries = dic;
      done();
    });
  });

  it("unknown dictionaries are loaded properly", () => {
    expect(dictionaries.unknown_dictionary.lookup(" ")).to.deep.eql({
      class_id: 1,
      class_name: "SPACE",
      is_always_invoke: 0,
      is_grouping: 1,
      max_length: 0,
    });
  });
  it("tokenInfoDictionary is loaded properly", () => {
    expect(
      dictionaries.token_info_dictionary.getFeatures("0"),
    ).to.have.length.above(1);
  });
});

describe("dictionaryLoader about loading", () => {
  it("could load directory path without suffix /", function (done) {
    this.timeout(5 * 60 * 1000); // 5 min

    const loader = new DictionaryLoader("dict"); // not have suffix /
    loader.load((err, dic) => {
      expect(err).to.be.null;
      expect(dic).to.not.be.undefined;
      done();
    });
  });
  it("couldn't load dictionary, then call with error", (done) => {
    const loader = new DictionaryLoader("non-exist/dictionaries");
    loader.load((err, dic) => {
      expect(err).to.be.an.instanceof(Error);
      done();
    });
  });
});
