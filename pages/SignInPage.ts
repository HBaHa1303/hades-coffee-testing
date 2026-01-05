import { Page } from '@playwright/test';

export class SignInPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/sign-in');
  }

  async fillEmail(email: string) {
    await this.page.getByLabel('Email').type(email, {delay: 10});
  }

  async fillPassword(password: string) {
    await this.page.getByLabel('Password').type(password, {delay: 10});
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Sign In' }).click({delay: 50});
  }

  alert() {
    return this.page.locator('#alert-id');
  }
}