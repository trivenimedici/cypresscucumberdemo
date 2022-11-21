import { Given, And, Then, When } from "cypress-cucumber-preprocessor/steps";
import { HomePage } from "../pageObjects/HomePage.po";

When("User Clicks on MyProfile icon", () => {
  HomePage.clickOnMyProfileIcon();
});
