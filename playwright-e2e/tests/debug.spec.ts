import { test, expect } from "@playwright/test";

test("basic page load test", async ({ page }) => {
  await page.goto("http://localhost:80/");

  await expect(page.locator("h1")).toHaveText("Home", {
    timeout: 10000,
  });
});
