import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { env } from '../utils/env';

setup('login as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.adminUser, env.adminPass);

  await page.context().storageState({ path: 'admin.json' });
});
