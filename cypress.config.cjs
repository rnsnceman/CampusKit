const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CAMPUSKIT_E2E_URL || "http://127.0.0.1:5002",
    specPattern: "e2e/**/*.cy.js",
    video: true,
    screenshotOnRunFailure: true,
  },
});
