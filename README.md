gulp-svgstore
=============

[![Build Status](https://api.travis-ci.org/w0rm/gulp-svgstore.png)](https://travis-ci.org/w0rm/gulp-svgstore)

Combine svg files into one with `<symbol>` elements.
Read more about this in [CSS Tricks article](http://css-tricks.com/svg-symbol-good-choice-icons/).

If you need similar plugin for grunt, I encourage you to check [grunt-svgstore](https://github.com/FWeinb/grunt-svgstore).

## Caution:

This is still incomplete and api may be changed anytime.
I plan to add tests and then freeze api.

## Options:

* fileName — the name of result file
* prefix — prefix for ids of the <symbol> elements
* inlineSvg — output only `<svg>` element without `<?xml ?>` and `DOCTYPE` to use inline
* emptyFills - remove all fill="none" so they can be changed in css
* transformSvg(svg, cb) — receives svg [libxmljs element](https://github.com/polotek/libxmljs/wiki/Element) and should call `cb(err, resultSvg)` when done


## Usage

The following script will combine circle.svg and square.svg into single svg file with
`<symbol>` elements.

```
var svgstore = require('gulp-svgstore')
var gulp = require('gulp')
var svgmin = require('gulp-svgmin')
gulp.task('default', function () {
  return gulp.src('test/fixtures/*.svg')
             .pipe(svgmin())
             .pipe(svgstore({ fileName: 'icons.svg'
                            , prefix: 'icon-'
                            , inlineSvg: false
                            }))
             .pipe(gulp.dest('test/'))
})
```

Combined svg:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-circle" viewBox="0 0 40 40">
    <circle fill="#fff" stroke="#1D1D1B" stroke-miterlimit="10" cx="20" cy="20" r="10"/>
  </symbol>
  <symbol id="icon-square" viewBox="0 0 40 40">
    <path stroke="#1D1D1B" stroke-miterlimit="10" d="M10 10h20v20h-20z"/>
  </symbol>
</svg>
```

## Transform result svg


### Add display:none

To add `style="display:none"` use the following transformSvg function:

```
function transformSvg (svg, cb) {
  cb(null, svg.attr({ style: 'display:none' }))
}
```

### Remove all fills

To remove all fill attributes use the following transformSvg function:

```
function transformSvg (svg, cb) {
  svg.find('//*[@fill]').forEach(function (child) {
    child.attr('fill').remove()
  })
  cb(null, svg)
}
```
