import { test } from "fixtures";

test.describe("[UI] [Sales Portal] [Header Menu Navigation]", async () => {
  test("Should open products page from header menu", async ({ homeUIService, productsPage }) => {
    await homeUIService.openAsLoggedInUser();
    await productsPage.clickNavigationMenuItem("products");
    await productsPage.waitForOpened();
  });

  test("Should refresh products page clicking header menu", async ({ productsUIService, productsPage }) => {
    await productsUIService.openListPageViaUrl();
    await productsPage.interceptResponse(
      "/products",
      productsPage.clickNavigationMenuItem.bind(productsPage),
      "products"
    );
    await productsPage.waitForOpened();
  });

  test("Should open customers page from header menu", async ({ homeUIService, customersPage }) => {
    await homeUIService.openAsLoggedInUser();
    await customersPage.clickNavigationMenuItem("customers");
    await customersPage.waitForOpened();
  });

  test("Should refresh customers page clicking header menu", async ({ customersUIService, customersPage }) => {
    await customersUIService.openListPageViaUrl();
    await customersPage.interceptResponse(
      "/customers",
      customersPage.clickNavigationMenuItem.bind(customersPage),
      "customers"
    );
    await customersPage.waitForOpened();
  });

  test("Should open orders page from header menu", async ({ homeUIService, ordersPage }) => {
    await homeUIService.openAsLoggedInUser();
    await ordersPage.clickNavigationMenuItem("orders");
    await ordersPage.waitForOpened();
  });

  test("Should refresh orders page clicking header menu", async ({ customersUIService, ordersPage }) => {
    await customersUIService.openListPageViaUrl();
    await ordersPage.interceptResponse("/orders", ordersPage.clickNavigationMenuItem.bind(ordersPage), "orders");
    await ordersPage.waitForOpened();
  });
});
