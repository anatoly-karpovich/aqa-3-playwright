import { OrderBuilder, CustomersMockBuilder } from "data/builders";
import { generateProductFromResponse } from "data/products/generateProduct.data";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";
import { IOrderHistoryEntry, ORDER_HISTORY_ACTIONS, ORDER_STATUSES } from "types/order.types";
import { convertToDate, convertToDateAndTime } from "utils/date.utils";

test.describe("[UI] [Orders] [Order Details] [History Tab]", async () => {
  test(
    "Should see correct order created history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();

      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      const expectedDescription = getRowDescriptionFromHistoryObject(order.history[0], ORDER_HISTORY_ACTIONS.CREATED);
      const expectedData = {
        previous: { Status: "-" },
        updated: { Status: ORDER_STATUSES.DRAFT },
      };

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );

  test(
    "Should see correct order canceled history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder().withStatus(ORDER_STATUSES.CANCELED).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();

      const expectedDescription = getRowDescriptionFromHistoryObject(order.history[0], ORDER_HISTORY_ACTIONS.CANCELED);
      const expectedData = {
        previous: { Status: ORDER_STATUSES.DRAFT },
        updated: { Status: ORDER_STATUSES.CANCELED },
      };

      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );

  test(
    "Should see correct order reopened history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder().withStatus("Reopened").build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();

      const expectedDescription = getRowDescriptionFromHistoryObject(order.history[0], ORDER_HISTORY_ACTIONS.REOPENED);
      const expectedData = {
        previous: { Status: ORDER_STATUSES.CANCELED },
        updated: { Status: ORDER_STATUSES.DRAFT },
      };

      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );

  test(
    "Should see correct order in process history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder().addDelivery().withStatus(ORDER_STATUSES.IN_PROCESS).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();

      const expectedDescription = getRowDescriptionFromHistoryObject(order.history[0], ORDER_HISTORY_ACTIONS.PROCESSED);
      const expectedData = {
        previous: { Status: ORDER_STATUSES.DRAFT },
        updated: { Status: ORDER_STATUSES.IN_PROCESS },
      };

      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );

  test(
    "Should see correct order partially received history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder({ numberOfProducts: 2 })
        .addDelivery()
        .withStatus(ORDER_STATUSES.PARTIALLY_RECEIVED)
        .build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();
      const history = order.history[0];
      const expectedDescription = getRowDescriptionFromHistoryObject(order.history[0], ORDER_HISTORY_ACTIONS.RECEIVED);
      const expectedData = {
        previous: { [history.products[0].name]: "Not received", [history.products[1].name]: "Not received" },
        updated: { [history.products[0].name]: "Received", [history.products[1].name]: "Not received" },
      };
      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );

  test(
    "Should see correct order received history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder({ numberOfProducts: 2 }).withStatus(ORDER_STATUSES.RECEIVED).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();
      const history = order.history[0];
      const expectedDescription = getRowDescriptionFromHistoryObject(
        order.history[0],
        ORDER_HISTORY_ACTIONS.RECEIVED_ALL
      );
      const expectedData = {
        previous: { [history.products[0].name]: "Received", [history.products[1].name]: "Not received" },
        updated: { [history.products[0].name]: "Received", [history.products[1].name]: "Received" },
      };
      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );

  test(
    "Should see correct order delivery scheduled history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder().addDelivery().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();
      const delivery = order.history[0].delivery!;
      const expectedDescription = getRowDescriptionFromHistoryObject(
        order.history[0],
        ORDER_HISTORY_ACTIONS.DELIVERY_SCHEDULED
      );
      const expectedData = {
        previous: {
          "Delivery Type": "-",
          "Delivery Date": "-",
          Country: "-",
          City: "-",
          Street: "-",
          House: "-",
          Flat: "-",
        },
        updated: {
          "Delivery Type": delivery.condition,
          "Delivery Date": convertToDate(delivery.finalDate),
          Country: delivery.address.country,
          City: delivery.address.city,
          Street: delivery.address.street,
          House: delivery.address.house.toString(),
          Flat: delivery.address.flat.toString(),
        },
      };
      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );

  test(
    "Should see correct order delivery edited history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder().addDelivery().addDelivery().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();
      const delivery = order.history[0].delivery!;
      const previousDelivery = order.history[1].delivery!;
      const expectedDescription = getRowDescriptionFromHistoryObject(
        order.history[0],
        ORDER_HISTORY_ACTIONS.DELIVERY_EDITED
      );
      const expectedData = {
        previous: {
          "Delivery Type": previousDelivery.condition,
          "Delivery Date": convertToDate(previousDelivery.finalDate),
          Country: previousDelivery.address.country,
          City: previousDelivery.address.city,
          Street: previousDelivery.address.street,
          House: previousDelivery.address.house.toString(),
          Flat: previousDelivery.address.flat.toString(),
        },
        updated: {
          "Delivery Type": delivery.condition,
          "Delivery Date": convertToDate(delivery.finalDate),
          Country: delivery.address.country,
          City: delivery.address.city,
          Street: delivery.address.street,
          House: delivery.address.house.toString(),
          Flat: delivery.address.flat.toString(),
        },
      };
      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );

  test(
    "Should see correct order customer changed history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder().changeCustomer().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().addCustomCustomer(order.customer).build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();
      const expectedDescription = getRowDescriptionFromHistoryObject(
        order.history[0],
        ORDER_HISTORY_ACTIONS.CUSTOMER_CHANGED
      );
      const expectedData = {
        previous: { Customer: customers.Customers[0].name },
        updated: { Customer: customers.Customers[1].name },
      };
      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );

  test(
    "Should see correct order products changed history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder().addProduct({ product: generateProductFromResponse() }).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().addCustomCustomer(order.customer).build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();

      const history = order.history[0];
      const expectedDescription = getRowDescriptionFromHistoryObject(
        history,
        ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED
      );
      const expectedData = {
        previous: { ["Product 1"]: history.products[0].name, ["Product 2"]: "-" },
        updated: {
          ["Product 1"]: history.products[0].name,
          ["Product 2"]: history.products[1].name,
        },
      };
      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );

  test(
    "Should see correct order manager assigned history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder().assignManager({}).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().addCustomCustomer(order.customer).build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();

      const history = order.history[0];
      const expectedDescription = getRowDescriptionFromHistoryObject(history, ORDER_HISTORY_ACTIONS.MANAGER_ASSIGNED);
      const expectedData = {
        previous: { ["Assigned Manager"]: "Not assigned" },
        updated: { ["Assigned Manager"]: `${history.assignedManager?.firstName} ${history.assignedManager?.lastName}` },
      };
      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );

  test(
    "Should see correct order manager unassigned history action",
    { tag: [TAGS.REGRESSION, TAGS.INTEGRATION, TAGS.ORDERS] },
    async ({ mock, orderDetailsPage }) => {
      const order = new OrderBuilder().assignManager({}).unassignManager({}).build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().addCustomCustomer(order.customer).build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("history");
      await orderDetailsPage.historyTab.expandHistoryRow();

      const history = order.history[0];
      const previousHistory = order.history[1];
      const expectedDescription = getRowDescriptionFromHistoryObject(history, ORDER_HISTORY_ACTIONS.MANAGER_UNASSIGNED);
      const expectedData = {
        previous: {
          ["Assigned Manager"]: `${previousHistory.assignedManager?.firstName} ${previousHistory.assignedManager?.lastName}`,
        },
        updated: { ["Assigned Manager"]: "Not assigned" },
      };
      const { data: actualData, description: actualDescription } =
        await orderDetailsPage.historyTab.getHistoryRowData();

      expect.soft(actualDescription).toEqual(expectedDescription);
      expect.soft(actualData.previous).toEqual(expectedData.previous);
      expect.soft(actualData.updated).toEqual(expectedData.updated);
    }
  );
});

function getRowDescriptionFromHistoryObject(history: IOrderHistoryEntry, action: ORDER_HISTORY_ACTIONS) {
  const { performer, changedOn } = history;
  return {
    action,
    performer: `${performer.firstName} ${performer.lastName}`,
    date: convertToDateAndTime(changedOn),
  };
}
