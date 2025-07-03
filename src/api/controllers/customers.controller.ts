import { APIRequestContext } from "@playwright/test";
import { RequestApi } from "api/apiClients/request";
import { apiConfig } from "config/api-config";
import { IRequestOptions } from "types/api.types";
import { ICustomer, ICustomerResponse, ICustomersResponse, ICustomersSortedResponse } from "types/customer.types";
import { logStep } from "utils/reporter.utils";
import { convertRequestParams } from "utils/requestParams";

export class CustomersController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep("POST /api/customers request")
  async create(body: ICustomer, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMERS,
      method: "post",
      data: body,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomerResponse>(options);
  }

  @logStep("GET /api/customers/:id request")
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomerResponse>(options);
  }

  @logStep("GET /api/customers/all request")
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMERS_ALL,
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomersResponse>(options);
  }

  @logStep("GET /api/customers request")
  async getSorted(token: string, params?: Record<string, string>) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMERS + (params ? convertRequestParams(params) : ""),
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomersSortedResponse>(options);
  }

  @logStep("PUT /api/customers/:id request")
  async update(id: string, body: ICustomer, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: "put",
      data: body,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomerResponse>(options);
  }

  @logStep("DELETE /api/customers/:id request")
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<null>(options);
  }
}
