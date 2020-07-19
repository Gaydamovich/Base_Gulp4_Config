// основыне функции из пакета Gulp
const { src, dest, series, parallel, task, watch } = require('gulp')
// модуль для очистки билда
const clean = require('del')
// модули для модификации HTML
const htmlmin = require('gulp-htmlmin')
// модули для модификации CSS-файлов
const concat = require('gulp-concat-css')
const cssnano = require('gulp-cssnano')
const autoprefixer = require('gulp-autoprefixer')
// модули для модификации JS-файлов
const minify = require('gulp-minify')
const concatJS = require('gulp-concat')
const babel = require('gulp-babel')

const browserSync = require('browser-sync').create();


// TASKS - обычные функции (инструкции)
// в .pipe() используются только плагины Gulp!!!

function clear() {
  return clean(['build/*'])
}

function html() {
  return src('./index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('./build/'))
}

function css() {
  return src([
    './node_modules/normalize.css/normalize.css',
    './src/css/**/*.css'
  ])
    .pipe(autoprefixer())
    .pipe(concat('bundle.css'))
    .pipe(cssnano())
    .pipe(dest('build/css/'))
    .pipe(browserSync.stream())
}

function javascript() {
  return src([
    './src/js/lib/*.js',
    './src/js/*.js'
  ])
    .pipe(concatJS('app.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(minify())
    .pipe(dest('build/js/'))
    .pipe(browserSync.stream())
}

function watcher() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  })

  watch('src/**/*', parallel(css, javascript))
  watch('./index.html', browserSync.reload)
}

task('css', css)
task('watch', watcher)
task('build', series(clear, html, parallel(css, javascript)))
task('dev', series('build', 'watch'))