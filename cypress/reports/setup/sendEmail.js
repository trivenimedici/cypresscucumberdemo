const chalk = require('chalk')
const fs = require('fs')

const nodemailer = require('nodemailer')

module.exports = function (results, failedTest) {
  return new Promise((resolve, reject) => {
    const percentSuccess = () => {
      let percentPassed = parseInt(results.totalPassed) * 100
      if (results.config.env.TAGS.includes('smoke')) {
        return (Math.round(percentPassed / (parseInt(results.totalTests) - parseInt(results.totalPending))))
      } else {
        return (Math.round(percentPassed / parseInt(results.totalTests)))
      }
    }

    const envType = () => {
      if (results.config.baseUrl.includes('sit')) {
        return 'SIT'
      } else {
        return 'DEV'
      }
    }
    const emailsubject = () => {
      let successRate = percentSuccess()
      if (results.config.env.TAGS.includes('smoke')) {
        if (successRate >= 90) {
          return 'tests Quality Gate Passed (Smoke Suite)'
        } else {
          return 'tests Quality Gate Failed (Smoke Suite)'
        }
      } else {
        if (successRate >= 80) {
          return 'tests Quality Gate Passed (Regression Suite)'
        } else {
          return 'tests Quality Gate Failed (Regression Suite)'
        }
      }
    }

    const durationInSeconds = () => {
      let seconds = ((parseFloat(results.totalDuration)) / 1000).toFixed(0)
      let minute = Math.floor((seconds / 60) % 60);
      hours = Math.floor((results.totalDuration / (1000 * 60 * 60)) % 24);
      hours = (hours < 10) ? hours : hours;
      minute = (minute < 10) ? '0' + minute : minute;
      let second = seconds % 60;
      second = (second < 10) ? '0' + second : second;
      return hours + 'h:' + minute + 'm:' + second + 's';
    }
    const getFailedTest = () => {
      var dataWithOutComma = '';
      if (failedTest.length > 0) {
        failedTest.forEach(data => {
          dataWithOutComma = dataWithOutComma + data
        });
        return dataWithOutComma;
      } else {
        return '😃 There were no test cases failed !!!'
      }
    }

    const suiteName = () => {
      if (results.config.env.TAGS.includes('smoke')) {
        return 'Smoke Suite Execution Status'
      } else {
        return 'Regression Suite Execution Status'
      }
    }

    const branchName = () => {
      let branchName = process.env.BRANCH_NAME || 'Local Branch'
      if (branchName == 'master') {
        return ''
      } else {
        return `Branch Name : ${branchName}`
      }
    }

    const EmailList = () => {
      let toList =
        process.env.BRANCH_NAME == 'master'
          ? process.env.EMAIL_LIST
          : 'nagatriveni.medici@gmail.com'
      return toList
    }

    const smokeInfo = () => {
      if (results.config.env.TAGS.includes('smoke')) {
        return ` Note:<br>
        &#x2022; All Skipped Items are included as part of Regression Suite.<br>
        &#x2022; Regression suite success rate equivalent to or greater then 80% displays as "Quality Gates Passed" else it displays as "Quality Gates Failed".<br>
        &#x2022; Smoke suite success rate equivalent to or greater then 90% displays as "Quality Gates Passed" else it displays as "Quality Gates Failed".`
      } else {
        return ` Note:<br>
        &#x2022; Regression suite success rate equivalent to or greater then 80% displays as "Quality Gates Passed" else it displays as "Quality Gates Failed".<br>
        &#x2022; Smoke suite success rate equivalent to or greater then 90% displays as "Quality Gates Passed" else it displays as "Quality Gates Failed".`
      }
    }

    const Status = () => {
      let successRate = percentSuccess()
      if (results.config.env.TAGS.includes('smoke')) {
        if (successRate >= 90) {
          return '🟢'
        } else {
          return '🔴'
        }
      } else {
        if (successRate >= 80) {
          return '🟢'
        } else {
          return '🔴'
        }
      }
    }


    nodemailer
      .createTransport({
        host: 'smtp.test.com',
        secureConnection: false, // TLS requires secureConnection to be false
        port: 25, // port for secure SMTP
        requireTLS: false,
        auth: {
          user: 'no-reply@test.com',
        },
        tls: {
          rejectUnauthorized: false,
        },
      })
      .sendMail(
        {
          from: `"tests ${suiteName()} Execution Report 👻" <foo@test.com>`,
          to: EmailList(),
          subject: emailsubject(),
          text: 'Automation',
          html: `<b> 👉🏻  <i>${suiteName()}</i>  👈🏻 </b><br>
      <b>  ------------------------------------------------------------------------------------------------------------------------------------ </b>
  
      <table class="default">
  <tr>
  <th>| Total_Tests | </th><th> Total_Passed |</th><th> Total_Failed |</th><th> Total_Skipped | </th><th> Browser_Name |</th><th> Environment </th><th>| Viewport |</th><th> % Success | </th><th> Duration |</th><th> Quality Gate |</th>
  </tr>
  <tr>
    <td style="text-align:center">${results.totalTests}</td>
    
    <td style="text-align:center">${results.totalPassed}</td>
    
    <td style="text-align:center">${results.totalFailed}</td>

    <td style="text-align:center">${results.totalPending}</td>
   
    <td style="text-align:center">${results.browserName}</td>
    
    <td style="text-align:center">${envType()}</td>
    
    <td style="text-align:center">${results.config.viewportWidth}x${results.config.viewportHeight}</td>
    
    <td style="text-align:center">${percentSuccess()}</td>
    
    <td style="text-align:center;font-size:14px;">${durationInSeconds()}</td>

    <td style="text-align:center">${Status()}</td>
  </tr>
</table>
  <table><tr><th></th></tr><tr><td></td></tr></table>
  <b></b>
      <b> 👉🏻 <i>Failed Test Cases</i> 👈🏻</b><br>
      <b>  ------------------------------------------------------------------------------------------------------------------------------------ </b>
      <p>
      ${getFailedTest()}
      </p>
      <p style="color:MediumSeaGreen;">
      ${smokeInfo()}
      </p>
      <p>
      ${branchName()}
      </p>`,


          attachments: [
            {
              path: '../results/cypress/reports/Automation_Report.html'
            }
          ]

        }, function (error, info) {
          if (error) {
            console.info(chalk.red(`👉🏻 Error sending email: ${error}`))
            reject(error);
          } else {
            console.info(chalk.bold.green(`🚀 Report was sent by email successfully   👍`))
            resolve(info.messageId);
          }
        });
  })
}



