// playwright.config.js
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:5173", // change if needed
    headless: true,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev", // start your frontend
    port: 5173, // match your dev server port
  },
  reporter: [
    ["list"], // default console
    ["html", { open: "never" }], // HTML report
    ["json", { outputFile: "reports/test-results.json" }], // JSON report
    ["junit", { outputFile: "reports/junit-results.xml" }], // JUnit for CI
  ],
});
