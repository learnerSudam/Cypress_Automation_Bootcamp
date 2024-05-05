import { defineConfig } from "cypress";
import fs from "fs";
export default defineConfig({
  e2e: {
    defaultCommandTimeout: 30000,
    viewportHeight: 1080,
    viewportWidth: 1920,
    video: false,
    testIsolation: false,
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        log(message) {
          console.log(message);

          return `Yeilding ${message}`;
        },
        countFiles(folderName) {
          return new Promise((resolve, reject) => {
            fs.readdir(folderName, (err: any, files: string | any[]) => {
              if (err) {
                return reject(err);
              }
              console.log(`Number of files are ${files.length}`);
              resolve(files.length);
            });
          });
        },
        pause(ms) {
          return new Promise((resolve) => {
            setTimeout(() => resolve(null), ms);
          });
        },
      });
    },

    baseUrl: "http://localhost:3000/",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx,feature}",
    excludeSpecPattern: ["**/1-getting-started/*", "**/2-advanced-examples/*"],
  },
});
