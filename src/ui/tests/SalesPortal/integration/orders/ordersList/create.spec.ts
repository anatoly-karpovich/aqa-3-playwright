import { CustomersMockBuilder, ProductsMockBuilder } from "data/builders";
import { OrderBuilder } from "data/builders/orderBuilder";
import { EMPTY_TABLE_ROW_TEXT, NOTIFICATIONS } from "data/notifications.data";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { test, expect } from "fixtures";
import { IOrdersResponse } from "types/order.types";

test.describe("[UI] [Orders] [Create]", () => {
  test(
    "Should check successfull order creation flow",
    { tag: [TAGS.INTEGRATION, TAGS.REGRESSION, TAGS.ORDERS] },
    async ({ ordersPage, mock }) => {
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      const products = new ProductsMockBuilder().addDefaultProduct().build();
      const order = new OrderBuilder().build();
      const ordersMock: IOrdersResponse = {
        Orders: [],
        ErrorMessage: null,
        IsSuccess: true,
        limit: 10,
        page: 1,
        search: "",
        status: [],
        total: 0,
        sorting: {
          sortField: "createdOn",
          sortOrder: "desc",
        },
      };
      await mock.orders({ getResponse: ordersMock });
      await mock.createOrderModal({ customers, products });
      await ordersPage.open();
      await ordersPage.clickCreateButton();
      const { createOrderModal } = ordersPage;
      await createOrderModal.waitForOpened();
      await mock.orders({
        postResponse: { Order: order, ErrorMessage: null, IsSuccess: true },
        getResponse: { ...ordersMock, Orders: [order], total: 1 },
      });
      const createOrderResponse = await createOrderModal.submit();
      await ordersPage.waitForOpened();
      await ordersPage.waitForToast(NOTIFICATIONS.ORDER_CREATED);
      await expect(ordersPage.tableRowByOrderNumber(createOrderResponse.body.Order._id)).toBeVisible();
    }
  );

  test(
    "Should check order creation with 404 error",
    { tag: [TAGS.INTEGRATION, TAGS.REGRESSION, TAGS.ORDERS] },
    async ({ ordersPage, mock }) => {
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      const products = new ProductsMockBuilder().addDefaultProduct().build();
      const ordersMock: IOrdersResponse = {
        Orders: [],
        ErrorMessage: null,
        IsSuccess: true,
        limit: 10,
        page: 1,
        search: "",
        status: [],
        total: 0,
        sorting: {
          sortField: "createdOn",
          sortOrder: "desc",
        },
      };
      await mock.orders({ getResponse: ordersMock });
      await mock.createOrderModal({ customers, products });
      await ordersPage.open();
      await ordersPage.clickCreateButton();
      const { createOrderModal } = ordersPage;
      await createOrderModal.waitForOpened();
      await mock.orders({
        postResponse: {
          ErrorMessage: `Customer with id '${customers.Customers[0]._id}' wasn't found`,
          IsSuccess: false,
        },
        postStatus: 404,
        getResponse: ordersMock,
      });
      await createOrderModal.submit();
      await ordersPage.waitForOpened();
      await ordersPage.waitForToast(NOTIFICATIONS.ORDER_NOT_CREATED);
      await expect(ordersPage.tableRow).toHaveText(EMPTY_TABLE_ROW_TEXT);
    }
  );

  test(
    "Should check opening order creation modal with 500 error in customers response",
    { tag: [TAGS.INTEGRATION, TAGS.REGRESSION, TAGS.ORDERS] },
    async ({ ordersPage, mock }) => {
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      const products = new ProductsMockBuilder().addDefaultProduct().build();
      const ordersMock: IOrdersResponse = {
        Orders: [],
        ErrorMessage: null,
        IsSuccess: true,
        limit: 10,
        page: 1,
        search: "",
        status: [],
        total: 0,
        sorting: {
          sortField: "createdOn",
          sortOrder: "desc",
        },
      };
      await mock.orders({ getResponse: ordersMock });
      await mock.createOrderModal({ customers, products, customersStatusCode: STATUS_CODES.SERVER_ERROR });
      await ordersPage.open();
      await ordersPage.clickCreateButton();
      await ordersPage.createOrderModal.waitForClosed();
      await ordersPage.waitForToast(NOTIFICATIONS.ORDER_NOT_CREATED);
      await ordersPage.waitForOpened();
      await expect(ordersPage.tableRow).toHaveText(EMPTY_TABLE_ROW_TEXT);
    }
  );

  test(
    "Should check opening order creation modal with 500 error in products response",
    { tag: [TAGS.INTEGRATION, TAGS.REGRESSION, TAGS.ORDERS] },
    async ({ ordersPage, mock }) => {
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      const products = new ProductsMockBuilder().addDefaultProduct().build();
      const ordersMock: IOrdersResponse = {
        Orders: [],
        ErrorMessage: null,
        IsSuccess: true,
        limit: 10,
        page: 1,
        search: "",
        status: [],
        total: 0,
        sorting: {
          sortField: "createdOn",
          sortOrder: "desc",
        },
      };
      await mock.orders({ getResponse: ordersMock });
      await mock.createOrderModal({ customers, products, productsStatusCode: STATUS_CODES.SERVER_ERROR });
      await ordersPage.open();
      await ordersPage.clickCreateButton();
      await ordersPage.createOrderModal.waitForClosed();
      await ordersPage.waitForToast(NOTIFICATIONS.ORDER_NOT_CREATED);
      await ordersPage.waitForOpened();
      await expect(ordersPage.tableRow).toHaveText(EMPTY_TABLE_ROW_TEXT);
    }
  );
});
