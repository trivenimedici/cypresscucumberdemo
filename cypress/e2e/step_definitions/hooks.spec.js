const { Before, After } = require("cypress-cucumber-preprocessor/steps");

Before(() => {
  cy.log("Starting the test execution");
});

After(() => {
  cy.log("Test Execution is completed");
});
