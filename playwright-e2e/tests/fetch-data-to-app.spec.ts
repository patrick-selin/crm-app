import { test, expect } from "@playwright/test";

test.describe("App data fetching with backend", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:80/");
  });

  test("should display the first fetched test data from the server/db in the <main>-tag", async ({
    page,
  }) => {
    await expect(page.locator("h1")).toHaveText("Home", { timeout: 10000 });

    const firstItem = page.locator("main li").first();
    await expect(firstItem).toHaveCount(1, { timeout: 10000 });

    await expect(firstItem.locator("h3")).toHaveText("Test Word 1", {
      timeout: 10000,
    });
    await expect(firstItem.locator("p")).toHaveText("Important", {
      timeout: 10000,
    });

    await page.screenshot({ path: "screenshot.png" });
  });
});
