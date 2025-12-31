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
        await signInPage.fillEmail("email@gmail.com");
        await signInPage.fillPassword("123456");
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

        await signInAction("email@gmail.com", "Ha@1234");

        await expect(page).toHaveURL("/admin");
    })

    test("Login success with kitchen role", async ({page}) => {
        mockupApiSignIn(page, 200, {
          message: 'Sign in successful',
          data: { roles: ['KITCHEN'] }
        });

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

        await signInAction("email@gmail.com", "Ha@1234");
    

        await expect(page).toHaveURL("/casher/orders");
    })
}) 