import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SignInPage';

const ORDER_API = '**/public/api/v1/orders';

test.describe('Order & Cart', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('currentTableId', '1');
    });

    await page.route("**/public/api/v1/menu-items", route => route.fulfill({
      status: 200,
      json: {
        data: [{
          categoryName: 'Cafe',
          menuItems: [
            {
              id: 2,
              name: 'Cafe đen',
              description: 'Mô tả cafe đen',
              imageUrl: 'https://thuytinhocean.com/wp-content/uploads/2024/08/hinh-anh-ly-cafe-sua-da-1.jpg',
              status: 'AVAILABLE',
              price: 20000,
              categoryId: 1
            },
            {
              id: 3,
              name: 'Cafe sữa',
              description: 'Mô tả cafe sữa',
              imageUrl: 'https://thuytinhocean.com/wp-content/uploads/2024/08/hinh-anh-ly-cafe-sua-da-30-1024x683.jpg',
              status: 'AVAILABLE',
              price: 25000,
              categoryId: 1
            }
          ]
        }]
      }
    }))

    await page.goto('/menu');
    await page.getByTestId("add-item-2").click();
    await page.getByText('Thêm vào giỏ hàng').click();
    await page.getByText('Đặt hàng').click();
  });

  /* ---------------- CART ---------------- */

  test('render cart items', async ({ page }) => {
    await expect(page.getByText('Cafe đen')).toBeVisible();
  });

  test('increase quantity', async ({ page }) => {
    await page.getByRole('button', { name: '+' }).click();
    await expect(page.getByText('2', { exact: true })).toBeVisible();
  });

  test('quantity cannot be less than 1', async ({ page }) => {
    const minusBtn = page.getByRole('button', { name: '-', exact: true });

    await expect(minusBtn).toBeDisabled();
    await expect(page.getByText('1', { exact: true })).toBeVisible();
  });


  test('remove item from cart', async ({ page }) => {
    await page.getByTestId('delete-cart-item').click();
    await expect(page.getByText('Giỏ hàng đang trống')).toBeVisible();
  });

  test('total price updates when quantity changes', async ({ page }) => {
    const totalBefore = await page.getByTestId('cart-total').textContent();
    await page.getByRole('button', { name: '+' }).click();
    const totalAfter = await page.getByTestId('cart-total').textContent();

    expect(totalBefore).not.toEqual(totalAfter);
  });

  test('cart persists after reload', async ({ page }) => {
    await page.reload();
    await expect(page.getByText('Cafe đen', { exact: true })).toBeVisible();
  });

  /* ---------------- ORDER ---------------- */

  test('cannot order when cart is empty', async ({ page }) => {
    await page.getByTestId('delete-cart-item').click();
    await expect(page.getByText("Giỏ hàng đang trống")).toBeVisible();
  });


  test('successful order when user is login', async ({ page }) => {
    await page.route("**/public/api/v1/orders**", route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ message: 'Tạo đơn hàng thành công' })
      })
    );

    await page.route("**/public/api/v1/auth/sign-in**", route => {
      route.fulfill({ status: 200, json: { data: { roles: ["USER"] } } });
    })

    await page.getByTestId('signIn-tab').click();
    const signInPage = new SignInPage(page);
    await signInPage.fillEmail("hehe@gmail.com");
    await signInPage.fillPassword("Ha@12345");
    await signInPage.submit();

    await page.getByTestId('order-tab').click();
    await page.getByTestId('order-submit-btn').click();

    await expect(page.getByText("Tạo đơn hàng thành công")).toBeVisible();
    await expect(page.getByText('Giỏ hàng đang trống')).toBeVisible();
  });

  test('successful order when user is not login', async ({ page }) => {
    await page.route("**/public/api/v1/orders**", route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ message: 'Tạo đơn hàng thành công' })
      })
    );

    await page.getByTestId('order-submit-btn').click();

    await expect(page.getByText("Tạo đơn hàng thành công")).toBeVisible();
    await expect(page.getByText('Giỏ hàng đang trống')).toBeVisible();
  });

  test('order api error shows error snackbar', async ({ page }) => {
    await page.route("**/public/api/v1/orders**", route =>
      route.fulfill({ status: 500, json: { message: "Hệ thống gặp lỗi. Vui lòng thử lại sau." } })
    );

    await page.getByTestId('order-tab').click({ delay: 50 });
    await page.getByTestId('order-submit-btn').click({ delay: 50 });

    await expect(page.getByText("Hệ thống gặp lỗi. Vui lòng thử lại sau.")).toBeVisible();
  });

  test('order history tab only visible when logged in', async ({ page }) => {
    await page.route("**/public/api/v1/auth/sign-in**", route => {
      route.fulfill({
        status: 200, json: {
          "message": "Đăng nhập thành công",
          "data": {
            "email": "user@gmail.com",
            "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNCIsImV4cCI6MTc2NzU4MzIyNH0.tQDCHJiSLc5IRWk_V7NTpr9VQieT1L_zUZqdvBpPB_s",
            "refreshToken": "",
            "firstName": "Hoang Ba",
            "lastName": "Ha",
            "dateOfBirth": "2025-12-26",
            "roles": [
              "USER"
            ]
          }
        }
      });
    })

    await page.getByTestId('signIn-tab').click();
    const signInPage = new SignInPage(page);
    await signInPage.fillEmail("hehe@gmail.com");
    await signInPage.fillPassword("Ha@12345");
    await signInPage.submit();

    await page.getByTestId('order-tab').click();

    await expect(page.getByText('Đơn hàng')).toBeVisible();
  });
});
