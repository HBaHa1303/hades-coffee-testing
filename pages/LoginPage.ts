import { Page } from '@playwright/test';

export class SignInPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3000/sign-in');
  }

  async login(username: string, password: string) {
    await this.page.getByRole('textbox', {name: "Email"}).fill(username);
    await this.page.getByRole('textbox', {name: "Password"}).fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }
}