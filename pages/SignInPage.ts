import { Page } from '@playwright/test';

export class SignInPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/sign-in', {
      waitUntil: 'domcontentloaded',
    });
  }

  async fillEmail(email: string) {
    await this.page.getByLabel('Email').fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByLabel('Password').fill(password);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }

  alert() {
    return this.page.getByTestId('snackbar-alert').locator('.MuiAlert-message');
  }
}