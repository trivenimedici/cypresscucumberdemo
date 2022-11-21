const sendingEmail = require("./sendEmail")
const fs = require('fs')
let Set1 = require('../../../cypress/fixtures/report/result_set1.json');
let Set2 = require('../../../cypress/fixtures/report/result_set2.json');
let final = require('../../../cypress/fixtures/report/result_final.json');
let failSet1 = require('../../../cypress/fixtures/report/failedTest_set1.json');
let failSet2 = require('../../../cypress/fixtures/report/failedTest_set2.json');

if (final.totalDuration == undefined) {
    if (Set1.totalDuration > Set2.totalDuration) {
        final.totalDuration = Set1.totalDuration;
    } else {
        final.totalDuration = Set2.totalDuration;
    }
}

for (const val in final) {
    if (final[val] == 0) {
        final[val] = Set1[val] + Set2[val]
    }
}
if (final.browserName == undefined) {
    final.browserName = Set1.browserName;
} else {
    console.log(`false`)
}
if (final.config == undefined) {
    final.config = Set1.config;
}

// console.log(final)

fs.writeFile('cypress/fixtures/report/result_final.json', JSON.stringify(final, null, "\t"), err => {
    if (err) {
        console.error(err)
        return
    }
})
console.log(typeof failSet1)
const failedTest = failSet1.concat(failSet2)

let results = require('../../../cypress/fixtures/report/result_final.json');
sendingEmail(results, failedTest).then((result) => {
    console.log(result)
})