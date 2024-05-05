import { includes } from "lodash";
import { json } from "stream/consumers";

describe("Advance Assignment", () => {
  it("Navigate to the Issues page and get the issues from all the pages and validate whether the same count is being displayed in the Projects page.", () => {
    const issuesCount: { [key: string]: number } = {
      Frontend: 0,
      Backend: 0,
      ML: 0,
    };
    const levelCountArray = [
      {
        name: "Frontend Project",
        error: 0,
        warning: 0,
        info: 0,
      },
      {
        name: "Backend Project",
        error: 0,
        warning: 0,
        info: 0,
      },
      {
        name: "ML Services",
        error: 0,
        warning: 0,
        info: 0,
      },
    ];
    const ActualIssuesCount = { frontend: "", backend: "", ml_services: "" };
    cy.visit("/");
    cy.get('[data-cy="dashboard_landing_page"]').click();
    cy.get('[data-cy="Issues_options"]').click();
    cy.intercept("GET", `https://prolog-api.profy.dev/issue?page=1`).as(
      `issuePageApi1`
    );
    cy.intercept("GET", `https://prolog-api.profy.dev/issue?page=2`).as(
      `issuePageApi2`
    );
    cy.wait(`@issuePageApi1`).then((xhr: any) => {
      cy.getIssueAndLevelCountOfEachProject(xhr, issuesCount, levelCountArray);
    });
    cy.wait(`@issuePageApi2`).then((xhr: any) => {
      cy.getIssueAndLevelCountOfEachProject(xhr, issuesCount, levelCountArray);
    });
    for (let page = 3; page <= 10; page++) {
      const apiAlias = `issuePageApi${page}`;
      const apiUrl = `https://prolog-api.profy.dev/issue?page=${page}`;
      cy.intercept("GET", apiUrl).as(apiAlias);
      cy.contains(
        ".issue-list__PaginationButton-sc-e01bbd73-5",
        "Next"
      ).click();
      cy.wait(`@${apiAlias}`).then((xhr: any) => {
        cy.getIssueAndLevelCountOfEachProject(
          xhr,
          issuesCount,
          levelCountArray
        );
      });
    }
    cy.get('[data-cy="Projects_options"]').click();
    Object.keys(issuesCount).forEach((key: string) => {
      const value = issuesCount[key];
      cy.get(".project-card__Container-sc-c3c175f3-0.ckyVAy").each(
        (element) => {
          const project = element;

          cy.wrap(project)
            .find(".project-card__Name-sc-c3c175f3-5.cjmixA")
            .invoke("text")
            .then((element_text) => {
              if (element_text.includes(key)) {
                cy.wrap(project)
                  .find(".project-card__IssuesNumber-sc-c3c175f3-10.eRJwqH")
                  .eq(0)
                  .invoke("text")
                  .then((text) => {
                    const numericValue = parseFloat(text);
                    cy.wrap(numericValue).should("eq", issuesCount[key]);
                  });
              }
            });
        }
      );
    });

    cy.wrap(levelCountArray).each((levelCount: any) => {
      if (levelCount.name === "Frontend Project") {
        cy.wrap(levelCount.error).should("eq", 39);
        cy.wrap(levelCount.warning).should("eq", 28);
        cy.wrap(levelCount.info).should("eq", 6);
      }
      if (levelCount.name === "Backend Project") {
        cy.wrap(levelCount.error).should("eq", 0);
        cy.wrap(levelCount.warning).should("eq", 19);
        cy.wrap(levelCount.info).should("eq", 6);
      }
      if (levelCount.name === "ML Services") {
        cy.wrap(levelCount.error).should("eq", 0);
        cy.wrap(levelCount.warning).should("eq", 0);
        cy.wrap(levelCount.info).should("eq", 0);
      }
    });
  });
  it("Mock the API response in the projects page to display the data that is mocked", () => {
    cy.visit("/");
    cy.intercept("GET", "https://prolog-api.profy.dev/project", {
      fixture: "mocked_projects.json",
    }).as("projectApiCall");
    cy.get('[data-cy="dashboard_landing_page"]').click();
    cy.wait("@projectApiCall");
    cy.fixture("mocked_projects.json").then((mockedProjectes) => {
      for (const project of mockedProjectes) {
        cy.get(".project-card__Container-sc-c3c175f3-0.ckyVAy").each(
          (element) => {
            cy.wrap(element)
              .find(".project-card__Name-sc-c3c175f3-5.cjmixA")
              .invoke("text")
              .then((projectName) => {
                if (project.name === projectName) {
                  cy.wrap(projectName).should("eq", project.name);
                  cy.wrap(element)
                    .find(".project-card__IssuesNumber-sc-c3c175f3-10.eRJwqH")
                    .eq(0)
                    .invoke("text")
                    .then((text) => {
                      const numericValue = parseFloat(text);
                      cy.wrap(numericValue).should("eq", project.numIssues);
                    });
                  cy.wrap(element)
                    .find(".project-card__IssuesNumber-sc-c3c175f3-10.eRJwqH")
                    .eq(1)
                    .invoke("text")
                    .then((text) => {
                      const numericValue = parseFloat(text);
                      cy.wrap(numericValue).should("eq", project.numEvents24h);
                    });
                }
              });
          }
        );
      }
    });
  });
  it("Mock the API response in the issues page, and verify whether the number of rows are rendered according to the data that is given", () => {
    cy.visit("/");
    cy.get('[data-cy="dashboard_landing_page"]').click();
    cy.intercept("GET", "https://prolog-api.profy.dev/issue?page=1", {
      fixture: "mocked_issues.json",
    }).as("issuesPageApiCall1");
    cy.get('[data-cy="Issues_options"]').click();
    cy.wait("@issuesPageApiCall1");
    cy.fixture("mocked_issues.json").then((mockedData) => {
      const no_of_expected_rows = mockedData.items.length;
      cy.get(".issue-row__Row-sc-ddbdc46b-0.jFYkgG").should(
        "have.length",
        no_of_expected_rows
      );
      for (let i = 0; i <= 6; i++) {
        cy.get(".issue-row__ErrorType-sc-ddbdc46b-5.fokoom")
          .eq(i)
          .invoke("text")
          .then((text) => {
            const updatedText = text.replace(/:/g, "");
            cy.log(`${updatedText}`);
            cy.log(mockedData.items[i].name);
            expect(updatedText.trim()).to.eq(mockedData.items[i].name);
          });
      }
    });
  });
});
