var gulp = require('gulp')

var bases = {
    src: 'src/',
    dist: 'dist/',
    modules: 'modules/',
}

var paths = {
    html: 'modules/**/templates/*.html',
}

gulp.task('copy', function() {
    gulp.src(paths.html, { cwd: bases.src }).pipe(gulp.dest(bases.modules, { cwd: bases.dist }))
})
