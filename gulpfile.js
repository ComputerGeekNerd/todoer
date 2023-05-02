'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
// sass.compiler = require('node-sass');
gulp.task('sass', function () {
	return (
		gulp
			.src('./assets/stylesheet/**/*.scss')
			// .pipe(concat('styles.scss')) /* Use this command to all .scss files to get concatenated to one single .scss file (custom.scss) */
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest('./assets/stylesheet/'))
	);
});

gulp.task('watch', function () {
	gulp.watch('./assets/stylesheet/*.scss', gulp.series('sass'));
});
