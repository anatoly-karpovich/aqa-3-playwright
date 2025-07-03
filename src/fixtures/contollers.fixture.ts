import { test as base } from "@playwright/test";
import { CustomersController } from "api/controllers/customers.controller";
import { OrdersController } from "api/controllers/orders.controller";
import { ProductsController } from "api/controllers/products.controller";

interface ISalesPortalControllers {
  customersController: CustomersController;
  productsController: ProductsController;
  ordersController: OrdersController;
}

export const test = base.extend<ISalesPortalControllers>({
  customersController: async ({ request }, use) => {
    await use(new CustomersController(request));
  },

  productsController: async ({ request }, use) => {
    await use(new ProductsController(request));
  },

  ordersController: async ({ request }, use) => {
    await use(new OrdersController(request));
  },
});

export { expect } from "@playwright/test";
