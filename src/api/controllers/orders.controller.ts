import { APIRequestContext } from "@playwright/test";
import { RequestApi } from "api/apiClients/request";
import { apiConfig } from "config/api-config";
import { IRequestOptions } from "types/api.types";
import { IDeliveryInfo, IOrderCreateBody, IOrderResponse, IOrdersResponse, ORDER_STATUSES } from "types/order.types";
import { logStep } from "utils/reporter.utils";
import { convertRequestParams } from "utils/requestParams";

export class OrdersController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep("POST /api/orders request")
  async create(data: IOrderCreateBody, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS,
      method: "post",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep("DELETE /api/orders/{id} request")
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_BY_ID(id),
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return await this.request.send<null>(options);
  }

  @logStep("GET /api/orders/{id} request")
  async getByID(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url: apiConfig.ENDPOINTS.ORDER_BY_ID(id),
    };
    const result = await this.request.send<IOrderResponse>(options);
    return result;
  }

  @logStep("GET /api/orders/{id} request")
  async getSorted(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url: apiConfig.ENDPOINTS.ORDERS + convertRequestParams({ limit: "100" }),
    };
    const result = await this.request.send<IOrdersResponse>(options);
    return result;
  }

  @logStep("PUT /api/orders/{id} request")
  async update(id: string, data: IOrderCreateBody, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_BY_ID(id),
      method: "put",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep("PUT /api/orders/{id}/status request")
  async updateStatus(data: { id: string; status: ORDER_STATUSES }, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_STATUS(data.id),
      method: "put",
      data: { status: data.status },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep("POST /api/orders/{id}/delivery request")
  async updateDelivery(id: string, delivery: IDeliveryInfo, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_DELIVERY(id),
      method: "post",
      data: delivery,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep("POST /api/orders/{id}/comments request")
  async addComment(id: string, text: string, token: string) {
    const comment = {
      comment: text,
    };
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_COMMENTS(id),
      method: "post",
      data: comment,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep("DELETE /api/orders/{id}/comments/{comment_id} request")
  async deleteComment(order_id: string, comment_id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_COMMENTS_DELETE(order_id, comment_id),
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep("POST /api/orders/{id}/receive request")
  async receiveProducts(id: string, productIds: string[], token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_RECEIVE(id),
      method: "post",
      data: { products: productIds },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }
}
