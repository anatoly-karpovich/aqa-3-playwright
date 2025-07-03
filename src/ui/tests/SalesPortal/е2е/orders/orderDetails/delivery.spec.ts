import { TAGS } from "data/tags";
import { expect, test } from "fixtures";
import { DELIVERY_CONDITIONS, ORDER_STATUSES } from "types/order.types";

test.describe("[UI] [Orders] [Order Details] [Delivery]", () => {
  test(
    "Should schedule delivery with 'Delivery' condition",
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ scheduleDeliveryPage, orderDetailsPage, dataManager, ordersController }) => {
      const order = await dataManager.createOrder(ORDER_STATUSES.DRAFT);
      await scheduleDeliveryPage.open(order._id);
      await scheduleDeliveryPage.fill({ condition: DELIVERY_CONDITIONS.DELIVERY });
      await scheduleDeliveryPage.clickSave();
      await orderDetailsPage.waitForOpened();
      await expect(orderDetailsPage.processOrderButton).toBeVisible();
      const orderFromApi = await ordersController.getByID(order._id, await dataManager.getToken());
      expect(orderFromApi.body.Order.delivery).toBeTruthy();
    }
  );

  test(
    "Should schedule delivery with 'Pick up' condition",
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ scheduleDeliveryPage, orderDetailsPage, dataManager, ordersController }) => {
      const order = await dataManager.createOrder(ORDER_STATUSES.DRAFT);
      await scheduleDeliveryPage.open(order._id);
      await scheduleDeliveryPage.fill({ condition: DELIVERY_CONDITIONS.PICK_UP });
      await scheduleDeliveryPage.clickSave();
      await orderDetailsPage.waitForOpened();
      await expect(orderDetailsPage.processOrderButton).toBeVisible();
      const orderFromApi = await ordersController.getByID(order._id, await dataManager.getToken());
      expect(orderFromApi.body.Order.delivery).toBeTruthy();
    }
  );
});
