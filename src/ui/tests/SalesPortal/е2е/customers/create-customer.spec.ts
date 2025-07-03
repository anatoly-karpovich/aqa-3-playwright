import { STATUS_CODES } from "data/statusCodes";
import { expect, test } from "fixtures";

test.describe("[E2E] [UI] [Customers] [Create]", () => {
  let id = "";
  test(
    "Create customer with smoke data",
    { tag: ["@smoke"] },
    async ({ addNewCustomerPage, addNewCustomerUIService, customersController, dataManager }) => {
      await addNewCustomerPage.open();
      const createdCustomer = await addNewCustomerUIService.create();
      id = createdCustomer._id;
      const token = await dataManager.getToken();
      const response = await customersController.getById(createdCustomer._id, token);
      test.step("Check that customer is created via API", async () => {
        expect(response.status).toBe(STATUS_CODES.OK);
      });
    }
  );

  test.afterEach(async ({ dataManager, customersController }) => {
    await customersController.delete(id, await dataManager.getToken());
  });
});
