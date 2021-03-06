const gulp = require('gulp')
const browserSync = require('browser-sync').create()
//const pug = require('gulp-pug')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const minify = require('gulp-minify')
const cleancss = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminZopfli = require('imagemin-zopfli')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminGiflossy = require('imagemin-giflossy')
const del = require('del')
const shorthand = require('gulp-shorthand')
const htmlmin = require('gulp-htmlmin')

// Пути
const paths = {
  root: './build',
  templates: {
    src: 'src/index.html',
  },
  styles: {
    main: 'src/styles/main.scss',
    src: 'src/styles/**/*.scss',
    dest: 'build/styles/'
  },
  scripts: {
    src: 'src/scripts/*.js',
    dest: 'build/scripts/'
  },
  images: {
    src: 'src/images/**/*.*',
    dest: 'build/images/'
  },
  fonts: {
    src: 'src/fonts/**/*.*',
    dest: 'build/fonts/'
  }
}

// сервер
gulp.task('server', function () {
  browserSync.init({
    server: paths.root,
    notify: false
  })

  browserSync.watch(paths.root + '/**/*.*', browserSync.reload)
})

// удаление папки продакшена
gulp.task('clean', function (done) {
  del.sync(paths.root)
  done()
})

// работа с Pug
gulp.task('pug', function buildHTML() {
  return gulp.src(paths.templates.src)
    // .pipe(pug({
    //   pretty: true
    // }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(paths.root))
})

// работа со стилями
gulp.task('scss', function () {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    // .pipe(cleancss())
    .pipe(sass())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(shorthand())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
})

// работа с js
gulp.task('scripts', function () {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scripts.dest))
})

// работа с графикой
gulp.task("images", function () {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
})

// копирование шрифтов
gulp.task('copy:fonts', function () {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
})

// слежка за изменениями в файлах
gulp.task('watch', function () {
  gulp.watch(paths.templates.src, gulp.series('pug'))
  gulp.watch(paths.styles.src, gulp.series('scss'))
  gulp.watch(paths.scripts.src, gulp.series('scripts'))
  gulp.watch(paths.images.src, gulp.series('images'))
})

// запуск задач Gulp по умолчанию
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('pug', 'scss', 'scripts', 'images', 'copy:fonts'),
  gulp.parallel('watch', 'server')
)
)

// собрать для продакшена
gulp.task('production', gulp.series(
  'clean',
  gulp.parallel('pug', 'scss', 'scripts', 'images', 'copy:fonts'),
)
)



