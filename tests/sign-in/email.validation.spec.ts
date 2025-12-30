import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SignInPage';

test.describe('Sign Page - Email validation', () => {
  let signIn: SignInPage;

  test.beforeEach(async ({ page }) => {
    signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.fillPassword('123456');
  });

  const invalidEmails = [
    { value: '', reason: 'empty' },
    { value: '   ', reason: 'blank' },
    { value: 'abc', reason: 'missing @' },
    { value: 'a@', reason: 'missing domain' },
    { value: 'a@@mail.com', reason: 'double @' },
    { value: 'a@😊.com', reason: 'unicode' },
    { value: 'a', reason: 'length = 1' },
    { value: 'a'.repeat(51) + '@mail.com', reason: 'length > 50' },
  ];

  for (const tc of invalidEmails) {
    test(`Invalid email – ${tc.reason}`, async ({page}) => {
      await signIn.fillEmail(tc.value);
      await signIn.submit();

      await expect(page).toHaveURL("/sign-in")
    });
  }
});