var gulp = require('gulp'),
    plug = require('gulp-load-plugins')(),
    del = require('del'),
    mainBowerFiles = require('main-bower-files'),
    pkg = require('./package.json');

gulp.task('clean', function(cb) {
  del(['./dist/*'], cb);
});

gulp.task('app:js', function() {
  var PKG = JSON.stringify({
    name: pkg.name,
    v: pkg.version
  });
  gulp.src([
    './app/app.js',
    './app/**/*.js',
  ])
    .pipe(plug.plumber())
    .pipe(plug.ngAnnotate())
    .pipe(plug.wrapper({
       header: '\n(function (PKG){ /* ${filename} */\n',
       footer: '\n})('+PKG+');\n'
    }))
    .pipe(plug.concat('app.js'))
    .pipe(gulp.dest('./dist/assets/bundle'));
});

gulp.task('html:main', function() {
  return gulp.src('./app/*.html')
      .pipe(gulp.dest('./dist'));
});
gulp.task('html:main.dev', function () {
  return gulp.src('./app/index.html')
    .pipe(plug.replace('<!-- DEV DEPENDENCIES -->',
      '<script src="http://localhost:35729/livereload.js"></script>'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('html.dev', ['html:main', 'html:main.dev']);


gulp.task('lib:js', function() {

  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-sanitize/angular-sanitize.js',
    './bower_components/angular-resource/angular-resource.js',
    './bower_components/sockjs-client/dist/sockjs.js',
    './bower_components/node-uuid/uuid.js'
  ].concat([
    './bower_components/cask-angular-*/*/module.js'
  ], mainBowerFiles({
      filter: /cask\-angular\-[^\/]+\/.*\.js$/
  }))
  )
  .pipe(plug.concat('lib.js'))
  .pipe(gulp.dest('./dist/assets/bundle'));

});

gulp.task('lint', function() {
  return gulp.src(['./app/**/*.js', './server/*.js'])
    .pipe(plug.plumber())
    .pipe(plug.jshint())
    .pipe(plug.jshint.reporter())
    .pipe(plug.jshint.reporter('fail'));
});

gulp.task('default', ['lint', 'build']);
gulp.task('build', ['app:js', 'lib:js', 'html.dev']);

gulp.task('watch', ['lint', 'build'], function() {

  plug.livereload.listen();

  gulp.watch('./dist/**/*')
    .on('change', plug.livereload.changed);
  gulp.watch(['./app/**/*.js'], ['lint', 'build']);
  gulp.watch(['./app/index.html'], ['html.dev']);

});
