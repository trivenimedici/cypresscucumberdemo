const pageTitle = ".formatted-header > h1";
const profileImage = ".animate__appear > .gravatar";
const userdisplayName = ".profile-gravatar__user-display-name";
const userSecondaryInfo = ".profile-gravatar__user-secondary-info";
const logoutButton = ".sidebar__me-signout > .button";
const sideBarItems = ".sidebar__menu-link >span";
const sectionHeaders = "div.section-header__label > span";
const firstName = "#first_name";
const displayName = "#display_name";
const lastName = "#last_name";
const aboutMe = "#description";
const editGravatarExp = ".edit-gravatar__explanation";
const profileLinkLabel = ".profile__link-destination-label-lead";
const toggleInput = ".components-form-toggle__input";
const myProfileSelectedLink = "span:contains('My Profile')";
const saveDetailsButton = ".profile__submit-button-wrapper > .button";
const successMessage = ".notice__text";
const profileLinkManageMessage =
  "p:contains('Manage which sites appear in your profile.')";
const profileNoLinkMessage = ".profile-links__no-links";
const profileLinkAddButton = ".section-header__actions > .button";
const addWordPressSiteLink = ".popover__menu > :nth-child(1)";
const addURLSiteLink = ".popover__menu > :nth-child(2)";
const selectCheckBoxWordPressSite = ".profile-links-add-wordpress__checkbox";
const addSiteButton = "button:contains('Add Site')";
const siteLists = ".profile-link";
const deleteProfileLinkButton = ".profile-link__remove";
const enterURLTextBoxProfileLink = "[placeholder='Enter a URL']";
const enterDescTextBoxProfileLink = "[placeholder='Enter a description']";

export const MyProfile = {
  validateMyProfilePageDetails() {
    cy.get(pageTitle).contains("My Profile");
    cy.get(myProfileSelectedLink).length > 0;
    cy.get(profileImage)
      .should("be.visible")
      .filter("[src]")
      .filter(":visible")
      .should(($imgs) =>
        $imgs.map((i, /** @type {HTMLImageElement} */ img) =>
          expect(img.naturalWidth).to.be.greaterThan(0)
        )
      );
  },

  verifyUserNamenProfileGravator(nametoDisplay) {
    cy.get(userdisplayName).contains(nametoDisplay);
    cy.get(userSecondaryInfo).contains(nametoDisplay);
  },

  verifyLogoutButton() {
    cy.get(logoutButton).should("be.enabled").contains("Log out");
  },

  verifySideMenuLinks() {
    cy.get(sideBarItems)
      .should("have.length", 9)
      .then(($els) => {
        return Cypress.$.makeArray($els).map((el) => el.innerText);
      })
      .should("deep.equal", [
        "My Profile",
        "Account Settings",
        "Purchases",
        "Security",
        "Privacy",
        "Manage Blogs",
        "Notification Settings",
        "Blocked Sites",
        "Get Apps",
      ]);
  },

  verifyAutoPopulatedDataMyProfile() {
    cy.get(firstName).should("have.value", Cypress.env("env").firstName);
    cy.get(lastName).should("have.value", Cypress.env("env").lastName);
    cy.get(displayName).should("have.value", Cypress.env("env").displayName);
    cy.get(aboutMe).should("have.value", Cypress.env("env").aboutMeText);
  },

  verifyFieldsMyProfile() {
    cy.get(editGravatarExp).contains("Your profile photo is public.");
    cy.get(profileLinkLabel).contains("Hide my Gravatar profile.");
    cy.get(toggleInput).should("be.enabled");
    cy.get(saveDetailsButton).should("have.attr", "disabled");
    cy.get(sectionHeaders).eq(1).contains("Profile Links");
    cy.get(sectionHeaders).eq(0).contains("Profile");
  },

  updateProfileDetails(
    updatedFirstName,
    updatedLastName,
    UpdatedDisplayName,
    UpdatedAboutMe
  ) {
    cy.get(firstName).clear().type(updatedFirstName);
    cy.get(lastName).clear().type(updatedLastName);
    cy.get(displayName).clear().type(UpdatedDisplayName);
    cy.get(aboutMe).clear().type(UpdatedAboutMe);
  },

  saveDetails() {
    cy.get(saveDetailsButton).click();
  },

  verifySuccessMessage() {
    cy.get(successMessage).contains("Settings saved successfully!");
  },

  clickToggleInputButton() {
    cy.get(toggleInput).click();
  },

  verifyNoProfileLinksStatus() {
    cy.get(profileLinkManageMessage).contains(
      "Manage which sites appear in your profile."
    );
    cy.get(profileNoLinkMessage).length > 0;
  },

  addProfileLinks(profilelink) {
    cy.get(profileLinkAddButton).click();
    if (profilelink == "WordPress Site") {
      cy.get(addWordPressSiteLink).click();
      cy.get(selectCheckBoxWordPressSite).click();
      cy.get(addSiteButton).click();
    } else {
      cy.get(addURLSiteLink).click();
      cy.get(enterURLTextBoxProfileLink).type("test.com");
      cy.get(enterDescTextBoxProfileLink).type("test");
      cy.get(addSiteButton).click();
    }
  },

  verifySiteAddedSuccessMessage() {
    cy.get(siteLists).should("exist");
  },

  deleteAddedSite() {
    cy.get(deleteProfileLinkButton).click();
  },

  verifySiteDeletedMessage() {
    cy.get(profileNoLinkMessage).length > 0;
  },

  updateSiteDetailsBack() {
    cy.get(firstName).clear().type(Cypress.env("env").firstName);
    cy.get(lastName).clear().type(Cypress.env("env").lastName);
    cy.get(displayName).clear().type(Cypress.env("env").displayName);
    cy.get(aboutMe).clear().type(Cypress.env("env").aboutMeText);
  },
};
