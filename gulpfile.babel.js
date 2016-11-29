import gulp from "gulp"
import ghPages from "gulp-gh-pages"

gulp.task('deploy', () => {
  return gulp.src('./public/**/*')
    .pipe(ghPages())
})
