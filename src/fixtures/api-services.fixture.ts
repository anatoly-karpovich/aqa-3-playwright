import { CustomersApiService } from "api/services/customers.api-service";
import { test as base } from "fixtures/contollers.fixture";

interface IApiServices {
  customersApiService: CustomersApiService;
}

export const test = base.extend<IApiServices>({
  customersApiService: async ({ request }, use) => {
    await use(new CustomersApiService(request));
  },
});

export { expect } from "@playwright/test";
