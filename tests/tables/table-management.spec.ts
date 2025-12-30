// import test, { expect } from "@playwright/test";

// test.describe("Table Management feature", () => {
//     test.beforeEach(async ({ page, request }) => {
//         const res = await request.post("http://localhost:8123/api/v1/sign-in", {
//             data: {
//                 email: "1911547277@nttu.edu.vn",
//                 password: "Ha@123456789"
//             }
//         });

//         const body = await res.json();

//         console.log(body);

//         await page.goto("/admin/tables");
//     });


//     test("Render Table Management", async ({page}) => {
//         await expect(page.getByRole("heading", {name: "Quản lý bàn"})).toBeVisible();
//         await expect(page.getByRole("button", {name: "Thêm mới"})).toBeVisible();
//         // await expect(page.getByRole("table")).toBeVisible();
//     })

//     test("Show popup create table", async ({ page }) => {
//     await page.getByRole("button", { name: "Thêm mới" }).click();

//     const dialog = page.getByRole("dialog");
//     await expect(dialog).toBeVisible();

//     await expect(
//         dialog.getByRole("heading", { name: "Tạo mới bàn" })
//     ).toBeVisible();
//     });


//     test("Show popup and click cancle", async ({page}) => {
//         await page.getByRole("button", {name: "Thêm mới"}).click();
//         await page.getByRole("button", {name: "Huỷ"}).click();

//         await expect(page.getByRole("heading", {name: "Tạo mới bàn"})).toBeHidden();
//     });

//     test("Dont submit when table name is empty", async ({page}) => {
//         await page.getByRole("button", {name: "Thêm mới"}).click();
//         // await page.getByLabel("Tên bàn").fill("Bàn 5");
//         await page.getByRole("button", {name: "Tạo mới"}).click();

//         await expect(page).toHaveURL("/admin/tables")
//     });

//     test("Dont submit when table name is blank", async ({page}) => {
//         await page.getByRole("button", {name: "Thêm mới"}).click();
//         await page.getByLabel("Tên bàn").fill(" ");
//         await page.getByRole("button", {name: "Tạo mới"}).click();

//         await expect(page).toHaveURL("/admin/tables")
//     });

//     test("Create table success", async ({page}) => {
//         await page.getByRole("button", {name: "Thêm mới"}).click();
//         await page.getByLabel("Tên bàn").fill("Bàn 5");
//         await page.getByRole("button", {name: "Tạo mới"}).click();

//         await expect(page.getByRole("heading", {name: "Tạo mới bàn"})).toBeHidden();
//         await expect(page.locator("#snackbar-id")).toContainText("Table created successfully");
//     });

//     test("Create table with table length is 50", async ({page}) => {
//         await page.getByRole("button", {name: "Thêm mới"}).click();
//         await page.getByLabel("Tên bàn").fill("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
//         await page.getByRole("button", {name: "Tạo mới"}).click();

//         await expect(page.getByRole("heading", {name: "Tạo mới bàn"})).toBeHidden();
//         await expect(page.locator("#snackbar-id")).toContainText("Table created successfully");
//     });

//     test("Create table with table length is 51", async ({page}) => {
//         await page.getByRole("button", {name: "Thêm mới"}).click();
//         await page.getByLabel("Tên bàn").fill("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh1");
//         await page.getByRole("button", {name: "Tạo mới"}).click();

//         await expect(page.getByRole("heading", {name: "Tạo mới bàn"})).toBeHidden();
//         await expect(page.locator("#snackbar-id")).toContainText("Table name length must be lower 50");
//     });
// })