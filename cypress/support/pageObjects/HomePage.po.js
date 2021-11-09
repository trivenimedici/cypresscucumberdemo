const myProfileIcon = ".masterbar__item-me";

export const HomePage = {
  clickOnMyProfileIcon() {
    cy.get(myProfileIcon).click();
  },
};
