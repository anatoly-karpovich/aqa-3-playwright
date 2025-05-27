import { Page } from "@playwright/test";
import { AddNewCustomerPage } from "ui/pages/customers/add-new-customer.page";
import { CustomerDetailsPage } from "ui/pages/customers/customer-details.page";
import { CustomersPage } from "ui/pages/customers/customers.page";
import { EditCustomerPage } from "ui/pages/customers/edit-customer.page";
import { logStep } from "utils/reporter.utils";

export class CustomersUIService {
  private customersPage: CustomersPage;
  private addNewCustomerPage: AddNewCustomerPage;
  private editCustomerPage: EditCustomerPage;
  private customerDetailsPage: CustomerDetailsPage;
  constructor(private page: Page) {
    this.customersPage = new CustomersPage(page);
    this.addNewCustomerPage = new AddNewCustomerPage(page);
    this.editCustomerPage = new EditCustomerPage(page);
    this.customerDetailsPage = new CustomerDetailsPage(page);
  }

  @logStep("Open Add New Customer Page from Customers Page")
  async openAddPage() {
    await this.customersPage.clickAddNewCustomer();
    await this.addNewCustomerPage.waitForOpened();
  }

  async openEditPage(email: string) {
    await this.customersPage.clickTableAction(email, "edit");
    await this.editCustomerPage.waitForOpened();
  }

  async openDetailsPage(email: string) {
    await this.customersPage.clickTableAction(email, "details");
    await this.customerDetailsPage.waitForOpened();
  }
}
