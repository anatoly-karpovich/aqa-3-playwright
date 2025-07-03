import { CustomersApiService } from "api/services/customers.api-service";
import { OrdersApiService } from "api/services/orders.api-service";
import { ProductsApiService } from "api/services/products.api-service";
import { SignInApiService } from "api/services/signIn.api-service";
import { test as base } from "@playwright/test";

interface IApiServices {
  customersApiService: CustomersApiService;
  signInApiService: SignInApiService;
  productsApiService: ProductsApiService;
  ordersApiService: OrdersApiService;
}

export const test = base.extend<IApiServices>({
  customersApiService: async ({ request }, use) => {
    await use(new CustomersApiService(request));
  },

  signInApiService: async ({ request }, use) => {
    await use(new SignInApiService(request));
  },

  productsApiService: async ({ request }, use) => {
    await use(new ProductsApiService(request));
  },

  ordersApiService: async ({ request }, use) => {
    await use(new OrdersApiService(request));
  },
});

export { expect } from "@playwright/test";
