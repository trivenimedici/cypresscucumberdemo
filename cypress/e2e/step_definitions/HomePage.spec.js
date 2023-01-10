import { Given, And, Then, When } from "cypress-cucumber-preprocessor/steps";
import { HomePage } from "../pageObjects/HomePage.po";

When("User Clicks on MyProfile icon", () => {
  HomePage.clickOnMyProfileIcon();
});

afterEach(() => {
  // Cypress.session.clearCurrentSessionData()
  Cypress.on('uncaught:exception', (err, runnable) => {
    //	expect(err.message).to.include('One of the specified object stores was not found')
    return false
  })
});
