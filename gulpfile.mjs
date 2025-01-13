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

const argv = minimist(process.argv.slice(2));

GulpClient.task("clean", (done) =>
  deleteAsync([".publish/", "coverage/", "build/", "publish/"], done)
);

GulpClient.task("build", ["clean"], () =>
  browserify({
    entries: ["src/kuromoji.js"],
    standalone: "kuromoji", // window.kuromoji
  })
    .bundle()
    .pipe(source("kuromoji.js"))
    .pipe(GulpClient.dest("build/"))
);

GulpClient.task("watch", () => {
  GulpClient.watch(["src/**/*.js", "test/**/*.js"], ["lint", "build", "jsdoc"]);
});

GulpClient.task("clean-dict", (done) => deleteAsync(["dict/"], done));

GulpClient.task("create-dat-files", (done) => {
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
});

GulpClient.task("compress-dict", () =>
  GulpClient.src("dict/*.dat").pipe(gzip()).pipe(GulpClient.dest("dict/"))
);

GulpClient.task("clean-dat-files", (done) => deleteAsync(["dict/*.dat"], done));

GulpClient.task("build-dict", ["build", "clean-dict"], () => {
  sequence("create-dat-files", "compress-dict", "clean-dat-files");
});

GulpClient.task("test", ["build"], () =>
  GulpClient.src("test/**/*.js", { read: false }).pipe(
    mocha({ reporter: "list" })
  )
);

GulpClient.task("coverage", ["test"], (done) => {
  GulpClient.src(["src/**/*.js"])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on("finish", () => {
      GulpClient.src(["test/**/*.js"])
        .pipe(mocha({ reporter: "mocha-lcov-reporter" }))
        .pipe(istanbul.writeReports())
        .on("end", done);
    });
});

GulpClient.task("clean-jsdoc", (done) => deleteAsync(["publish/jsdoc/"], done));

GulpClient.task("jsdoc", ["clean-jsdoc"], (cb) => {
  const config = require("./jsdoc.json");
  GulpClient.src(["src/**/*.js"], { read: false }).pipe(jsdoc(config, cb));
});

GulpClient.task("clean-demo", (done) => deleteAsync(["publish/demo/"], done));

GulpClient.task("copy-demo", ["clean-demo", "build"], () =>
  merge(
    GulpClient.src("demo/**/*").pipe(GulpClient.dest("publish/demo/")),
    GulpClient.src("build/**/*").pipe(
      GulpClient.dest("publish/demo/kuromoji/build/")
    ),
    GulpClient.src("dict/**/*").pipe(
      GulpClient.dest("publish/demo/kuromoji/dict/")
    )
  )
);

GulpClient.task("build-demo", ["copy-demo"], () =>
  bower({ cwd: "publish/demo/" })
);

GulpClient.task("webserver", ["build-demo", "jsdoc"], () => {
  GulpClient.src("publish/").pipe(
    webserver({
      port: 8000,
      livereload: true,
      directoryListing: true,
    })
  );
});

GulpClient.task("deploy", ["build-demo", "jsdoc"], () =>
  GulpClient.src("publish/**/*").pipe(ghPages())
);

GulpClient.task("version", () => {
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
  return GulpClient.src(["./bower.json", "./package.json"])
    .pipe(bump({ type }))
    .pipe(GulpClient.dest("./"));
});

GulpClient.task("release-commit", () => {
  const { version } = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  return GulpClient.src(".")
    .pipe(git.add())
    .pipe(git.commit(`chore: release ${version}`));
});

GulpClient.task("release-tag", (callback) => {
  const { version } = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  git.tag(version, `${version} release`, (error) => {
    if (error) {
      return callback(error);
    }
    callback();
  });
});

GulpClient.task("release", ["test"], () => {
  sequence("release-commit", "release-tag");
});
