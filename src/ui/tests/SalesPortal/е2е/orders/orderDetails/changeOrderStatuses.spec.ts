import { NOTIFICATIONS } from "data/notifications.data";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";
import { ORDER_STATUSES } from "types/order.types";

test.describe("[UI] [Orders] [Order Details] [Change Order Status]", async () => {
  test(
    "Should open order details page for created order from orders page",
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ homeUIService, ordersPage, orderDetailsPage, dataManager }) => {
      const order = await dataManager.createOrder(ORDER_STATUSES.IN_PROCESS);
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule("Orders");
      await ordersPage.clickOrderDetails(order._id);
      await orderDetailsPage.waitForOpened();
      await expect(orderDetailsPage.orderNumber).toHaveText(order._id);
    }
  );

  test(
    `Should process "draft" order`,
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ orderDetailsUIService, dataManager }) => {
      const order = await dataManager.createOrder("Draft with delivery");
      await orderDetailsUIService.open(order);
      await orderDetailsUIService.process();
      await orderDetailsUIService.checkNotification(NOTIFICATIONS.ORDER_PROCESSED);
      await orderDetailsUIService.checkOrderStatus(ORDER_STATUSES.IN_PROCESS);
    }
  );

  test(
    `Should cancel "draft" order`,
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ orderDetailsUIService, dataManager }) => {
      const order = await dataManager.createOrder(ORDER_STATUSES.DRAFT);
      await orderDetailsUIService.open(order);
      await orderDetailsUIService.cancel();
      await orderDetailsUIService.checkNotification(NOTIFICATIONS.ORDER_CANCELED);
      await orderDetailsUIService.checkOrderStatus(ORDER_STATUSES.CANCELED);
    }
  );

  test(
    `Should cancel "in process" order`,
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ orderDetailsUIService, dataManager }) => {
      const order = await dataManager.createOrder(ORDER_STATUSES.IN_PROCESS);
      await orderDetailsUIService.open(order);
      await orderDetailsUIService.cancel();
      await orderDetailsUIService.checkNotification(NOTIFICATIONS.ORDER_CANCELED);
      await orderDetailsUIService.checkOrderStatus(ORDER_STATUSES.CANCELED);
    }
  );

  test(
    `Should reopen "canceled" order`,
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ orderDetailsUIService, dataManager }) => {
      const order = await dataManager.createOrder(ORDER_STATUSES.CANCELED);
      await orderDetailsUIService.open(order);
      await orderDetailsUIService.reopen();
      await orderDetailsUIService.checkNotification(NOTIFICATIONS.ORDER_REOPENED);
      await orderDetailsUIService.checkOrderStatus(ORDER_STATUSES.DRAFT);
    }
  );
});
