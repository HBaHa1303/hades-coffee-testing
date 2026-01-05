import test, { expect } from "@playwright/test";
import { SignInPage } from "../../pages/SignInPage";
import { mockApi } from "../../utils/mockup.api";
import { Page } from "@playwright/test";

const mockupApiSignIn = async (page: Page, status: number, json: any) => {
  await mockApi(page, "**/api/v1/auth/sign-in", status, json);
};

test.describe("Sign Page - Flow", () => {
    let signInPage: SignInPage;

    const signInAction = async (email: string, password: string) => {
        await signInPage.fillEmail(email);
        await signInPage.fillPassword(password);
        await signInPage.submit();
    }
    test.beforeEach(async ({page}) => {
        signInPage = new SignInPage(page);
        await signInPage.goto();    
    });

    test("Login fail - wrong password", async ({page}) => {
        await mockupApiSignIn(page, 401, { message: 'Incorrect email or password, please try again' });
        await signInAction("email@gmail.com", "Ha@1234");

        await expect(signInPage.alert()).toHaveText("Incorrect email or password, please try again");
    });

    test("Login fail - wrong email", async ({page}) => {
        mockupApiSignIn(page, 404, { message: 'User with email email@gmail.com not found.' });

        await signInAction("email@gmail.com", "Ha@1234");

        await expect(signInPage.alert()).toHaveText("User with email email@gmail.com not found.");
    })

    test("Login success with admin role", async ({page}) => {
        mockupApiSignIn(page, 200, {
          message: 'Sign in successful',
          data: { roles: ['ADMIN'] }
        });

        await page.route('**/private/api/v1/stats/revenue', route =>
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: {day: 0, week: 0, month: 0} })
          })
        );

        await signInAction("email@gmail.com", "Ha@1234");

        await expect(page).toHaveURL("/admin");
    })

    test("Login success with kitchen role", async ({page}) => {
        mockupApiSignIn(page, 200, {
          message: 'Sign in successful',
          data: { roles: ['KITCHEN'] }
        });

        await page.route('**/private/api/v1/orders**', route =>
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [] })
          })
        );

        await signInAction("email@gmail.com", "Ha@1234");

        await expect(page).toHaveURL("/kitchen/orders");
    })

    test("Login success with user role", async ({page}) => {
        mockupApiSignIn(page, 200, {
          message: 'Sign in successful',
          data: { roles: ['USER'] }
        });

        await signInAction("email@gmail.com", "Ha@1234");
    
        await expect(page).toHaveURL("/menu");
    })

    test("Login success with casher role", async ({page}) => {
        mockupApiSignIn(page, 200, {
          message: 'Sign in successful',
          data: { roles: ['CASHER'] }
        });

        await page.route('**/private/api/v1/orders**', route =>
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [] })
          })
        );
        
        await signInAction("email@gmail.com", "Ha@1234");
    
        await expect(page).toHaveURL("/casher/orders");
    })
}) 