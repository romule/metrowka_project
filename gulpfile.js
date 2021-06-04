//modules for Gulp
const { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  fileinclude = require("gulp-file-include"),
  rename = require("gulp-rename"),
  del = require("del"),
  sass = require("gulp-sass"),
  imagesMin = require("gulp-imagemin");

//variables for gulp
const project_folder = "dist",
  source_folder = "#src";

const path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/",
    js: project_folder + "/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: [
      source_folder + "/html/main.html",
      "!" + source_folder + "/html/_*.html",
    ],
    css: source_folder + "/scss/main.scss",
    js: source_folder + "/js/main.js",
    js_bootstrap: "./node_modules/bootstrap/dist/js/bootstrap.js",
    img: source_folder + "/img/**/*.{png,svg,jpg,ico,webp,gif}",
    fonts: source_folder + "/fonts/*.ttf",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    img: source_folder + "/img/**/*.{png,svg,jpg,ico,webp,gif}",
  },
  clean: "./" + project_folder + "/",
};

// ====================== BROWSER SYNC ===================

function browserSync(params) {
  browsersync.init({
    server: { baseDir: "./" + project_folder + "/" },
    port: 3000,
    notify: false,
  });
}

// ======================= WATCH FILES ====================

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], scss);
}

// =================== HTML =========================

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(rename("index.html"))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

// ====================== SCSS =========================

function scss() {
  return src(path.src.css)
    .pipe(sass().on("error", sass.logError))
    .pipe(rename("style.css"))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

// ====================== JS =========================

function js() {
  return src(path.src.js)
    .pipe(rename("script.js"))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

// ====================== JS-bootstrap =========================

function jsBootstrap() {
  return src(path.src.js_bootstrap)
    .pipe(rename("script_bootstrap.js"))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

// ====================== IMGS =========================

function images() {
  return src(path.src.img)
    .pipe(imagesMin())
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

// =================== CLEAN DIST FOLDER ==============
function clean() {
  return del(path.clean);
}

// =====================================================

// FUNCTIONS FOR GULP EXPORTS

const build = gulp.series(
    clean,
    gulp.parallel(html, scss, js, images, jsBootstrap)
  ),
  watch = gulp.parallel(build, images, watchFiles, browserSync);

exports.html = html;
exports.scss = scss;
exports.js = js;
exports.jsBootstrap = jsBootstrap;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;
