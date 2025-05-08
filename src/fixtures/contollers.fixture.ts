import { test as base } from "@playwright/test";
import { CustomersController } from "api/controllers/customers.controller";

interface ISalesPortalControllers {
  customersController: CustomersController;
}

export const test = base.extend<ISalesPortalControllers>({
  customersController: async ({}, use) => {
    await use(new CustomersController());
  },
});
export { expect } from "@playwright/test";
