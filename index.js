var path = require('path');
var through2 = require('through2');
var gutil = require('gulp-util');
var cheerio = require('cheerio');

module.exports = function (config) {

    config = config || {}

    var prefix = config.prefix || '';
    var fileName = config.fileName || 'svgstore.svg';
    var inlineSvg = config.inlineSvg || false;
    var transformSvg = config.transformSvg || false;

    var combinedDoc = cheerio.load('<?xml version="1.0" encoding="UTF-8"?>' +
                                   '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
                                   '<svg xmlns="http://www.w3.org/2000/svg"></svg>', { xmlMode: true });
    var combinedSvg = combinedDoc('svg');

    return through2.obj(
        function transform(file, encoding, cb) {

            if (file.isStream()) {
                return cb(new gutil.PluginError('gulp-svgstore', 'Streams are not supported!'));
            }

            var idAttr = prefix + path.basename(file.relative, path.extname(file.relative));

            var $xmlDoc = cheerio.load(file.contents.toString('utf8'), {xmlMode: true});
            var viewBoxAttr = $xmlDoc('svg').attr('viewBox') || '';

            var symbolDoc = cheerio.load('<symbol></symbol>', {xmlMode: true});
			var symbol = symbolDoc('symbol');
            symbol.attr({id: idAttr, viewBox: viewBoxAttr});

            symbol.append($xmlDoc('svg').html());
            combinedSvg.append(symbol);

            cb(null);
        }, function flush(cb) {
            var self = this;

            function done(err) {
                var file;
                var contents;
                if (err) return cb(err);
                contents = inlineSvg ? combinedSvg : combinedDoc;
                file = new gutil.File({path: fileName, contents: new Buffer(contents.html())});
                self.push(file);
                cb(null);
            }

            if (transformSvg) {
                transformSvg(combinedSvg, done);
            } else {
                done(null, combinedSvg);
            }

        }
    )
}
