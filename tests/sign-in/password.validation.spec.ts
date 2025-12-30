import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SignInPage';

test.describe('Sign Page - Password validation', () => {
  let signIn: SignInPage;

  test.beforeEach(async ({ page }) => {
    signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.fillEmail('test@mail.com');
  });

  const invalidPasswords = [
    { value: '', reason: 'empty' },
    { value: '   ', reason: 'blank' },
    { value: '123', reason: 'length < min' },
  ];

  for (const tc of invalidPasswords) {
    test(`Invalid password – ${tc.reason}`, async ({page}) => {
      await signIn.fillPassword(tc.value);
      await signIn.submit();

    //   await expect(signIn.snackbar()).toBeVisible();
        await expect(page).toHaveURL("/sign-in")
    });
  }
});