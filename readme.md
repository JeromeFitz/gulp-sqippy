# gulp-sqippy

Gulpified [`sqip`](https://www.npmjs.com/package/sqip) that allows full customization of sqip's existing options, and adds a few more. It creates a new SVG file in the stream, named the same as the source (with `.svg` extension, of course).

**Bonus:** You can pass `type: 'svg_base64encoded'` and output a `.txt` file with the base64 code to inline in an `img` tag (as opposed to a file link to `.svg`).

## Note

[`sqip`](https://www.npmjs.com/package/sqip) seems to be a work in progress, but it's a cool package that creates SVG impressions of pixel images. Find the right balance between the mode, blur and primitives count, and you get a nice, small LQIP (low quality image placeholder).

The default options below make a good placeholder image, but you could make it even smaller by reducing the primitives.

### The (optional) options are

- **appendName** - text to append to the end of the new SVG filename (`string`, default is `''`)
- **blur** - blur factor (`numeric`, default is `10`)
- **includeSource** - also pass the source image file through in the stream (`boolean`, default is `false`)
- **mode** - mode code, defined below (`integer`, default is `5`)
- **prependName** - text to prepend to the front of the new SVG filename (`string`, default is `''`)
- **primitives** - number of primitives a.k.a. the shapes that make up the image (`integer`, default is `20`)
- **type** - create either `.svg` or `.txt` (base64) (`string`, default is `'final_svg'`)

#### Mode specifies the base shape for primitives. The mode codes are

- 0: Combo
- 1: Triangle
- 2: Rectangle
- 3: Ellipse
- 4: Circle
- 5: Rotated Rectangle
- 6: Beziers
- 7: Rotated Ellipse
- 8: Polygon

## Example

```js
const sqippy = require("gulp-sqippy");

gulp.task("make-bg-placeholders", function() {
  return gulp
    .src("backgrounds/*.+(png|jpg|jpeg|gif)")
    .pipe(
      sqippy({
        primitives: 12,
        blur: 6,
        prependName: "placeholder-"
      })
    )
    .pipe(gulp.dest("backgrounds"));
});
```
