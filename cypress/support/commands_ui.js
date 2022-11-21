
import '@testing-library/cypress/add-commands'
import 'cypress-wait-until';


Cypress.Commands.add("removeDomElement", (selector) => {
  cy.document({ log: false }).then(($document) => {
    const documentResult = $document.querySelectorAll(selector)
    if (documentResult.length) {
      cy.get(selector).then($el => {
        $el.remove()
        cy.log('Element removed in the DOM')
      })
    }
  })
})

Cypress.Commands.add('', (locator, item, expectedText) => {
  cy.get(locator)
    .eq(item)
    .should("contain", expectedText)
})


Cypress.Commands.add('shouldContainRegex', (locator, regex) => {
  cy
    .highlightBorderElement(locator, 'magenta')

  cy.get(locator)
    .contains(regex)
    .should('exist')

  cy
    .highlightBorderElement(locator, 'transparent')
});

Cypress.Commands.add('elementShould', (locator, item, chainer, expectedText) => {
  cy
    .highlightBorderElement(locator, 'magenta')

  cy.get(locator)
    .eq(item)
    .should(chainer, expectedText)

  cy
    .highlightBorderElement(locator, 'transparent')
});

Cypress.Commands.add('shouldExist', (locator, chainer) => {
  cy
    .highlightBorderElement(locator, 'magenta')

  cy.get(locator)
    .should('exist')

  cy
    .highlightBorderElement(locator, 'transparent')
});

// -- Method to force click one element   --
Cypress.Commands.add('forceClick', { prevSubject: 'element' }, (locator) => {
  cy.get(locator).click({ force: true })
});

// -- Method to force click multiple elements--
Cypress.Commands.add('forceMultipleClick', { prevSubject: 'element' }, (subject, options) => {
  cy.wrap(subject).click({ multiple: true })
});

// -- Method to visit URL and wait for server response --
Cypress.Commands.add("navigateTo", (methodRequest, urlToIntercept, alias, url, statusCode) => {
  cy.intercept({
    method: methodRequest,
    url: urlToIntercept,
  }).as(alias)

  cy
    .visit(url)

  cy
    .wait(`@${alias}`)
    .its('response.statusCode')
    .should('eq', statusCode)
})

// -- Method to click an element and wait for server response --
Cypress.Commands.add("clickElement", (methodRequest, urlToIntercept, alias, elementToClick, statusCode) => {
  cy.intercept({
    method: methodRequest,
    url: urlToIntercept,
  }).as(alias)

  cy
    .highlightBorderElement(elementToClick, 'magenta')

  cy
    .get(elementToClick)
    .click()

  cy
    .wait(`@${alias}`)
    .its('response.statusCode')
    .should('eq', statusCode)

  cy
    .highlightBorderElement(elementToClick, 'transparent')
})

// -- Method to click an element if contains and wait for server response --
Cypress.Commands.add("clickElementIfContain", (methodRequest, urlToIntercept, alias, elementContent, statusCode) => {
  cy.intercept({
    method: methodRequest,
    url: urlToIntercept,
  }).as(alias)

  cy
    .highlightBorderElement(elementContent, 'magenta')

  cy
    .contains(elementContent)
    .click()
  cy
    .wait(`@${alias}`)
    .its('response.statusCode')
    .should('eq', statusCode)

  cy
    .highlightBorderElement(elementContent, 'transparent')
})

// -- Method to click an element if contains and wait for server response --
Cypress.Commands.add("interceptUrl", (methodRequest, urlToIntercept, alias, statusCode) => {
  cy.intercept({
    method: methodRequest,
    url: urlToIntercept,
  }).as(alias)

  cy
    .wait(`@${alias}`)
    .its('response.statusCode')
    .should('eq', statusCode)
})

Cypress.Commands.add('console', { prevSubject: true, }, (subject, method) => {
  method = method || 'log'
  // log the subject to the console
  console[method]('The subject is', subject)
  return subject
})

// let's make a custom command to read the values from the list
Cypress.Commands.add('grabList', (selector) => {
  const grabbedList = []
  cy.log(`grabList **${selector}**`)
  cy.get(selector)
    .each(($li) => {
      // let's not even parse anything
      grabbedList.push($li.text())
    })
    // yield the grabbed list using either wrap or then
    .then(() => grabbedList)
})


Cypress.Commands.add('disableSmoothScroll', () => {
  cy.document().then(document => {
    const node = document.createElement('style');
    node.innerHTML = 'html { scroll-behavior: inherit !important; }';
    document.body.appendChild(node);
  });
})



Cypress.Commands.add('forceVisit', url => {
  cy.window().then(win => {
    return win.open(url, '_self');
  });
});

// -- Method to click an element if contains and wait for server response --
Cypress.Commands.add("clickElementStubbingResponseByBody", (methodRequest, urlToIntercept, stubBody, alias, elementToClick, statusCode) => {
  cy.intercept({
    method: methodRequest,
    url: urlToIntercept
  }, {
    body: stubBody
  }).as(alias)

  cy
    .highlightBorderElement(elementToClick, 'magenta')

  cy
    .get(elementToClick)
    .click()

  cy
    .wait(`@${alias}`)
    .its('response.statusCode')
    .should('eq', statusCode)

  cy
    .highlightBorderElement(elementToClick, 'transparent')
})


Cypress.Commands.add('swipeUp', (locator) => {
  cy.get(locator)
    .trigger('mousedown')
    .trigger('mousemove', { clientX: 100, clientY: 275 })
    .trigger('mouseup', { force: true })
})


Cypress.Commands.add('highlightBorderElement', (locator, color) => {
  cy.get(locator, { log: false })
    .then($button => $button.css('border', `2px solid ${color}`))

  cy.wait(250, { log: false })
})

Cypress.Commands.add('waitTillSpinnerDisappears', (locator) => {
  cy.get(locator, { timeout: 10000 }).should('have.css', 'display', 'none')
})

Cypress.Commands.add('waitTillElementDisappears', (locator, attribute, attrvalue) => {
  cy.get(locator).then($newVal => {
    cy.waitUntil(() => $newVal.attr(attribute) !== attrvalue, {
      errorMsg: "was expecting element to disappear but is not disappeared",
      timeout: 10000,
      interval: 500
    }).then(() => {
      cy.log("Found a difference in values")
    })
  })
})

Cypress.Commands.add('waitTillElementExists', (locator) => {
  cy.get(locator, { timeout: 10000 }).should('exist')
})

Cypress.Commands.add('waitTillElementNotExists', (locator) => {
  cy.get(locator, { timeout: 50000 }).should('not.exist')
})

Cypress.Commands.add('checkElementPresentByText', (text) => {
  //return  ( ( document.evaluate("//*[.='"+text+"']",   document, null, XPathResult.ANY_TYPE, null).textContent || document.evaluate("//*[.='"+text+"']",   document, null, XPathResult.ANY_TYPE, null).innerText ).indexOf(text) > -1)
  var headings = document.evaluate("//*[@alt='" + text + "']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  console.log("the heading is " + headings.snapshotLength)
  var thisHeading = headings.iterateNext()
  console.log("the thisHeading is " + thisHeading)
  while (thisHeading) {
    thisHeading = headings.iterateNext()
  }
  console.log('the heading value' + thisHeading)
  return (headings.indexOf(text) - 1)
})

Cypress.Commands.add('goOffline', () => {
  cy.log('**go offline**')
  Cypress.automation('remote:debugger:protocol', {
    command: 'Network:enable',
  })
  Cypress.automation('remote:debugger:protocol', {
    command: 'Network.emulateNetworkConditions',
    params: {
      offline: true,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0,
      connectionType: 'none',
    },
  })
})

Cypress.Commands.add('goOnline', () => {
  cy.log('**go online**')
  Cypress.automation('remote:debugger:protocol', {
    command: 'Network:disable',
  })
  Cypress.automation('remote:debugger:protocol', {
    command: 'Network.emulateNetworkConditions',
    params: {
      offline: false,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0,
      connectionType: 'none',
    },
  })
})

Cypress.Commands.add('assertOnline', () => {
  cy.waitUntil(() => cy.wrap(window).its('navigator.onLine').should('be.true'), {
    errorMsg: "was expecting network to be online but it is offline",
    timeout: 10000,
    interval: 500
  }).then(() => {
    cy.log("the network is online")
  })

})

Cypress.Commands.add('assertOffline', () => {
  return cy.wrap(window).its('navigator.onLine').should('be.false')
})

Cypress.Commands.add('assertAttrContainsValue', (locator, attr, value) => {
  cy.get(locator).then(($els) => {
    const attrvalue = $els.attr(attr)
    expect(attrvalue).contains(value)
  })
})

Cypress.Commands.add("clickElementInterceptResponse", (methodRequest, urlToIntercept, alias, elementToClick, statusCode) => {
  cy.intercept({ method: methodRequest, url: urlToIntercept, }).as(alias)
  cy.highlightBorderElement(elementToClick, 'magenta')
  cy
    .get(elementToClick)
    .click()

  cy
    .wait(`@${alias}`)
    .its('response.statusCode')
    .should('eq', statusCode)

  cy.highlightBorderElement(elementToClick, 'transparent')
})


Cypress.Commands.add('forceVisit', url => {
  cy.window().then(win => {
    return win.open(url, '_self');
  });
})

Cypress.Commands.add("toTitleCase", (str) => {
  return str.replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
})