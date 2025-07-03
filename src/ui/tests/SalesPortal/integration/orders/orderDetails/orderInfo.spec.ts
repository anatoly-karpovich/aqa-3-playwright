import { CustomersMockBuilder, OrderBuilder } from "data/builders";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";
import { ORDER_STATUSES } from "types/order.types";
import { convertToDate, convertToFullDateAndTime } from "utils/date.utils";

test.describe("[UI] [Orders] [Order Details] [Order Info]", () => {
  // test.skip("Should see correct order builder", async ({ homeUIService, mock, page }) => {
  //   await homeUIService.openAsLoggedInUser();
  //   const order = new OrderBuilder()
  //     .assignManager({})
  //     .unassignManager({})
  //     .addDelivery({})
  //     .assignManager({})
  //     .withStatus(ORDER_STATUSES.CANCELED)
  //     .build();
  //   const customers = new CustomersMockBuilder().addDefaultCustomer().build();
  //   await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
  //   await page.evaluate(async (id) => {
  //     //@ts-ignore
  //     await window.renderOrderDetailsPage(id);
  //   }, order._id);
  //   await page.locator("#history-tab").click();
  //   await expect(page.locator("#history-body")).toBeVisible();
  //   const buttons = await page.locator("#history-body button").all();
  //   for (const button of buttons) {
  //     await button.click();
  //     const id = await button.getAttribute("aria-controls");
  //     await expect(page.locator(`#${id} .his-col`).first()).toBeVisible();
  //   }
  // });

  test(
    "Should see correct order info for draft order with delivery",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().assignManager({}).addDelivery({}).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      const actualValues = await orderDetailsPage.getOrderValues();
      const expectedValues = {
        orderNumber: order._id,
        assignedManagerName: `${order.assignedManager?.firstName} ${order.assignedManager?.lastName}`,
        status: order.status,
        totalPrice: `$${order.total_price}`,
        deliveryDate: convertToDate(order.delivery?.finalDate!),
        createdOn: convertToFullDateAndTime(order.createdOn),
      };
      expect.soft(actualValues).toMatchObject(expectedValues);
      await expect.soft(orderDetailsPage.refreshOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.processOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.reopenOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.cancerOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.editAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.removeAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.noAssignedManagerText).not.toBeVisible();
    }
  );

  test(
    "Should see correct order info for draft order without delivery",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().assignManager({}).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      const actualValues = await orderDetailsPage.getOrderValues();
      const expectedValues = {
        orderNumber: order._id,
        assignedManagerName: `${order.assignedManager?.firstName} ${order.assignedManager?.lastName}`,
        status: order.status,
        totalPrice: `$${order.total_price}`,
        deliveryDate: "-",
        createdOn: convertToFullDateAndTime(order.createdOn),
      };
      expect.soft(actualValues).toMatchObject(expectedValues);
      await expect.soft(orderDetailsPage.refreshOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.processOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.reopenOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.cancerOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.editAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.removeAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.noAssignedManagerText).not.toBeVisible();
    }
  );

  test(
    "Should see correct order info for canceled order",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().assignManager({}).addDelivery({}).withStatus(ORDER_STATUSES.CANCELED).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      const actualValues = await orderDetailsPage.getOrderValues();
      const expectedValues = {
        orderNumber: order._id,
        assignedManagerName: `${order.assignedManager?.firstName} ${order.assignedManager?.lastName}`,
        status: order.status,
        totalPrice: `$${order.total_price}`,
        deliveryDate: convertToDate(order.delivery?.finalDate!),
        createdOn: convertToFullDateAndTime(order.createdOn),
      };
      expect.soft(actualValues).toMatchObject(expectedValues);
      await expect.soft(orderDetailsPage.refreshOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.processOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.reopenOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.cancerOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.editAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.removeAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.noAssignedManagerText).not.toBeVisible();
    }
  );

  test(
    "Should see correct order info for in process order",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().assignManager({}).addDelivery({}).withStatus(ORDER_STATUSES.IN_PROCESS).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      const actualValues = await orderDetailsPage.getOrderValues();
      const expectedValues = {
        orderNumber: order._id,
        assignedManagerName: `${order.assignedManager?.firstName} ${order.assignedManager?.lastName}`,
        status: order.status,
        totalPrice: `$${order.total_price}`,
        deliveryDate: convertToDate(order.delivery?.finalDate!),
        createdOn: convertToFullDateAndTime(order.createdOn),
      };
      expect.soft(actualValues).toMatchObject(expectedValues);
      await expect.soft(orderDetailsPage.refreshOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.processOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.reopenOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.cancerOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.editAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.removeAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.noAssignedManagerText).not.toBeVisible();
    }
  );

  test(
    "Should see correct order info for partially received order",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder({ numberOfProducts: 2 })
        .assignManager({})
        .addDelivery({})
        .withStatus(ORDER_STATUSES.PARTIALLY_RECEIVED)
        .build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      const actualValues = await orderDetailsPage.getOrderValues();
      const expectedValues = {
        orderNumber: order._id,
        assignedManagerName: `${order.assignedManager?.firstName} ${order.assignedManager?.lastName}`,
        status: order.status,
        totalPrice: `$${order.total_price}`,
        deliveryDate: convertToDate(order.delivery?.finalDate!),
        createdOn: convertToFullDateAndTime(order.createdOn),
      };
      expect.soft(actualValues).toMatchObject(expectedValues);
      await expect.soft(orderDetailsPage.refreshOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.processOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.reopenOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.cancerOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.editAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.removeAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.noAssignedManagerText).not.toBeVisible();
    }
  );

  test(
    "Should see correct order info for received order",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().assignManager({}).addDelivery({}).withStatus(ORDER_STATUSES.RECEIVED).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      const actualValues = await orderDetailsPage.getOrderValues();
      const expectedValues = {
        orderNumber: order._id,
        assignedManagerName: `${order.assignedManager?.firstName} ${order.assignedManager?.lastName}`,
        status: order.status,
        totalPrice: `$${order.total_price}`,
        deliveryDate: convertToDate(order.delivery?.finalDate!),
        createdOn: convertToFullDateAndTime(order.createdOn),
      };
      expect.soft(actualValues).toMatchObject(expectedValues);
      await expect.soft(orderDetailsPage.refreshOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.processOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.reopenOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.cancerOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.editAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.removeAssignedManagerButton).toBeVisible();
      await expect.soft(orderDetailsPage.noAssignedManagerText).not.toBeVisible();
    }
  );

  test(
    "Should see select manager link for order without assignedManager",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().addDelivery({}).withStatus(ORDER_STATUSES.RECEIVED).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await expect.soft(orderDetailsPage.noAssignedManagerText).toHaveText("Click to select manager");
      await expect.soft(orderDetailsPage.refreshOrderButton).toBeVisible();
      await expect.soft(orderDetailsPage.processOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.reopenOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.cancerOrderButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.assignedManagerName).not.toBeVisible();
      await expect.soft(orderDetailsPage.editAssignedManagerButton).not.toBeVisible();
      await expect.soft(orderDetailsPage.removeAssignedManagerButton).not.toBeVisible();
    }
  );
});
