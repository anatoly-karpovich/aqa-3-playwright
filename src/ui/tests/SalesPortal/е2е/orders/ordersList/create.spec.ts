import { NOTIFICATIONS } from "data/notifications.data";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [Create]", () => {
  test(
    "Should create an order",
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION, TAGS.E2E] },
    async ({ ordersPage, dataManager }) => {
      const customer = await dataManager.createCustomer();
      const product = await dataManager.createProduct();

      await ordersPage.open();
      await ordersPage.clickCreateButton();
      await ordersPage.createOrderModal.selectCustomer(customer.name);
      await ordersPage.createOrderModal.selectProducts(product.name, product.name, product.name);
      const response = await ordersPage.createOrderModal.submit();
      expect(response.status, "Verify order status in response").toBe(STATUS_CODES.CREATED);
      dataManager.setOrder(response.body.Order);
      await ordersPage.waitForOpened();
      await expect(
        ordersPage.tableRowByOrderNumber(response.body.Order._id),
        "Verify created order in table"
      ).toBeVisible();
    }
  );
});
