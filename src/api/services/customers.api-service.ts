import { APIRequestContext, expect } from "@playwright/test";
import { CustomersController } from "api/controllers/customers.controller";
import { generateCustomerData } from "data/customers/generateCustomer.data";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomer } from "types/customer.types";
import { logStep } from "utils/reporter.utils";
import { validateResponse } from "utils/validations/responseValidation";

export class CustomersApiService {
  controller: CustomersController;
  constructor(request: APIRequestContext) {
    this.controller = new CustomersController(request);
  }

  @logStep("Create Customer via API")
  async create(token: string, customData?: ICustomer) {
    const body = generateCustomerData(customData);
    const response = await this.controller.create(body, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    return response.body.Customer;
  }
}
