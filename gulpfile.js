var pkg = require('./package.json'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	livereload = require('gulp-livereload'),
	rename = require('gulp-rename'),
	coffeelint = require('gulp-coffeelint'),
	jade = require('gulp-jade'),
	mainBowerFiles = require('main-bower-files'),
	filter = require('gulp-filter'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	minify = require('gulp-minify-css'),
	inject = require('gulp-inject'),
	ignore = require('gulp-ignore');

gulp.task('default', ['coffee', 'jade', 'bower', 'less']);

gulp.task('coffee', function() {
	return gulp.src('src/coffee/*.coffee')
		.pipe(coffeelint())
		.pipe(coffeelint.reporter())
		.pipe(coffee({ bare:true }).on('error', gutil.log))
		.pipe(concat(pkg.name + '.all.js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'))
		.pipe(livereload({ auto: false }));
});

gulp.task('jade', function() {
	return gulp.src('src/jade/**/*.jade')
		.pipe(jade({ pretty: true }).on('error', gutil.log))
		.pipe(gulp.dest('public'))
		.pipe(livereload({ auto: false }));
});

gulp.task('bower', function() {
	var jsFilter = filter('*.js');
	var cssFilter = filter('*.css');
	return gulp.src(mainBowerFiles())
		.pipe(cssFilter)
		.pipe(gulp.dest('public/css/vendor'))
		.pipe(cssFilter.restore())
		.pipe(jsFilter)
		.pipe(gulp.dest('public/js/vendor'));
});

gulp.task('less', function() {
	return gulp.src('src/less/style.less')
		.pipe(less().on('error', gutil.log))
		.pipe(autoprefixer("last 2 versions", "> 5%", "ie 8"))
		.pipe(minify())
		.pipe(rename(pkg.name + '.min.css'))
		.pipe(gulp.dest('public/css/'))
		.pipe(livereload({ auto: false }));
});

gulp.task('inject', function() {
	gulp.src('src/jade/base.jade')
		.pipe(inject(
			gulp.src(['public/**/*.css', 'public/**/*.js'], { read: false })
			.pipe(ignore(['**/normalize.css', '**/modernizr.js', '**/jquery.min.js'])), { ignorePath: 'public' }
		))
		.pipe(gulp.dest('src/jade'));
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('src/coffee/*.coffee', ['coffee']);
	gulp.watch('src/jade/*.jade', ['jade']);
	gulp.watch('src/less/*.less', ['less']);
});