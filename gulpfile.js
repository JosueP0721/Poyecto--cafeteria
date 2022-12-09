const {src, dest, watch, parallel} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const plumber = require('gulp-plumber');
const cache = require('gulp-cache');
const autoprefixer = require('autoprefixer');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const avif =require('gulp-avif');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

function css (done) {
    src('src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))

    done();
}

function javascript (done) {
    src('src/js/**/*.js')
        .pipe(dest('build/js'))

    done();
}

function optimages (done) {
    src('src/img/**/*.{jpg,png}')
        .pipe(cache(imagemin({optimizationLevel: 3})))
        .pipe(dest('build/img'))

    done();
}

function convertWebp (done) {
    const options = {
        quality: 50
    }
    src('src/img/**/*.{jpg,png}')
        .pipe(webp(options))
        .pipe(dest('build/img'))

    done();
}

function convertAvif (done) {
    const options = {
        quality: 50
    }
    src('src/img/**/*.{jpg,png}')
        .pipe(avif(options))
        .pipe(dest('build/img'))

    done();
}

function images (done) {
    src('src/img/**/*.svg')
        .pipe(dest('build/img'))

    done();
}

function dev (done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    watch('src/img/**/*', convertWebp, convertAvif, images, optimages)

    done();
}

exports.css = css;
exports.javascript = javascript;
exports.images = images;
exports.optimages = optimages;
exports.convertWebp = convertWebp;
exports.convertAvif = convertAvif;
exports.dev = parallel(css, javascript, convertWebp, convertAvif,  images, optimages, dev);