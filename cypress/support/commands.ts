/// <reference types="cypress" />
import { v4 as uuidv4 } from "uuid";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
// Function to check if the element exists

Cypress.Commands.add("getDataCy", (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add("getVisibleElements", (locators: string[]) => {
  let count = 0;
  locators.forEach((locator) => {
    if (cy.get(locator).should("be.visible")) {
      count++;
    }
  });
  return cy.wrap(count);
});

Cypress.Commands.add("getClickableElements", (locators: string[]) => {
  let count = 0;
  locators.forEach((locator) => {
    cy.get(locator)
      .trigger("mouseover") // Simulate mouseover event
      .invoke("css", "cursor")
      .as("text") // Get the 'cursor' CSS property
      .then((cursorValue) => {
        if (cursorValue.toString() === "pointer") {
          count++;
        }
        return cy.wrap(count);
      });
  });
});

Cypress.Commands.add("getElementText", (locator) => {
  return cy.get(locator).invoke("text");
});

Cypress.Commands.add("compareSvgIconOfLandingPage", (iconName: string) => {
  cy.intercept("GET", `**/icons/${iconName}`).as(`${iconName} Api`);
  cy.visit("/");
  cy.wait(`@${iconName} Api`);
  cy.get(`@${iconName} Api`).then((xhr: any) => {
    cy.readFile(`public/icons/${iconName}`).as(`${iconName} File`);
    cy.get(`@${iconName} File`).should("eq", xhr.response.body);
  });
});

Cypress.Commands.add(
  "blockSvgAPIAndCompareSvgIconOfLandingPage",
  (iconName: string) => {
    cy.intercept("GET", `**/icons/${iconName}`, {
      statusCode: 500,
      body: {},
    }).as(`${iconName} Api`);
    cy.visit("/");
    cy.wait(`@${iconName} Api`);
    cy.get(`@${iconName} Api`).then((xhr: any) => {
      cy.readFile(`public/icons/${iconName}`).as(`${iconName} File`);
      cy.get(`@${iconName} File`).should("not.equal", xhr.response.body);
    });
  }
);

Cypress.Commands.add(
  "blockSvgAPIAndCompareSvgIconOfDashboardPage",
  (iconName: string) => {
    cy.intercept("GET", `**/icons/${iconName}`, {
      statusCode: 500,
      body: {},
    }).as(`${iconName} Api`);
    cy.visit("/");
    cy.get('[data-cy="dashboard_landing_page"]').click();
    cy.wait(`@${iconName} Api`);
    cy.get(`@${iconName} Api`).then((xhr: any) => {
      cy.readFile(`public/icons/${iconName}`).as(`${iconName} File`);
      cy.get(`@${iconName} File`).should("not.equal", xhr.response.body);
    });
  }
);

Cypress.Commands.add("saveInterceptedData", (intercept: any) => {
  const url = intercept.request.url;
  const uniqueFilename = uuidv4();
  cy.log(uniqueFilename);
  cy.writeFile(`cypress/API_Data/${uniqueFilename}.json`, intercept);
});

Cypress.Commands.add(
  "getIssueAndLevelCountOfEachProject",
  (xhr: any, issueCountObject: any, levelCountArray: any) => {
    for (const item of xhr.response.body.items) {
      if (item.projectId === "6d5fff43-d691-445d-a41a-7d0c639080e6") {
        issueCountObject.Frontend++;
        if (item.level === "error") {
          levelCountArray[0].error++;
        } else if (item.level === "warning") {
          levelCountArray[0].warning++;
        } else if (item.level === "info") {
          levelCountArray[0].info++;
        }
      } else if (item.projectId === "340cb147-6397-4a12-aa77-41100acf085f") {
        issueCountObject.Backend++;
        if (item.level === "error") {
          levelCountArray[1].error++;
        } else if (item.level === "warning") {
          levelCountArray[1].warning++;
        } else if (item.level === "info") {
          levelCountArray[1].info++;
        }
      }
    }
  }
);

// Cypress.Commands.add('isElementFound', (selector: string) => {
//   return cy.get(selector)
//     .then((element) => {
//       // The element is found and present in the DOM
//       return true;
//     })
//     .catch((error:any) => {
//       // The element is not found or not present in the DOM
//       return false;
//     });
//   });

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
