var username, password;
const loginLink = ".x-nav-list--right > :nth-child(1) > .x-nav-link";
const emailIDTextBox = "#usernameOrEmail";
const continueButton = ".login__form-action > .button";
const passwordTextBox = "#password";
const sigInButton = "button:contains('Log In')";

export const LoginPage = {
  visit() {
    if (Cypress.env("env").runtime_env === "prod") {
      cy.visit(Cypress.env("env").app_prod_url);
    }
  },

  appSignIn() {
    if (Cypress.env("env").runtime_env === "prod") {
      username = Cypress.env("env").app_prod_username;
      password = Cypress.env("env").app_prod_password;
    }
    cy.get(loginLink).click();
    cy.get(emailIDTextBox).clear().type(username);
    cy.get(continueButton).click();
    cy.get(passwordTextBox).clear().type(password);
    cy.get(sigInButton).click();
  },
};
