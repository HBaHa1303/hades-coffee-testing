import { test, expect } from '@playwright/test';

test.describe('Menu Page – UI + Mock API', () => {

  test.beforeEach(async ({ page }) => {
    await page.route('**/public/api/v1/menu-items', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Lấy danh sách món thành công.',
          data: [
            {
              categoryName: 'Cafe',
              menuItems: [
                {
                  id: 2,
                  name: 'Cafe đen',
                  description: 'Mô tả cafe đen',
                  imageUrl: 'https://thuytinhocean.com/wp-content/uploads/2024/08/hinh-anh-ly-cafe-sua-da-1.jpg',
                  status: 'AVAILABLE',
                  price: 50000,
                  categoryId: 1
                },
                {
                  id: 3,
                  name: 'Cafe sữa 1',
                  description: 'Mô tả',
                  imageUrl: 'https://thuytinhocean.com/wp-content/uploads/2024/08/hinh-anh-ly-cafe-sua-da-30-1024x683.jpg',
                  status: 'AVAILABLE',
                  price: 25000,
                  categoryId: 1
                },
                {
                  id: 6,
                  name: 'Cafe sữa 6',
                  description: 'Mô tả',
                  imageUrl: 'https://thuytinhocean.com/wp-content/uploads/2024/08/hinh-anh-ly-cafe-sua-da-30-1024x683.jpg',
                  status: 'AVAILABLE',
                  price: 10000,
                  categoryId: 1
                },
                {
                  id: 5,
                  name: 'Cafe sữa 5',
                  description: 'Mô tả',
                  imageUrl: 'https://thuytinhocean.com/wp-content/uploads/2024/08/hinh-anh-ly-cafe-sua-da-30-1024x683.jpg',
                  status: 'OUT_OF_STOCK',
                  price: 25000,
                  categoryId: 1
                },
                {
                  id: 1,
                  name: 'Cafe sữa',
                  description: 'Mô tả sữa cafe',
                  imageUrl: 'https://thuytinhocean.com/wp-content/uploads/2024/08/hinh-anh-ly-cafe-sua-da-30-1024x683.jpg',
                  status: 'AVAILABLE',
                  price: 15000,
                  categoryId: 1
                }
              ]
            },
            {
              categoryName: 'Trà',
              menuItems: [
                {
                  id: 4,
                  name: 'Cafe sữa 2',
                  description: 'Mô tả',
                  imageUrl: 'https://thuytinhocean.com/wp-content/uploads/2024/08/hinh-anh-ly-cafe-sua-da-30-1024x683.jpg',
                  status: 'AVAILABLE',
                  price: 30000,
                  categoryId: 2
                },
                {
                  id: 7,
                  name: 'Món số 7',
                  description: 'Mô tả về món số 7',
                  imageUrl: 'string',
                  status: 'OUT_OF_STOCK',
                  price: 100000,
                  categoryId: 2
                }
              ]
            },
            {
              categoryName: 'Trà sữa',
              menuItems: [
                {
                  id: 9,
                  name: 'Trà sữa thái xanh 1',
                  description: 'Mô tả trà sữa thái xanh',
                  imageUrl: 'https://lypham.vn/wp-content/uploads/2024/09/luu-y-khi-nau-tra-sua-thai-xanh.jpg',
                  status: 'AVAILABLE',
                  price: 25000,
                  categoryId: 4
                }
              ]
            }
          ]
        })
      });
    });

    await page.goto('/menu');
  });

  test('show loading state', async ({ page }) => {
    await expect(page.getByRole('progressbar')).toBeVisible();
  });

  test('render category buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Cafe', exact: true})).toBeVisible();
    await expect(page.getByRole('button', { name: 'Trà', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Trà sữa', exact: true })).toBeVisible();
  });

  test('render menu items', async ({ page }) => {
    await expect(page.getByText('Cafe đen', {exact: true})).toBeVisible();
    await expect(page.getByText('Cafe sữa', {exact: true})).toBeVisible();
    await expect(page.getByText('Món số 7', {exact: true})).toBeVisible();
    await expect(page.getByText('Trà sữa thái xanh 1', {exact: true})).toBeVisible();
  });

  test('click category scrolls to correct section', async ({ page }) => {
    await page.getByRole('button', { name: 'Trà sữa', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Trà sữa', exact: true })
    ).toBeInViewport();
  });

  test('click menu item opens dialog', async ({ page }) => {
    await page.getByTestId("add-item-2").click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole("heading", {name: "Cafe đen", exact: true})).toBeVisible();
  });
});
