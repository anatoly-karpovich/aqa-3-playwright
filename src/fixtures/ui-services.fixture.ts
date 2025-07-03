import { test as base } from "@playwright/test";
import { HomeUIService } from "ui/services/home.ui-service";
import { SignInUIService } from "ui/services/signIn.ui-serivice";
import { OrderDetailsUIService } from "ui/services/orderDetails.ui-service";
import { ProductsUIService } from "ui/services/products.ui-service";
import { CustomersUIService } from "ui/services/customers.ui-service";
import { CustomersUIService as CustomersListSeUIService } from "ui/services/customers/customers.ui-service";
import { AddNewCustomerUiService } from "ui/services/customers/add-new-customer.ui-service";
import { EditCustomerUiService } from "ui/services/customers/edit-customer.ui-service";

interface IUIServices {
  homeUIService: HomeUIService;
  signInUIService: SignInUIService;
  customersUIService: CustomersUIService;
  customersListUIService: CustomersListSeUIService;
  addNewCustomerUIService: AddNewCustomerUiService;
  editCustomerUIService: EditCustomerUiService;
  orderDetailsUIService: OrderDetailsUIService;
  productsUIService: ProductsUIService;
}

export const test = base.extend<IUIServices>({
  homeUIService: async ({ page }, use) => {
    await use(new HomeUIService(page));
  },
  signInUIService: async ({ page }, use) => {
    await use(new SignInUIService(page));
  },
  customersUIService: async ({ page }, use) => {
    await use(new CustomersUIService(page));
  },
  customersListUIService: async ({ page }, use) => {
    await use(new CustomersListSeUIService(page));
  },
  addNewCustomerUIService: async ({ page }, use) => {
    await use(new AddNewCustomerUiService(page));
  },
  editCustomerUIService: async ({ page }, use) => {
    await use(new EditCustomerUiService(page));
  },
  orderDetailsUIService: async ({ page }, use) => {
    await use(new OrderDetailsUIService(page));
  },
  productsUIService: async ({ page }, use) => {
    await use(new ProductsUIService(page));
  },
});

export { expect } from "@playwright/test";
