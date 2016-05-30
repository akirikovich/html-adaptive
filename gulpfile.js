var gulp = require("gulp"),
	browserSync = require("browser-sync").create(),

	stylus = require("gulp-stylus"),
	nib = require("nib"),

	jade = require("gulp-jade"),

	ftp = require("vinyl-ftp"),
	util = require("gulp-util"),

	runSequence = require("run-sequence"),
	watch = require("gulp-watch"),
	request = require("request");

// Uploading to the demoserver
gulp.task("upload", function() {
	var conn = ftp.create({
		host: "http://mobile.goodcode.ru",
		user: "mobile",
		password: "mobile-root",
		parallel: 10,
		log: util.log
	});
	return gulp.src(["./*", "./**"], {
		buffer: false
	}).pipe(conn.dest("/source/code/"));
});
gulp.task("cleanfolder", function() {
	request("http://mobile.goodcode.ru/source/cleanfolder.php", function() {
		return true;
	});
});

// HTML
gulp.task("html", function() {
	return gulp.src("./source/*.jade")
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest("./prod/"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Styles
gulp.task("css", function() {
	gulp.src("./source/*.styl")
		.pipe(stylus({
			use: [nib()]
		}))
		.pipe(gulp.dest("./prod/"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// JS
gulp.task("js", function() {
	gulp.src(["./source/*.js"])
		.pipe(gulp.dest("./prod/"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Server
gulp.task("browser-sync", function() {
	browserSync.init({
		server: {
			baseDir: ["./prod/"]
		},
		open: false
	});
});

gulp.task("default", ["browser-sync"], function() {
});

// Uploading
gulp.task("deploy", function() {
	runSequence(
		["cleanfolder"],
		["upload"]
	);
});

// Watching
watch(["./source/*.styl"], function(e) {
	gulp.start("css");
});
watch(["./source/*.jade"], function(e) {
	gulp.start("html");
});
watch(["./source/*.js"], function(e) {
	gulp.start("js");
});