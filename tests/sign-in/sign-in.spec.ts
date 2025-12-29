import test, { expect } from "@playwright/test";

test.describe("Sign In feature", () => {
    test.beforeEach(async ({page}) => {
        await page.goto("/sign-in");
    });

    test('Render login page', async ({page}) => {
        await expect(page.getByRole("heading", {name: "Sign In"})).toBeVisible();
        await expect(page.getByLabel("Email")).toBeVisible();
        await expect(page.getByLabel("Password")).toBeVisible();
    })

    test('Auto focus on Email', async ({page}) => {
        await expect(page.getByLabel("Email")).toBeFocused();
    })

    test('Không submit khi email rỗng', async ({page}) => {
        await page.getByLabel("Password").fill("123456");
        await page.getByRole("button", {name:"Sign In"}).click();

        await expect(page).toHaveURL("/sign-in");
    })

    test('Không submit khi password rỗng', async ({page}) => {
        await page.getByLabel("Email").fill("email@gmail.com");
        await page.getByRole("button", {name:"Sign In"}).click();

        await expect(page).toHaveURL("/sign-in");
    })

    test('Email sai format', async ({page}) => {
        await page.getByLabel("Email").fill("email");
        await page.getByLabel("Password").fill("123456");
        await page.getByRole("button", {name:"Sign In"}).click();

        await expect(page).toHaveURL("/sign-in");
    })

    test('Sai email', async ({page}) => {
        await page.getByLabel("Email").fill("19115472778@nttu.edu.vn");
        await page.getByLabel("Password").fill("Ha@123456789");
        await page.getByRole("button", {name: "Sign In"}).click();

        await expect(page.locator("#snackbar-id")).toBeVisible();
        await expect(page.locator("#snackbar-id")).toContainText("User with email 19115472778@nttu.edu.vn not found.");
    })

    test('Sai password', async ({page}) => {
        await page.getByLabel("Email").fill("1911547277@nttu.edu.vn");
        await page.getByLabel("Password").fill("Ha@12345678");
        await page.getByRole("button", {name: "Sign In"}).click();

        await expect(page.locator("#snackbar-id")).toBeVisible();
        await expect(page.locator("#snackbar-id")).toContainText("Incorrect email or password, please try again");
    })

    test('Đúng email và password', async ({page}) => {
        await page.getByLabel("Email").fill("1911547277@nttu.edu.vn");
        await page.getByLabel("Password").fill("Ha@123456789");
        await page.getByRole("button", {name: "Sign In"}).click();

        await expect(page).toHaveURL('/admin');
    })
}) 