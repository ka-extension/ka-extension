const gulp = require("gulp");
const babel = require("gulp-babel");
const build = require("./build.json");
const concat = require('gulp-concat');

const scriptNames = [];
const destRegex = /^(.*\/)(.*\.js)$/i;

{
    let i = 0;
    for(let scriptDest in build) {
        if(!destRegex.test(scriptDest)) { 
            throw new Error(`Invalid destination ${scriptDest}`); 
        }
        
        let [ , destPath, fileName ] = destRegex.exec(scriptDest);
        
        let scriptName = `build_script_${i++}`;
        scriptNames.push(scriptName);
        
        gulp.task(scriptName, () => gulp.src(build[scriptDest])
            .pipe(concat(fileName))
            .pipe(babel({
                presets: ["env"]
            }))
            .pipe(gulp.dest(destPath)));
    }
}

gulp.task("build", gulp.series(...scriptNames));