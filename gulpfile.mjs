import fs from "node:fs";

import browserify from "browserify";
import { deleteAsync } from "del";
import { merge } from "event-stream";
import GulpClient from "gulp";
import bower from "gulp-bower";
import bump from "gulp-bump";
import ghPages from "gulp-gh-pages-will";
import git from "gulp-git";
import gzip from "gulp-gzip";
import istanbul from "gulp-istanbul";
import jsdoc from "gulp-jsdoc3";
import mocha from "gulp-mocha";
import webserver from "gulp-webserver";
import IPADic from "mecab-ipadic-seed";
import minimist from "minimist";
import sequence from "run-sequence";
import source from "vinyl-source-stream";

import kuromoji from "./src/kuromoji.js";

const { dest, series, src } = GulpClient;
const gulpWatch = GulpClient.watch;
const argv = minimist(process.argv.slice(2));

export const clean = () =>
  deleteAsync([".publish/", "coverage/", "build/", "publish/"]);
export const build = series(clean, () => {
  browserify({
    entries: ["src/kuromoji.js"],
    // window.kuromoji
    standalone: "kuromoji",
  })
    .bundle()
    .pipe(source("kuromoji.js"))
    .pipe(dest("build/"));
});
// TODO: Replace string with variable for function
export const watch = gulpWatch(
  ["src/**/*.js", "test/**/*.js"],
  ["lint", "build", "jsdoc"]
);
export const cleanDictionary = () => deleteAsync("dict/");
export const createDatFiles = () => {
  if (!fs.existsSync("dict/")) {
    fs.mkdirSync("dict/");
  }

  // To node.js Buffer
  function toBuffer(typed) {
    const ab = typed.buffer;
    const buffer = new Buffer(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  }

  const dic = new IPADic();
  const builder = kuromoji.dictionaryBuilder();

  // Build token info dictionary
  const tokenInfoPromise = dic
    .readTokenInfo((line) => {
      builder.addTokenInfoDictionary(line);
    })
    .then(() => {
      console.log("Finishied to read token info dics");
    });

  // Build connection costs matrix
  const matrixDefPromise = dic
    .readMatrixDef((line) => {
      builder.putCostMatrixLine(line);
    })
    .then(() => {
      console.log("Finishied to read matrix.def");
    });

  // Build unknown dictionary
  const unkDefPromise = dic
    .readUnkDef((line) => {
      builder.putUnkDefLine(line);
    })
    .then(() => {
      console.log("Finishied to read unk.def");
    });

  // Build character definition dictionary
  const charDefPromise = dic
    .readCharDef((line) => {
      builder.putCharDefLine(line);
    })
    .then(() => {
      console.log("Finishied to read char.def");
    });

  // Build kuromoji.js binary dictionary
  Promise.all([
    tokenInfoPromise,
    matrixDefPromise,
    unkDefPromise,
    charDefPromise,
  ])
    .then(() => {
      console.log("Finishied to read all seed dictionary files");
      console.log("Building binary dictionary ...");
      return builder.build();
    })
    .then((dic) => {
      const base_buffer = toBuffer(dic.trie.bc.getBaseBuffer());
      const check_buffer = toBuffer(dic.trie.bc.getCheckBuffer());
      const token_info_buffer = toBuffer(
        dic.token_info_dictionary.dictionary.buffer
      );
      const tid_pos_buffer = toBuffer(
        dic.token_info_dictionary.pos_buffer.buffer
      );
      const tid_map_buffer = toBuffer(
        dic.token_info_dictionary.targetMapToBuffer()
      );
      const connection_costs_buffer = toBuffer(dic.connection_costs.buffer);
      const unk_buffer = toBuffer(dic.unknown_dictionary.dictionary.buffer);
      const unk_pos_buffer = toBuffer(dic.unknown_dictionary.pos_buffer.buffer);
      const unk_map_buffer = toBuffer(
        dic.unknown_dictionary.targetMapToBuffer()
      );
      const char_map_buffer = toBuffer(
        dic.unknown_dictionary.character_definition.character_category_map
      );
      const char_compat_map_buffer = toBuffer(
        dic.unknown_dictionary.character_definition.compatible_category_map
      );
      const invoke_definition_map_buffer = toBuffer(
        dic.unknown_dictionary.character_definition.invoke_definition_map.toBuffer()
      );

      fs.writeFileSync("dict/base.dat", base_buffer);
      fs.writeFileSync("dict/check.dat", check_buffer);
      fs.writeFileSync("dict/tid.dat", token_info_buffer);
      fs.writeFileSync("dict/tid_pos.dat", tid_pos_buffer);
      fs.writeFileSync("dict/tid_map.dat", tid_map_buffer);
      fs.writeFileSync("dict/cc.dat", connection_costs_buffer);
      fs.writeFileSync("dict/unk.dat", unk_buffer);
      fs.writeFileSync("dict/unk_pos.dat", unk_pos_buffer);
      fs.writeFileSync("dict/unk_map.dat", unk_map_buffer);
      fs.writeFileSync("dict/unk_char.dat", char_map_buffer);
      fs.writeFileSync("dict/unk_compat.dat", char_compat_map_buffer);
      fs.writeFileSync("dict/unk_invoke.dat", invoke_definition_map_buffer);

      done();
    });
};
export const compressDictionary = () =>
  src("dict/*.dat").pipe(gzip()).pipe(GulpClient.dest("dict/"));
export const cleanDatFiles = () => deleteAsync("dict/*.dat");
// TODO: Can I remove "sequence"
export const buildDictionary = series(build, cleanDictionary, () => {
  sequence("create-dat-files", "compress-dict", "clean-dat-files");
});
GulpClient.task("build-dict", ["build", "clean-dict"], () => {
  sequence("create-dat-files", "compress-dict", "clean-dat-files");
});
// TODO: Replace mocha with jest
export const test = series(build, () =>
  src("test/**/*.js", { read: false }).pipe(mocha({ reporter: "list" }))
);
export const coverage = () =>
  series(
    test,
    src(["src/**/*.js"])
      .pipe(istanbul())
      .pipe(istanbul.hookRequire())
      .on("finish", () => {
        src(["test/**/*.js"])
          .pipe(mocha({ reporter: "mocha-lcov-reporter" }))
          .pipe(istanbul.writeReports());
      })
  );
export const cleanJsdoc = () => deleteAsync("publish/jsdoc/");
// TODO: Replace "require" to "import"
export const buildJsdoc = series(cleanJsdoc, (done) => {
  const config = require("./jsdoc.json");

  src(["src/**/*.js"], { read: false }).pipe(jsdoc(config, done));
});
export const cleanDemo = () => deleteAsync("publish/demo/");
// TODO: Can I replace "merge" with "parallel"
export const copyDemo = () =>
  series(
    cleanDemo,
    build,
    merge(
      src("demo/**/*").pipe(GulpClient.dest("publish/demo/")),
      src("build/**/*").pipe(dest("publish/demo/kuromoji/build/")),
      src("dict/**/*").pipe(dest("publish/demo/kuromoji/dict/"))
    )
  );
export const buildDemo = series(copyDemo, () =>
  bower({ cwd: "publish/demo/" })
);
export const webServer = series(buildDemo, jsdoc, () => {
  src("publish/").pipe(
    webserver({
      directoryListing: true,
      livereload: true,
      port: 8000,
    })
  );
});
export const deploy = series(
  buildDemo,
  jsdoc,
  src("publish/**/*").pipe(ghPages())
);
export const version = () => {
  let type = "patch";

  if (argv.minor) {
    type = "minor";
  }
  if (argv.major) {
    type = "major";
  }
  if (argv.prerelease) {
    type = "prerelease";
  }

  return src(["./bower.json", "./package.json"])
    .pipe(bump({ type }))
    .pipe(dest("./"));
};
export const releaseCommit = () => {
  const { version } = JSON.parse(fs.readFileSync("./package.json", "utf8"));

  return src(".")
    .pipe(git.add())
    .pipe(git.commit(`chore: release ${version}`));
};
export const releaseTag = (done) => {
  const { version } = JSON.parse(fs.readFileSync("./package.json", "utf8"));

  git.tag(version, `${version} release`, (error) => {
    if (error) {
      return done(error);
    }
    done();
  });
};
export const release = series(test, sequence("release-commit", "release-tag"));
