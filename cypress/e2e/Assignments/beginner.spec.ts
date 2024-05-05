import { should } from "chai";

describe("Beginner Test Cases", () => {
  it("Locate the number of  Visible and clickable elements in the web page", () => {
    cy.visit("/");

    const locators = [
      '[data-cy="prolog_logo_landing_page"]',
      '[data-cy="dashboard_landing_page"]',
      '[data-cy="message_landing_page"]',
      '[aria-label="Open React Query Devtools"]',
    ];

    //Asserting visible elements
    cy.getVisibleElements(locators).should("eq", 4);

    //asserting clickable elements
    cy.getClickableElements(locators).should("eq", 3);
  });

  it("Verify the options in dashboard page", () => {
    cy.visit("/");
    cy.get('[data-cy="dashboard_landing_page"]').click();
    const data = {
      '[data-cy="Projects_options"]': "Projects",
    };
    const locators = [
      '[data-cy="Projects_options"]',
      '[data-cy="Issues_options"]',
      '[data-cy="Alerts_options"]',
      '[data-cy="Users_options"]',
      '[data-cy="Settings_options"]',
      '[data-cy="Support_options"]',
      '[data-cy="Collapse_options"]',
    ];
    const expectedNames = [
      "Projects",
      "Issues",
      "Alerts",
      "Users",
      "Settings",
      "Support",
      "Collapse",
    ];

    //asserting page url and page title
    cy.fixture("beginnerTestData").then((testData) => {
      cy.url().should("equal", testData.pageUrl);
      cy.title().should("equal", testData.pageTitle);
    });

    //asserting all the side panel options are clickable or not
    cy.getClickableElements(locators).then((clickableCount) => {
      expect(clickableCount).to.eq(7);
    });

    //Object.keys(data).forEach((key:string) => cy.getElementText(key).invoke('trim').should('eq', data[key]))
    //asserting the side panel options names
    locators.forEach((locator, index) => {
      cy.getElementText(locator).then((actualName) => {
        expect(actualName.trim()).to.equal(expectedNames[index]);
      });
    });
  });
  it("Verify the icons displayed in the side panel", () => {
    cy.visit("/");
    cy.get('[data-cy="dashboard_landing_page"]').click();

    const iconsData = [
      { locator: '[data-cy="Projects_options"]', icon: "/icons/projects.svg" },
      { locator: '[data-cy="Issues_options"]', icon: "/icons/issues.svg" },
      { locator: '[data-cy="Alerts_options"]', icon: "/icons/alert.svg" },
      { locator: '[data-cy="Users_options"]', icon: "/icons/users.svg" },
      { locator: '[data-cy="Settings_options"]', icon: "/icons/settings.svg" },
      { locator: '[data-cy="Support_options"]', icon: "/icons/support.svg" },
      {
        locator: '[data-cy="Collapse_options"]',
        icon: "/icons/arrow-left.svg",
      },
    ];
    const iconsLocator = ".menu-item-link__Icon-sc-c594be5e-2";

    //checking the icons are being repeated or not
    cy.get(iconsLocator).each((image, index) => {
      cy.wrap(image)
        .invoke("attr", "src")
        .then((src) => {
          cy.get(iconsLocator).each((otherImage, otherIndex) => {
            if (index !== otherIndex) {
              cy.wrap(otherImage)
                .invoke("attr", "src")
                .should("not.equal", src);
            }
          });
        });
    });

    //asserting the src attribute of the sidepanel icons and their uniqueness
    iconsData.forEach((iconData) => {
      cy.get(iconData.locator)
        .find("img")
        .should("have.attr", "src", iconData.icon);
      cy.get(iconData.locator).find("img").should("have.length", 1);
    });

    //asserting the color of the side panel
    cy.get(".sidebar-navigation__Nav-sc-339c7b81-7")
      .should("have.css", "color")
      .and("equal", "rgb(16, 24, 40)");
  });
  it("verify that the side panel is working or not", () => {
    const element = '[data-cy="Collapse_options"]';
    const locator = ".sidebar-navigation__Header-sc-339c7b81-2 img";
    const collapsed = "/icons/logo-small.svg";
    const expanded = "/icons/logo-large.svg";

    //asserting the side panel is colapsing and expanding or not
    cy.visit("/");
    cy.get('[data-cy="dashboard_landing_page"]').click();
    cy.get(element)
      .click()
      .get(locator)
      .eq(0)
      .should("have.attr", "src", collapsed)
      .get(element)
      .click()
      .get(locator)
      .eq(0)
      .should("have.attr", "src", expanded);
  });

  it("verify the projects page", () => {
    cy.visit("/");
    cy.get('[data-cy="dashboard_landing_page"]').click();

    //asserting the number of projects in the page
    cy.get(".project-card__Container-sc-c3c175f3-0").should((elements) => {
      const numberOfElements = elements.length;
      expect(numberOfElements).to.eq(3);
    });
    const iconsLocator = ".project-card__Name-sc-c3c175f3-5";

    //checking the uniquness of each project
    cy.get(iconsLocator).each((element, index) => {
      cy.wrap(element)
        .invoke("text")
        .then((elementText) => {
          cy.get(iconsLocator).each((otherElement, otherElementIndex) => {
            if (index !== otherElementIndex) {
              cy.wrap(otherElement)
                .invoke("text")
                .should("not.equal", elementText);
            }
          });
        });
    });

    //assering page title and page heading
    cy.fixture("beginnerTestData").then((testData) => {
      cy.title().should("equal", testData.pageTitle);
      cy.get(".page-container__Title-sc-7a0bc045-3")
        .invoke("text")
        .then((heading) => {
          expect(heading).to.eq(testData.project_page_heading);
        });
    });

    //checking the clickble links are navigating us to another page upon clicking
    cy.get(".project-card__ViewIssuesAnchor-sc-c3c175f3-12").each(
      (issueLink) => {
        cy.wrap(issueLink)
          .invoke("attr", "href")
          .then((href) => {
            cy.visit(`${href}`).wait(3000);
            cy.title().should("equal", "ProLog - Issues").go("back");
          });
      }
    );
  });
});
