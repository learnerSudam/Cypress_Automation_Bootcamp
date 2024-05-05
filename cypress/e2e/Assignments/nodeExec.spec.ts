/// <reference types="Cypress" />

describe("beginner assignment", () => {
  it("Should check the list of clickable elements in the landing page", () => {
    cy.visit("/");
    cy.log("Executed");
  });
  it("Log text into Terminal", () => {
    cy.task("log", "Cypress is Awesome");
  });
  it("Count number of files in e2e folder", () => {
    cy.task("countFiles", "cypress/e2e").then((count) => {
      expect(count).to.be.eq(1);
    });
  });
  it("Wait for 5 Seconds", () => {
    cy.task("pause", 5000);
    cy.log("Waited for 5 Seconds");
  });
});
