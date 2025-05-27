import { STATUS_CODES } from "data/statusCodes";
import { expect, test } from "fixtures/ui-services.fixture";

test.describe("[E2E] [UI] [Customers] [Create]", () => {
  let id = "";
  let token = "";
  test(
    "Create customer with smoke data",
    { tag: ["@smoke"] },
    async ({ homeUIService, customersUIService, addNewCustomerUIService, customersController, page }) => {
      // test.step("Open portal on Home Page", async () => {
      await homeUIService.openAsLoggedInUser();
      // });
      token = (await page.context().cookies()).find((c) => c.name === "Authorization")!.value;
      await homeUIService.openModule("Customers");
      await customersUIService.openAddPage();
      const createdCustomer = await addNewCustomerUIService.create();
      const response = await customersController.getById(createdCustomer._id, token);
      id = createdCustomer._id;
      test.step("Check that customer is created via API", async () => {
        expect(response.status).toBe(STATUS_CODES.OK);
      });
    }
  );

  test.afterEach(async ({ customersController }) => {
    await customersController.delete(id, token);
  });
});
