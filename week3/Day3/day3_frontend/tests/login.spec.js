import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("should fail with wrong credentials", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Login").click();

    await page.fill('input[name="username"]', "wrongUser");
    await page.fill('input[name="password"]', "wrongPass");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=User not found")).toBeVisible();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Login").click();

    await page.fill('input[name="username"]', "123");
    await page.fill('input[name="password"]', "123");
    await page.click('button[type="submit"]');

    // await expect(page.locator("text=Login successful")).toBeVisible();

    // should redirect to dashboard
    await expect(page.getByRole("heading", { name: "Add Task" })).toBeVisible();
  });
});
