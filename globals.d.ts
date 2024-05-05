declare namespace Cypress {
  interface Chainable {
    getDataCy(value: string): Chainable<JQuery<HTMLElement>>;
    getVisibleElements(dataArray: string[]): Chainable<number>;
    getClickableElements(dataArray: string[]): Chainable<number>;
    getElementText(data: string): Chainable<string>;
    compareSvgIconOfLandingPage(iconName: string): void;
    blockSvgAPIAndCompareSvgIconOfLandingPage(iconName: string): void;
    blockSvgAPIAndCompareSvgIconOfDashboardPage(iconName: string): void;
    saveInterceptedData(intercept: any): void;
    getIssueAndLevelCountOfEachProject(
      xhr: any,
      issuesCount: any,
      issuesCountArray: any
    ): void;
  }
}
