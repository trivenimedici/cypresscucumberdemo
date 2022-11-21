// 'use strict'

// const zipfol = require('zip-a-folder')
// const chalk = require("chalk");
// const path = require('path');
// var fs = require('fs');

// module.exports = function () {
//         var pathdir = path.parse(path.dirname(__dirname))
//         var a = pathdir.dir;
//         var b = a.split('testing')
//         var dir = b[0] + '/results';
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir);
//         }
//         Promise.resolve(zipfol.zip(b[0] + '/results/cypress/screenshots', b[0] + '/screenshots.zip'));
//         console.info(chalk.bold.green(`🚀 Successfully ziped ....     👍`))
// };
/*
class Zipme {

    static async main() {
        var pathdir = path.parse(path.dirname(__dirname))
        // var pathdir = path.parse(path.dirname())
        console.log(pathdir.dir)
        var a = pathdir.dir;
        var b = a.split('testing')
        var dir = b[0] + '/results';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        await zipfol.zip(b[0] + '/results', b[0] + '/results.zip');
    }

}

Zipme.main();
*/
