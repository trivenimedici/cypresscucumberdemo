import { Given, And, Then, When } from "cypress-cucumber-preprocessor/steps";
import { LoginPage } from "../pageObjects/LoginPage.po";

Given("User login to the application", () => {
  LoginPage.visit();
  LoginPage.appSignIn();
});
