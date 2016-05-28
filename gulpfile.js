var gulp = require("gulp"),
	browserSync = require("browser-sync").create(),

	ftp = require("vinyl-ftp"),
	util = require("gulp-util"),

	runSequence = require("run-sequence"),
	watch = require("gulp-watch"),
	request = require("request");

// Загрузка скриптов на сервер
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

// Очистка директории проекта на сервере
gulp.task("cleanfolder", function() {
	request("http://mobile.goodcode.ru/source/cleanfolder.php", function() {
		return true;
	});
});

// Веб-сервер
gulp.task("browser-sync", function() {
	browserSync.init({
		server: {
			baseDir: [settings.paths.prod.root, settings.paths.prod.pages]
		},
		open: false
	});
});

gulp.task("default", ["browser-sync"], function() {
});

// Выгрузка на демо-сервер
gulp.task("deploy", function() {
	runSequence(
		["cleanfolder"],
		["upload"]
	);
});