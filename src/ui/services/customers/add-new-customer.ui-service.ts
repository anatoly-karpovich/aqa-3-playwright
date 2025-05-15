import { expect, Page } from "@playwright/test";
import { apiConfig } from "config/api-config";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomer, ICustomerResponse } from "types/customer.types";
import { AddNewCustomerPage } from "ui/pages/customers/add-new-customer.page";
import { CustomersPage } from "ui/pages/customers/customers.page";
import _ from "lodash";

export class AddNewCustomerUiService {
  private addNewCustomerPage: AddNewCustomerPage;
  private customersPage: CustomersPage;
  constructor(private page: Page) {
    this.addNewCustomerPage = new AddNewCustomerPage(page);
    this.customersPage = new CustomersPage(page);
  }

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
