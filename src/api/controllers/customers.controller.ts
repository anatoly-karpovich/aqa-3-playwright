import { RequestApi } from "api/apiClients/request";
import { apiConfig } from "config/api-config";
import { IRequestOptions } from "types/api.types";
import { ICustomer, ICustomerResponse, ICustomersResponse } from "types/customer.types";
import { convertRequestParams } from "utils/requestParams";

export class CustomersController {
  constructor(private request = new RequestApi()) {}

  async create(body: ICustomer, token: string) {
    const options: IRequestOptions = {
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

  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomerResponse>(options);
  }

  async getAll(token: string, params?: Record<string, string>) {
    const options: IRequestOptions = {
      url: apiConfig.ENDPOINTS.CUSTOMERS + (params ? convertRequestParams(params) : ""),
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<ICustomersResponse>(options);
  }

  async update(id: string, body: ICustomer, token: string) {
    const options: IRequestOptions = {
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

  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<null>(options);
  }
}
