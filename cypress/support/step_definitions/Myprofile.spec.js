import { Given, And, Then, When } from "cypress-cucumber-preprocessor/steps";
import { MyProfile } from "../pageObjects/MyProfile.po";

Then("My Profile page should be displayed correctly", () => {
  MyProfile.validateMyProfilePageDetails();
});

Then(
  "Username should be displayed correctly under profile gravator in MyProfileTab",
  (datatable) => {
    datatable.hashes().forEach((row) => {
      MyProfile.verifyUserNamenProfileGravator(row.Username);
    });
  }
);

And("User should have logout button enabled for MyProfileTab", () => {
  MyProfile.verifyLogoutButton();
});

And("Sidebar menu should be displayed correctly for MyProfileTab", () => {
  MyProfile.verifySideMenuLinks();
});

And(
  "User data should be auto-populated correctly in profile for MyProfileTab",
  () => {
    MyProfile.verifyAutoPopulatedDataMyProfile();
  }
);

And(
  "All fields in profile should be displayed correctly for MyProfileTab",
  () => {
    MyProfile.verifyFieldsMyProfile();
  }
);

And("User updates profile details", (datatable) => {
  datatable.hashes().forEach((row) => {
    MyProfile.updateProfileDetails(
      row.firstName,
      row.lastName,
      row.displayName,
      row.AboutMe
    );
  });
});

Then("User saves the details", () => {
  MyProfile.saveDetails();
});

And("Verify success message is displayed correctly", () => {
  MyProfile.verifySuccessMessage();
});

And("Clicks on Toogle button to Hide or UnHide my gravator", () => {
  MyProfile.clickToggleInputButton();
});

Then("No sites should be displayed under Profile Links", () => {
  MyProfile.verifyNoProfileLinksStatus();
});

And("User adds {string} in Profile Links", (profilelink) => {
  MyProfile.addProfileLinks(profilelink);
});

Then("Site should be added successfully", () => {
  MyProfile.verifySiteAddedSuccessMessage();
});

When("User deletes the added site", () => {
  MyProfile.deleteAddedSite();
});

Then("Site should be deleted successfully", () => {
  MyProfile.verifySiteDeletedMessage();
});

When("User updated the details back to original data", () => {
  MyProfile.updateSiteDetailsBack();
});
