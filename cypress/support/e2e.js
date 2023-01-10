// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
/// <reference types="Cypress" />
/// <reference types="Cypress-xpath" />
// Import commands.js using ES2015 syntax:
import './commands_ui'
import './commands_api'
import "cypress-real-events"
// import '@shelex/cypress-allure-plugin'
import '@bahmutov/cy-api'
// import setup from 'cypress-cy-select'
// setup()

require('cypress-grep')()
import 'cypress-xpath'
// require('@shelex/cypress-allure-plugin')
// Alternatively you can use CommonJS syntax:
// require('./commands')

const app = window.top

if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML =
        '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');

    app.document.head.appendChild(style);
}
// Cypress.on('window:before:load', (win) => {
// 	cy.spy(win.console, 'error');
// 	cy.spy(win.console, 'warn');
// 	cy.spy(win.console, 'log');
//   })
//   Cypress.on('log:added',  (logObject) => console.log(logObject))
Cypress.on('uncaught:exception', (err, runnable) => {
    //expect(err.message).to.include('of null')
    //expect(err.message).to.include('Cannot read properties of')
    return false;
});

// Cypress.on('fail', (err) => {
// 	debugger;
// });

Cypress.Server.defaults({
    delay: 500,
    force404: false,
    whitelist: xhr => {
        // handle custom logic for whitelisting
        return true
    },
})

after(() => {
    cy.clearCookies({ domain: null })
    //cy.clearAllCookies()
})

afterEach(() => {
    Cypress.session.clearCurrentSessionData()
    // cy.clearCookies({ domain: null })
    // cy.clearAllCookies()
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
})