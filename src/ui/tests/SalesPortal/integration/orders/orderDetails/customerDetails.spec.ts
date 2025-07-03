import { CustomersMockBuilder, OrderBuilder } from "data/builders";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";
import _ from "lodash";
import { convertToDateAndTime } from "utils/date.utils";

test.describe("[UI] [Orders] [Order Details] [Customer Details]", () => {
  test(
    "Should see valid customer data with notes",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ orderDetailsPage, mock }) => {
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      const order = new OrderBuilder().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      const actualData = await orderDetailsPage.customerDetails.getInfo();
      const expectedData = {
        ..._.omit(order.customer, "_id"),
        createdOn: convertToDateAndTime(order.customer.createdOn),
      };
      expect(actualData, "Validate customer data on Customer Details component on Order Details page").toEqual(
        expectedData
      );
    }
  );

  test(
    "Should see valid customer data without notes",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ orderDetailsPage, mock }) => {
      const customers = new CustomersMockBuilder().addDefaultCustomer(false).build();
      const order = new OrderBuilder({ customer: customers.Customers[0] }).build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      const actualData = await orderDetailsPage.customerDetails.getInfo();
      const expectedData = {
        ..._.omit(order.customer, "_id"),
        createdOn: convertToDateAndTime(order.customer.createdOn),
        notes: "-",
      };
      expect(actualData, "Validate customer data on Customer Details component on Order Details page").toEqual(
        expectedData
      );
    }
  );
});
