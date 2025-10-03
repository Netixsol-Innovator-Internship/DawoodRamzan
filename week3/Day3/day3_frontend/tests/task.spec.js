import { test, expect } from "@playwright/test";

// Helper to login first before each test
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByText("Login").click();

  await page.fill('input[name="username"]', "123");
  await page.fill('input[name="password"]', "123");
  await page.click('button[type="submit"]');

  await expect(page.getByRole("button", { name: "Add Task" })).toBeVisible();
});

test.describe("Task Management", () => {
  test("should add a new task", async ({ page }) => {
    await page.fill('input[name="title"]', "My First Task");
    await page.fill('textarea[name="description"]', "This is a test task");
    await page.selectOption("select[name='completed']", "false");

    await page.click("button:has-text('Add Task')");

    await expect(page.getByText("My First Task")).toBeVisible();
  });

  test("should toggle task status", async ({ page }) => {
    // Create a task
    await page.fill('input[name="title"]', "Toggle Task");
    await page.fill('textarea[name="description"]', "Check toggle");
    await page.click("button:has-text('Add Task')");

    const toggleBtn = page.locator("button:has-text('Pending')").first();
    await toggleBtn.click();

    await expect(
      page.locator("button:has-text('Completed')").first()
    ).toBeVisible();
  });

  test("should delete a task", async ({ page }) => {
    // Create a task
    await page.fill('input[name="title"]', "Task To Delete");
    await page.fill('textarea[name="description"]', "To be deleted");
    await page.click("button:has-text('Add Task')");

    // Find the card by heading text, then go to parent div
    const taskCard = page
      .locator("h3", { hasText: "Task To Delete" })
      .locator("..");

    // Click Delete
    await taskCard.getByRole("button", { name: "Delete" }).click();

    // Assert it’s gone
    await expect(page.getByText("Task To Delete")).toHaveCount(0);
  });

  test("should edit an existing task", async ({ page }) => {
    // Create a task first
    await page.fill('input[name="title"]', "Task To Edit");
    await page.fill('textarea[name="description"]', "Old description");
    await page.click("button:has-text('Add Task')");

    // Find the card by heading text, then go to parent div
    const taskCard = page.locator("h3:has-text('Task To Edit')").locator("..");

    // Click Edit
    await taskCard.getByRole("button", { name: "Edit" }).click();
  });
});
