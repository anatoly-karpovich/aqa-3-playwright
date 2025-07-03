import { OrderBuilder, CustomersMockBuilder } from "data/builders";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";
import { ORDER_STATUSES } from "types/order.types";
import { convertToDate } from "utils/date.utils";

test.describe("[UI] [Orders] [Order Details] [Delivery Tab]", async () => {
  test(
    "Should see correct delivery data for order with delivery",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().addDelivery({}).withStatus(ORDER_STATUSES.IN_PROCESS).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("delivery");
      const actualValues = await orderDetailsPage.deliveryTab.getInfo();
      const expectedValues = {
        type: order.delivery?.condition,
        date: convertToDate(order.delivery?.finalDate!),
        country: order.delivery?.address.country,
        city: order.delivery?.address.city,
        street: order.delivery?.address.street,
        house: order.delivery?.address.house.toString(),
        flat: order.delivery?.address.flat.toString(),
      };
      expect.soft(actualValues).toMatchObject(expectedValues);
    }
  );

  test(
    "Should see correct delivery data for order without delivery",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("delivery");
      const actualValues = await orderDetailsPage.deliveryTab.getInfo();
      const expectedValues = {
        type: "-",
        date: "-",
        country: "-",
        city: "-",
        street: "-",
        house: "-",
        flat: "-",
      };
      expect.soft(actualValues).toMatchObject(expectedValues);
    }
  );

  test(
    "Should see schedule delivery button for order without delivery",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("delivery");
      expect.soft(orderDetailsPage.deliveryTab.scheduleButton).toHaveText("Schedule Delivery");
    }
  );

  test(
    "Should see edit delivery button for order with delivery",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().addDelivery({}).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("delivery");
      expect.soft(orderDetailsPage.deliveryTab.editButton).toHaveText("Edit Delivery");
    }
  );

  [
    ORDER_STATUSES.IN_PROCESS,
    ORDER_STATUSES.PARTIALLY_RECEIVED,
    ORDER_STATUSES.RECEIVED,
    ORDER_STATUSES.CANCELED,
  ].forEach((status) => {
    test(
      `Should not see delivery button for "${status}" order`,
      { tag: [TAGS.ORDERS, TAGS.VISUAL] },
      async ({ homeUIService, mock, orderDetailsPage }) => {
        await homeUIService.openAsLoggedInUser();
        const order = new OrderBuilder({ numberOfProducts: 2 }).withStatus(status).build();
        const customers = new CustomersMockBuilder().addDefaultCustomer().build();
        await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
        await orderDetailsPage.open(order._id);
        await orderDetailsPage.openTab("delivery");
        expect.soft(orderDetailsPage.deliveryTab.scheduleButton).not.toBeVisible();
        expect.soft(orderDetailsPage.deliveryTab.editButton).not.toBeVisible();
      }
    );
  });
});
