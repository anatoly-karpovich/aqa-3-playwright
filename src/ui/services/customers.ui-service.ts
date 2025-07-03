import { AddNewCustomerPage } from "ui/pages/customers/add-new-customer.page";
import { CustomerDetailsPage } from "ui/pages/customers/customer-details.page";
import { CustomersPage } from "ui/pages/customers/customers.page";
import { EditCustomerPage } from "ui/pages/customers/edit-customer.page";
import { SalesPortalUIService } from "./salesPortal.ui-service";
import { apiConfig } from "config/api-config";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { expect } from "fixtures";
import { STATUS_CODES } from "http";
import _ from "lodash";
import { ICustomer, ICustomerResponse } from "types/customer.types";
import { logStep } from "utils/reporter.utils";
import { SALES_PORTAL_URL } from "config/evnironment";

export class CustomersUIService extends SalesPortalUIService {
  private customersPage = new CustomersPage(this.page);
  private addNewCustomerPage = new AddNewCustomerPage(this.page);
  private editCustomerPage = new EditCustomerPage(this.page);
  private customerDetailsPage = new CustomerDetailsPage(this.page);

  async openListPageViaUrl() {
    await this.page.goto(SALES_PORTAL_URL + "/customers");
    await this.customersPage.waitForOpened();
  }

  async openEditPageViaUrl(id: string) {
    await this.page.goto(SALES_PORTAL_URL + `/customers/${id}/edit`);
    await this.editCustomerPage.waitForOpened();
  }

  async openDetailsPageViaUrl(id: string) {
    await this.page.goto(SALES_PORTAL_URL + `/customers/${id}`);
    await this.customerDetailsPage.waitForOpened();
  }

  async openAddPageViaUrl() {
    await this.page.goto(SALES_PORTAL_URL + "/customers/add");
    await this.addNewCustomerPage.waitForOpened();
  }

  @logStep("Create new Customer on Add New Customer Page")
  async create(customData?: ICustomer) {
    const data = generateCustomerData(customData);
    await this.addNewCustomerPage.fillInputs(data);
    const response = await this.addNewCustomerPage.interceptResponse<ICustomerResponse, any>(
      apiConfig.ENDPOINTS.CUSTOMERS,
      this.addNewCustomerPage.clickSaveNewCustomer.bind(this.addNewCustomerPage)
    );
    expect(response.status).toBe(STATUS_CODES.CREATED);
    expect(_.omit(response.body.Customer, "_id", "createdOn")).toEqual({ ...data });
    await this.customersPage.waitForOpened();
    return response.body.Customer;
  }
}
