import { APIRequestContext } from "@playwright/test";
import { RequestApi } from "api/apiClients/request";
import { apiConfig } from "config/api-config";
import { IRequestOptions } from "types/api.types";
import { IProduct, IProductResponse, IProductsResponse } from "types/products.types";
import { logStep } from "utils/reporter.utils";
import { convertRequestParams } from "utils/requestParams";

export class ProductsController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep("POST /api/products request")
  async create(productData: IProduct, token: string) {
    const options: IRequestOptions = {
      url: apiConfig.ENDPOINTS.PRODUCTS,
      baseURL: apiConfig.BASE_URL,
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: productData,
    };
    return await this.request.send<IProductResponse>(options);
  }

  @logStep("GET /api/products request")
  async getSorted(token: string, params?: Record<string, string>) {
    let urlParams = "";
    if (params) {
      urlParams = convertRequestParams(params as Record<string, string>);
    }
    const options: IRequestOptions = {
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url: apiConfig.ENDPOINTS.PRODUCTS + urlParams,
      baseURL: apiConfig.BASE_URL,
    };
    const result = await this.request.send<IProductsResponse>(options);
    return result;
  }

  @logStep("GET /api/products/all request")
  async getAll(token: string) {
    const options: IRequestOptions = {
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url: apiConfig.ENDPOINTS.PRODUCTS_ALL,
      baseURL: apiConfig.BASE_URL,
    };
    const result = await this.request.send<IProductsResponse>(options);
    return result;
  }

  @logStep("GET /api/products/:id request")
  async getById(productId: string, token: string) {
    const url = `${apiConfig.ENDPOINTS.PRODUCTS}/${productId}`;
    const options: IRequestOptions = {
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url: url,
      baseURL: apiConfig.BASE_URL,
    };
    const result = await this.request.send<IProductResponse>(options);
    return result;
  }

  @logStep("DELETE /api/products/:id request")
  async delete(productId: string, token: string) {
    const options: IRequestOptions = {
      method: "delete",
      baseURL: apiConfig.BASE_URL,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url: apiConfig.ENDPOINTS["PRODUCT_BY_ID"](productId),
    };
    return await this.request.send<null>(options);
  }

  @logStep("PUT /api/products/:id request")
  async update(data: { id: string; body: IProduct }, token: string) {
    const options: IRequestOptions = {
      url: apiConfig.ENDPOINTS["PRODUCT_BY_ID"](data.id),
      baseURL: apiConfig.BASE_URL,
      method: "put",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data.body,
    };
    return await this.request.send<IProductResponse>(options);
  }
}
