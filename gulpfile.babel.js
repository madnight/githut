import gulp from 'gulp'
import htmlmin from 'gulp-htmlmin'
import ghPages from 'gulp-gh-pages'
import confirm from 'inquirer-confirm'

gulp.task('deploy', () => {
  confirm('are you sure you want to deploy to gh-pages').then(() => {
    return gulp.src('./public/**/*')
    .pipe(ghPages())
  }, () => {
    process.stdout.write('deploy aborted\n')
  })
})

gulp.task('minify', () => {
  return gulp.src('./public/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public'))
})
