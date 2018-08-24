// based on https://github.com/sindresorhus/gulp-size
'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var prettyBytes = require('pretty-bytes');
var gzipSize = require('gzip-size');
var logger = require('./logger');

function log(title, what, size, gzip) {
	title = title ? (gutil.colors.cyan(title) + ' ') : '';
	logger.info(title + what + ' ' + gutil.colors.magenta(prettyBytes(size)) +
		(gzip ? gutil.colors.gray(' (gzipped ' + prettyBytes(gzip) + ')') : ''));
}

module.exports = function (options) {
	options = options || {};

	var totalSize = 0;
	var totalSizeGzip = 0;
	var fileCount = 0;

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-size', 'Streaming not supported'));
			return;
		}

		var size = file.contents.length;
		var gzipsize = gzipSize.sync(file.contents)
		totalSize += size;
		totalSizeGzip += gzipsize;

		if (options.showFiles === true && size > 0) {
			log(options.title, gutil.colors.blue(file.relative), size, gzipsize);
		}

		fileCount++;
		cb(null, file);
			
	}, function (cb) {
		if (fileCount === 1 && options.showFiles === true && totalSize > 0) {
			cb();
			return;
		}

		log(options.title, gutil.colors.green('(combined)'), totalSize, totalSizeGzip);
		cb();
	});
};