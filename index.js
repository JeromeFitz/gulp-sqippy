"use strict";

const PLUGIN_NAME = "gulp-sqippy";

const sqip = require("sqip"),
  through = require("through2"),
  path = require("path"),
  fs = require("fs"),
  log = require("fancy-log");

const sqipModes = [
  {
    name: "combo",
    code: 0
  },
  {
    name: "triangle",
    code: 1
  },
  {
    name: "rect",
    code: 2
  },
  {
    name: "ellipse",
    code: 3
  },
  {
    name: "circle",
    code: 4
  },
  {
    name: "rotatedrect",
    code: 5
  },
  {
    name: "beziers",
    code: 6
  },
  {
    name: "rotatedellipse",
    code: 7
  },
  {
    name: "polygon",
    code: 8
  }
];

/**
 * run SQIP to generate the SVG code
 * @param filepath - The source file path
 * @param options - primitives, blur and mode
 * @returns {object} - { final_svg, img_dimensions, svg_base64encoded}
 */
var makePlaceholder = function(filepath, options) {
  const resultObject = sqip({
    filename: filepath,
    numberOfPrimitives: parseInt(options.primitives),
    blur: options.blur,
    mode: options.mode
  });
  return resultObject;
};

var getFileSizeMb = function(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size / 1000000.0;
};

/**
 * Handle stream and pass through the options
 * @param options - primitives, blur and mode
 */
var gulpSqip = function(options) {
  if (typeof options == "undefined") {
    // defaults
    var options = {
      blur: 10,
      mode: 5,
      primitives: 20,
      type: "final_svg" // final_svg, img_dimensions, svg_base64encoded
    };
    options.includeSource = options.includeSource === false ? false : true;
  }

  return through.obj(function(sourceFile, enc, cb) {
    const sourceInfo = path.parse(sourceFile.path);
    if (sourceFile && sourceFile.isBuffer()) {
      // log which file is being processed
      let sizeText;
      try {
        sizeText = getFileSizeMb(sourceFile.path).toFixed(1) + "mb";
      } catch (err) {
        sizeText = "unknown";
      }
      log(
        "Processing '%s' (%s with %s primitives)",
        sourceInfo.name + sourceInfo.ext,
        sizeText,
        options.primitives || "default"
      );
      // make the new file
      const sqipResult = makePlaceholder(sourceFile.path, options)[
        options.type
      ];
      const svgFile = sourceFile.clone();
      const appendText =
        options.type !== "final_svg" ? "data:image/svg+xml;base64," : "";
      svgFile.contents = Buffer.from(`${appendText}${sqipResult}`);

      // set new file name
      const appendName =
        typeof options.appendName == "string" ? options.appendName : "";
      const prependName =
        typeof options.prependName == "string" ? options.prependName : "";

      svgFile.path = path.join(
        sourceInfo.dir,
        prependName +
          sourceInfo.name +
          appendName +
          (options.type !== "final_svg" ? ".txt" : ".svg")
      );

      // send file(s) along
      this.push(svgFile);
      if (options.includeSource) {
        this.push(sourceFile);
      }
      cb();
    } else {
      this.emit(
        "error",
        new PluginError(
          PLUGIN_NAME,
          "Source must be a file in buffer format: " + sourceFile.path
        )
      );
      cb();
    }
  });
};

module.exports = gulpSqip;
