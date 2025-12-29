import { test, expect } from '@playwright/test';

const LOGIN_API = '**/sign-in';

test.describe('Sign In feature', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
  });

  test('TC01 – Render login page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('TC02 – Auto focus on Email', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeFocused();
  });

  test('TC03 – Không submit khi email rỗng', async ({ page }) => {
    await page.getByLabel('Password').fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/sign-in');
  });

  test('TC04 – Không submit khi password rỗng', async ({ page }) => {
    await page.getByLabel('Email').fill('test@mail.com');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/sign-in');
  });

  test('TC05 – Sai email format', async ({ page }) => {
    await page.getByLabel('Email').fill('abc');
    await page.getByLabel('Password').fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/sign-in');
  });

  test('TC06 – Sai email hoặc password', async ({ page }) => {
    await page.route(LOGIN_API, route =>
      route.fulfill({
        status: 401,
        json: { message: 'Incorrect email or password, please try again' }
      })
    );

    await page.getByLabel('Email').fill('wrong@mail.com');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: 'Sign In' }).click();

    const snackbar = page.locator('#snackbar-id');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toContainText(/incorrect email or password/i);
  });

  test('TC07 – Email không tồn tại', async ({ page }) => {
    await page.route(LOGIN_API, route =>
      route.fulfill({
        status: 404,
        json: { message: 'User with email 19115472778@nttu.edu.vn not found.' }
      })
    );

    await page.getByLabel('Email').fill('19115472778@nttu.edu.vn');
    await page.getByLabel('Password').fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();

    const snackbar = page.locator('#snackbar-id');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toContainText(/not found/i);
  });

  test('TC08 – Backend error 500', async ({ page }) => {
    await page.route(LOGIN_API, route =>
      route.fulfill({ status: 500 })
    );

    await page.getByLabel('Email').fill('test@mail.com');
    await page.getByLabel('Password').fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();

    const snackbar = page.locator('#snackbar-id');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toContainText(/có lỗi xảy ra/i);
  });

  test('TC09 – Login success USER → /menu', async ({ page }) => {
    await page.route(LOGIN_API, route =>
      route.fulfill({
        status: 200,
        json: {
          message: 'Sign in successful',
          data: {
            accessToken: 'token',
            roles: ['USER']
          }
        }
      })
    );

    await page.getByLabel('Email').fill('user@mail.com');
    await page.getByLabel('Password').fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/menu');
  });

  test('TC10 – Login success ADMIN → /admin', async ({ page }) => {
    await page.route(LOGIN_API, route =>
      route.fulfill({
        status: 200,
        json: {
          message: 'Sign in successful',
          data: {
            roles: ['ADMIN', 'USER']
          }
        }
      })
    );

    await page.getByLabel('Email').fill('admin@mail.com');
    await page.getByLabel('Password').fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/admin');
  });

  test('TC11 – Snackbar auto hide', async ({ page }) => {
    await page.route(LOGIN_API, route =>
      route.fulfill({
        status: 200,
        json: {
          message: 'Sign in successful',
          data: { roles: ['USER'] }
        }
      })
    );

    await page.getByLabel('Email').fill('user@mail.com');
    await page.getByLabel('Password').fill('123456');
    await page.getByRole('button', { name: 'Sign In' }).click();

    const snackbar = page.locator('#snackbar-id');
    await expect(snackbar).toBeVisible();
    await expect(snackbar).toBeHidden({ timeout: 5000 });
  });

});
