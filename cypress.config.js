/// <reference types="Cypress" />
/// <reference types="Cypress-xpath" />
/// <reference types="cypress-wait-until" />
/// <reference types="@shelex/cypress-allure-plugin" />
// ***********************************************************
const { defineConfig } = require('cypress')
const cucumber = require('cypress-cucumber-preprocessor').default;
const fs = require('fs')
const chalk = require("chalk");
const generateReport = require('./cypress/reports/setup/report_old.js')
// const zipnow = require('../reports/setup/zipFolder')
const sendingEmail = require("./cypress/reports/setup/sendEmail");
const path = require('path');
const _ = require('lodash')
const del = require('del')
const MongoClient = require('mongodb').MongoClient;
const execSync = require('child_process').execSync;
const cypressVersion = execSync('npx cypress --version');
const gmail = require("gmail-tester-extended")
const gmail_tester = require("gmail-tester-extended")
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

let failedTest = []


module.exports = defineConfig({
  baseApi: "https://wordpress.com",
  testApi: "https://wordpress.com",
  defaultCommandTimeout: 15000,
  responseTimeout: 15000,
  pageLoadTimeout: 15000,
  requestTimeout: 3000,
  chromeWebSecurity: false,
  screenshotsFolder: "../results/cypress/screenshots",
  screenshotOnRunFailure: true,
  videosFolder: "../results/cypress/videos",
  video: false,
  viewportWidth: 1920,
  viewportHeight: 1080,

  retries: {
    runMode: 0,
    openMode: 0
  },

  trashAssetsBeforeRuns: true,
  userAgent: "Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Mobile Safari/537.36",

  env: {
    baseUrl: "https://wordpress.com",
    baseApi: "https://wordpress.com",
    testApi: "https://wordpress.com",
    TAGS: "not (@skip or @UnderFix)"
  },

  e2e: {
    baseUrl: 'https://wordpress.com?automation',
    excludeSpecPattern: ["cypress/e2e/step_definitions/*.js"],
    specPattern: ["cypress/e2e/**/*.feature"],
    setupNodeEvents(on, config) {
      // file:preprocessor , processing the cucumber commands
      allureWriter(on, config);
      on('file:preprocessor', cucumber())
      require('cypress-grep/src/plugin')(config)
      on('after:spec', (spec, results) => {
        if (results.tests.length) {
          if (results) {
            // Do we have failures for any retry attempts?
            const failures = _.some(results.tests, (test) => {
              return _.some(test.attempts, { state: 'failed' })
            })
            const failuresCount = results.tests.filter(value => value.state === 'failed').length;
            if (failures) {
              console.info(chalk.bold.red(`Test ${spec.name} has finished in failed`))
              failedTest.push('🔥 ' + spec.name + ' -' + failuresCount + ' failed out of ' + results.tests.length + '<br>')
            } else {
              console.info(chalk.bold.green(`Test ${spec.name} has finished in passed`))
            }
          }
        }
        // console.log(failedTest.toString().replace(',', ''))
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = _.some(results.tests, (test) => {
            return _.some(test.attempts, { state: 'failed' })
          })
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            return del(results.video, { force: true })
          }
        }
      })

      function writeIntoFile(path, data) {
        fs.writeFile(path, JSON.stringify(data, null, "\t"), err => {
          if (err) {
            console.error(err)
            return
          }
        })
      }

      on('before:run', async (results) => {
        if ((results.config.configFile).includes(`cypressSet1.config.js`)) {
          const defaultVal = {
            "totalSuites": 0,
            "totalTests": 0,
            "totalFailed": 0,
            "totalPassed": 0,
            "totalPending": 0,
            "totalSkipped": 0
          }
          writeIntoFile('cypress/fixtures/report/result_final.json', defaultVal)
        }
      })

      // after:run: we can use it to generate a report and send it by email
      on('after:run', async (results) => {
        console.log(results.config.env.TAGS)
        if ((results.config.configFile).includes(`cypressSet1.config.js`)) {
          writeIntoFile('cypress/fixtures/report/result_set1.json', results)
          writeIntoFile('cypress/fixtures/report/failedTest_set1.json', failedTest)
        } else {
          writeIntoFile('cypress/fixtures/report/result_set2.json', results)
          writeIntoFile('cypress/fixtures/report/failedTest_set2.json', failedTest)
        }

        if (results) {
          console.table([
            {
              'totalTests': results.totalTests,
              'totalPassed': results.totalPassed,
              'totalFailed': results.totalFailed,
              'totalPending': results.totalPending,
              'browserName': results.browserName,
              'baseUrl': results.config.baseUrl,
              'viewport': results.config.viewportWidth + 'x' + results.config.viewportHeight,
              'totalDuration:': ((parseFloat(results.totalDuration)) / 1000).toFixed(0),
            }
          ]);
          if ((results.config.configFile).includes(`cypress.config.js`) || (results.config.configFile).includes(`cypress_partial.config.js`)) {
            generateReport(results.config.baseUrl, cypressVersion)
            // await zipnow()

            console.info(chalk.bold.green(`🚀 Sending Email ....     👍`))

            await sendingEmail(results, failedTest).then((result) => {
              console.log(result)
            });
          }
        }
      })

      on('after:screenshot', (details) => {
        // console.log(details) // print all details to terminal
        if (process.platform === 'win32') {
          var detailsPathSplit = details.path.split('\\')
        } else {
          var detailsPathSplit = details.path.split('/')
        }
        var fullFileName = detailsPathSplit[detailsPathSplit.length - 1].split(' -- ')
        var finalPath = details.path.replace(`${fullFileName[0]} -- `, '')
        const newPath = finalPath

        // fs.renameSync(details.path, newPath)
        // return { path: newPath }
        return new Promise((resolve, reject) => {
          fs.rename(details.path, newPath, (err) => {
            if (err) return reject(err)
            resolve({ path: newPath })
          })
        })
      })

      on("task", {
        "gmail:check": async args => {
          const { from, to, subject } = args
          const email = await gmail.check_inbox(
            path.resolve(__dirname, "credentials.json"),
            path.resolve(__dirname, "token-gmail.json"),
            subject,
            from,
            to,
            10,
            30,
            { include_body: true }
          )
          return email
        }
      })

      on("task", {
        "gmail:get-messages": async args => {
          const messages = await gmail_tester.get_messages(
            path.resolve(__dirname, "credentials.json"),
            path.resolve(__dirname, "token-gmail.json"),
            args.options
          );
          return messages;
        }
      })

      on('task', {
        getRecord({ URI, MyDB, Collection, Query }) {
          return new Promise((resolve) => {
            MongoClient.connect(URI, (err, client) => {
              if (err) {
                console.log(`MONGO CONNECTION ERROR: ${err}`)
                throw err;
              } else {
                const db = client.db(MyDB);
                db.collection(Collection).find(Query).toArray((err, results) => {
                  if (err) throw err;
                  resolve({ success: results })
                  client.close();
                })
              }
            })
          })
        },
        updateOneRecord({ URI, MyDB, Collection, Query, Query2 }) {
          return new Promise((resolve) => {
            MongoClient.connect(URI, (err, client) => {
              if (err) {
                console.log(`MONGO CONNECTION ERROR: ${err}`)
                throw err;
              } else {
                const db = client.db(MyDB);
                db.collection(Collection).updateOne(Query, Query2, function (err, results) {
                  if (err) throw err;
                  resolve({ success: results })
                  client.close();
                })
              }
            })
          })
        }
      })

      return config
    },

  },
});