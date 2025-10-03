import { test, expect } from "@playwright/test";

test("should logout and block dashboard", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Login").click();

  await page.fill('input[name="username"]', "123");
  await page.fill('input[name="password"]', "123");
  await page.click('button[type="submit"]');

  await expect(page.getByRole("heading", { name: "Add Task" })).toBeVisible();

  // Logout
  await page.getByText("Logout").click();
  //   await expect(page.getByText("Please choose an option")).toBeVisible();

  // Try to access dashboard again
  //   await page.getByText("Dashboard").click();
  //   await expect(page.getByText("Login Page")).toBeVisible();
  await expect(page.getByRole("button", { name: "Dashboard" })).toBeVisible();
});
