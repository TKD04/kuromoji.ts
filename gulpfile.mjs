import fs from "node:fs";

import browserify from "browserify";
import del from "del";
import { merge } from "event-stream";
import gulp from "gulp";
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

gulp.task("clean", (done) =>
  del([".publish/", "coverage/", "build/", "publish/"], done)
);

gulp.task("build", ["clean"], () =>
  browserify({
    entries: ["src/kuromoji.js"],
    standalone: "kuromoji", // window.kuromoji
  })
    .bundle()
    .pipe(source("kuromoji.js"))
    .pipe(gulp.dest("build/"))
);

gulp.task("watch", () => {
  gulp.watch(["src/**/*.js", "test/**/*.js"], ["lint", "build", "jsdoc"]);
});

gulp.task("clean-dict", (done) => del(["dict/"], done));

gulp.task("create-dat-files", (done) => {
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

gulp.task("compress-dict", () =>
  gulp.src("dict/*.dat").pipe(gzip()).pipe(gulp.dest("dict/"))
);

gulp.task("clean-dat-files", (done) => del(["dict/*.dat"], done));

gulp.task("build-dict", ["build", "clean-dict"], () => {
  sequence("create-dat-files", "compress-dict", "clean-dat-files");
});

gulp.task("test", ["build"], () =>
  gulp.src("test/**/*.js", { read: false }).pipe(mocha({ reporter: "list" }))
);

gulp.task("coverage", ["test"], (done) => {
  gulp
    .src(["src/**/*.js"])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on("finish", () => {
      gulp
        .src(["test/**/*.js"])
        .pipe(mocha({ reporter: "mocha-lcov-reporter" }))
        .pipe(istanbul.writeReports())
        .on("end", done);
    });
});

gulp.task("clean-jsdoc", (done) => del(["publish/jsdoc/"], done));

gulp.task("jsdoc", ["clean-jsdoc"], (cb) => {
  const config = require("./jsdoc.json");
  gulp.src(["src/**/*.js"], { read: false }).pipe(jsdoc(config, cb));
});

gulp.task("clean-demo", (done) => del(["publish/demo/"], done));

gulp.task("copy-demo", ["clean-demo", "build"], () =>
  merge(
    gulp.src("demo/**/*").pipe(gulp.dest("publish/demo/")),
    gulp.src("build/**/*").pipe(gulp.dest("publish/demo/kuromoji/build/")),
    gulp.src("dict/**/*").pipe(gulp.dest("publish/demo/kuromoji/dict/"))
  )
);

gulp.task("build-demo", ["copy-demo"], () => bower({ cwd: "publish/demo/" }));

gulp.task("webserver", ["build-demo", "jsdoc"], () => {
  gulp.src("publish/").pipe(
    webserver({
      port: 8000,
      livereload: true,
      directoryListing: true,
    })
  );
});

gulp.task("deploy", ["build-demo", "jsdoc"], () =>
  gulp.src("publish/**/*").pipe(ghPages())
);

gulp.task("version", () => {
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
  return gulp
    .src(["./bower.json", "./package.json"])
    .pipe(bump({ type }))
    .pipe(gulp.dest("./"));
});

gulp.task("release-commit", () => {
  const { version } = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  return gulp
    .src(".")
    .pipe(git.add())
    .pipe(git.commit(`chore: release ${version}`));
});

gulp.task("release-tag", (callback) => {
  const { version } = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  git.tag(version, `${version} release`, (error) => {
    if (error) {
      return callback(error);
    }
    callback();
  });
});

gulp.task("release", ["test"], () => {
  sequence("release-commit", "release-tag");
});
