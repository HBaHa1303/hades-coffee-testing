import { Page } from "@playwright/test";

export async function mockApi(
  page: Page,
  path: string,
  status: number,
  json?: any
) {
  await page.route(path, route =>
    route.fulfill({ status, json })
  );
}
