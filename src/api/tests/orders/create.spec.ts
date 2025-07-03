import { STATUS_CODES } from "data/statusCodes";
import { expect, test } from "fixtures";

test.describe("[API] [Orders] [Create]", () => {
  let id = "";
  let token = "";
  test.afterEach(async ({ ordersController }) => {
    if (!id) return;
    const response = await ordersController.delete(id, token);
    expect.soft(response.status).toBe(STATUS_CODES.DELETED);
  });

  test("Create order with smoke data using controller", async ({ signInApiService, ordersApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    const order = await ordersApiService.createOrderInReceivedStatus(token);
    id = order._id;
  });

  test("Delete all orders", async ({ signInApiService, ordersApiService, ordersController }) => {
    token = await signInApiService.loginAsLocalUser();
    const orders = (await ordersController.getSorted(token)).body.Orders;
    for (const order of orders) {
      await ordersController.delete(order._id, token);
    }
  });
});
