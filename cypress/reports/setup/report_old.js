var reporter = require('cucumber-html-reporter');

module.exports = function (env, cypressVersion) {
    reporter.generate(
        {
            theme: 'bootstrap',
            jsonDir: '../results/cypress/reports/test-results/cucumber-json',
            screenshotsDirectory: '../results/cypress/screenshots',
            storeScreenshots: true,
            output: '../results/cypress/reports/Automation_Report.html',
            reportSuiteAsScenarios: true,
            scenarioTimestamp: true,
            ignoreBadJsonFile: true,
            metadata: {
                "Test Environment": env,
                "Executed": "Docker Container",
                "Cypress Version": cypressVersion
            }
        });
};
