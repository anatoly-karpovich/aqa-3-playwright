import { expect, test } from "fixtures/ui-services.fixture";
import _ from "lodash";
import { convertToDateAndTime } from "utils/date.utils";

test.describe("[E2E] [UI] [Customers] [Details]", () => {
  let token = "";
  let id = "";

  test(
    "Should display valid customer data",
    { tag: ["@smoke", "@regression"] },
    async ({ page, homeUIService, customersUIService, customersApiService, customerDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      token = (await page.context().cookies()).find((c) => c.name === "Authorization")!.value;
      const createdCustomer = await customersApiService.create(token);
      id = createdCustomer._id;
      await homeUIService.openModule("Customers");
      await customersUIService.openDetailsPage(createdCustomer.email);
      const actualData = await customerDetailsPage.getDetails();
      expect(actualData).toMatchObject({
        ..._.omit(createdCustomer, "_id"),
        createdOn: convertToDateAndTime(createdCustomer.createdOn),
      });
    }
  );

  test.afterEach(async ({ customersController }) => {
    await customersController.delete(id, token);
  });
});
