describe("Moderate Assignment", () => {
  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });
  it("compare whether the images / icons displayed are same as the ones, that are provided (Take the source images from code base)", () => {
    const landingPageIconNames = ["logo-large.svg", "message.svg"];
    cy.compareSvgIconOfLandingPage("logo-large.svg");
  });

  it("Navigate to the Issues page in Dashboard and assert the page heading and title, Verify whether every page displays only 10 rows or less", () => {
    cy.visit("/");
    cy.get('[data-cy="dashboard_landing_page"]').click();
    cy.get('[data-cy="Issues_options"]').click();
    const totalPages = 10;
    cy.contains(".issue-list__PaginationButton-sc-e01bbd73-5", "Next").then(
      (nextButton) => {
        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
          cy.url().should("include", "http://localhost:3000/dashboard/issues");
          cy.get(".issue-row__Row-sc-ddbdc46b-0").should(
            "have.length.at.most",
            10
          );
          if (currentPage === 1) {
            cy.contains(
              ".issue-list__PaginationButton-sc-e01bbd73-5",
              "Previous"
            ).should("have.attr", "disabled");
          } else {
            cy.contains(
              ".issue-list__PaginationButton-sc-e01bbd73-5",
              "Previous"
            ).should("not.have.attr", "disabled");
          }
          if (currentPage < totalPages) {
            cy.wrap(nextButton).click();
            cy.wait(500);
          }
          if (currentPage === totalPages) {
            cy.contains(
              ".issue-list__PaginationButton-sc-e01bbd73-5",
              "Next"
            ).should("have.attr", "disabled");
          }
        }
      }
    );
  });

  it("Assert that each and every column in issues table is populated with the respective values, and not empty", () => {
    cy.visit("/");
    cy.get('[data-cy="dashboard_landing_page"]').click();
    cy.get('[data-cy="Issues_options"]').click();
    const totalPages = 10;
    cy.contains(".issue-list__PaginationButton-sc-e01bbd73-5", "Next").then(
      (nextButton) => {
        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
          cy.get(".issue-row__Cell-sc-ddbdc46b-1").each((column) => {
            cy.wrap(column).should("not.be.empty");
          });
          cy.get(".issue-row__Row-sc-ddbdc46b-0").each((row) => {
            cy.wrap(row)
              .find(".badge__Container-sc-103c16c4-0")
              .invoke("text")
              .then((cellText) => {
                expect(["Error", "Warning", "Info"]).to.include(
                  cellText.trim()
                );
              });
            cy.wrap(row)
              .find(".issue-row__Cell-sc-ddbdc46b-1")
              .eq(2)
              .invoke("text")
              .should("match", /^\d+$/);
            cy.wrap(row)
              .find(".issue-row__Cell-sc-ddbdc46b-1")
              .eq(3)
              .invoke("text")
              .should("match", /^\d+$/);
          });
          if (currentPage < totalPages) {
            cy.wrap(nextButton).click();
            cy.wait(1000);
          }
        }
      }
    );
  });

  it("block all the images in all the pages, and assert whether those images/icons are getting displayed", () => {
    const landingPageIconNames = ["logo-large.svg", "message.svg"];
    const dashBoardPageIconNames = [
      "logo-large.svg",
      "menu.svg",
      "projects.svg",
      "issues.svg",
      "alert.svg",
      "users.svg",
      "settings.svg",
      "support.svg",
      "arrow-left.svg",
      "react.svg",
      "node.svg",
      "python.svg",
    ];
    landingPageIconNames.forEach((iconName) => {
      cy.blockSvgAPIAndCompareSvgIconOfLandingPage(iconName);
    });
    dashBoardPageIconNames.forEach((iconName) => {
      cy.blockSvgAPIAndCompareSvgIconOfDashboardPage(iconName);
    });
  });

  it("Store all the API requests and responses by navigating to each and every page in the application and store it in a file", () => {
    cy.intercept("GET", "**/_devMiddlewareManifest.json").as(
      "landingPageApiCall"
    );
    cy.visit("/");
    cy.wait("@landingPageApiCall").then((intercept: any) => {
      cy.saveInterceptedData(intercept);
    });
    cy.intercept("GET", "https://prolog-api.profy.dev/project").as(
      "projectApiCall"
    );
    cy.get('[data-cy="dashboard_landing_page"]').click();
    cy.wait("@projectApiCall").then((intercept: any) => {
      cy.saveInterceptedData(intercept);
    });
    cy.intercept("GET", "https://prolog-api.profy.dev/issue?page=1").as(
      "issuesPageApiCall1"
    );
    cy.intercept("GET", "https://prolog-api.profy.dev/issue?page=2").as(
      "issuesPageApiCall2"
    );
    cy.get('[data-cy="Issues_options"]').click();
    cy.wait("@issuesPageApiCall1").then((intercept) => {
      cy.saveInterceptedData(intercept);
    });
    cy.wait("@issuesPageApiCall2").then((intercept) => {
      cy.saveInterceptedData(intercept);
    });
  });
});
