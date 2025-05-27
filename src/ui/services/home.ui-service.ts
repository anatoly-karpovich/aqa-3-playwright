import test, { Page } from "@playwright/test";
import { ModuleName } from "types/home.types";
import { CustomersPage } from "ui/pages/customers/customers.page";
import { HomePage } from "ui/pages/home.page";
import { ProductsPage } from "ui/pages/products/products.page";
import { logStep } from "utils/reporter.utils";

export class HomeUIService {
  homePage: HomePage;
  customersPage: CustomersPage;
  productsPage: ProductsPage;
  constructor(private page: Page) {
    this.customersPage = new CustomersPage(page);
    this.homePage = new HomePage(page);
    this.productsPage = new ProductsPage(page);
  }

  @logStep()
  async openModule(moduleName: ModuleName) {
    await this.homePage.clickModuleButton(moduleName);
    switch (moduleName) {
      case "Customers":
        await this.customersPage.waitForOpened();
        break;

      case "Products":
        await this.productsPage.waitForOpened();
    }
  }

  @logStep("Open Sales Portal on Home Page")
  async openAsLoggedInUser() {
    await this.homePage.openPortal();
    await this.homePage.waitForOpened();
  }
}
