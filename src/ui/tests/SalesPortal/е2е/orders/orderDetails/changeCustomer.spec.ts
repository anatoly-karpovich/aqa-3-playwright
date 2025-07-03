import { expect, test } from "fixtures";
import { ORDER_STATUSES } from "types/order.types";
import _ from "lodash";
import { convertToDateAndTime } from "utils/date.utils";
import { TAGS } from "data/tags";

test.describe("[UI] [Orders] [Order Details] [Change Customer]", () => {
  test(
    "Should change customer",
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ orderDetailsUIService, orderDetailsPage, dataManager }) => {
      const order = await dataManager.createOrder(ORDER_STATUSES.DRAFT);
      const newCustomer = await dataManager.createCustomer();
      await orderDetailsUIService.open(order);
      await orderDetailsUIService.changeCustomer(newCustomer.name);
      const customerData = await orderDetailsPage.customerDetails.getInfo();
      const actualData = { ..._.omit(newCustomer, "_id"), createdOn: convertToDateAndTime(newCustomer.createdOn) };
      expect(customerData, "Validate that customer was changed").toEqual(actualData);
    }
  );
});
