import { Page } from '@playwright/test';

export class AdminUserPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/users');
  }

  async openCreateUser() {
    await this.page.click('button#create-user');
  }

  async createUser(name: string) {
    await this.page.fill('#name', name);
    await this.page.click('button#save');
  }
}
