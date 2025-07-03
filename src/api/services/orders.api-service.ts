import { CustomersController } from "api/controllers/customers.controller";
import { ProductsController } from "api/controllers/products.controller";
import { CustomersApiService } from "./customers.api-service";
import { ProductsApiService } from "./products.api-service";
import { APIRequestContext, expect } from "@playwright/test";
import { OrdersController } from "api/controllers/orders.controller";
import { IOrder, IOrderCreateBody, ORDER_STATUSES } from "types/order.types";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validations/responseValidation";
import { generateDelivery } from "data/orders/delivery";
import { logStep } from "utils/reporter.utils";

export class OrdersApiService {
  private customersApiService: CustomersApiService;
  private productsApiService: ProductsApiService;
  private ordersController: OrdersController;
  private customersController: CustomersController;
  private productsController: ProductsController;

  constructor(request: APIRequestContext) {
    this.customersApiService = new CustomersApiService(request);
    this.productsApiService = new ProductsApiService(request);
    this.ordersController = new OrdersController(request);
    this.customersController = new CustomersController(request);
    this.productsController = new ProductsController(request);
  }

  async create(data: IOrderCreateBody, token: string) {
    const response = await this.ordersController.create(data, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    return response.body.Order;
  }

  @logStep("Create Draft Order via API")
  async createDraftOrder(token: string, numberOFProducts = 1) {
    if (numberOFProducts < 1 || numberOFProducts > 5)
      throw new Error(`Unable to create Order with ${numberOFProducts} products`);
    const customer = await this.customersApiService.create(token);
    // const product = await this.productsApiService.create(token);
    const orderData: IOrderCreateBody = {
      customer: customer._id,
      products: [],
    };
    if (numberOFProducts > 5 || numberOFProducts < 1) {
      throw new Error(`Incorrect number of Products`);
    }
    for (let i = 0; i < numberOFProducts; i++) {
      const product = await this.productsApiService.create(token);
      orderData.products.push(product._id);
    }
    const order = await this.create(orderData, token);
    return order;
  }

  @logStep("Create Draft Order with Delivery via API")
  async createDraftOrderWithDelivery(token: string, numberOFProducts = 1) {
    const order = await this.createDraftOrder(token, numberOFProducts);
    const orderWithDelivery = await this.ordersController.updateDelivery(order._id, generateDelivery(), token);
    return orderWithDelivery.body.Order;
  }

  @logStep("Create In Process Order via API")
  async createInProsessOrder(token: string, numberOFProducts = 1) {
    const createdOrder = await this.createDraftOrderWithDelivery(token, numberOFProducts);
    const order = await this.ordersController.updateStatus(
      {
        id: createdOrder._id,
        status: ORDER_STATUSES.IN_PROCESS,
      },
      token
    );
    return order.body.Order;
  }

  @logStep("Create Canceled Order via API")
  async createCanceledOrder(token: string, numberOFProducts = 1) {
    const createdOrder = await this.createDraftOrderWithDelivery(token, numberOFProducts);
    const order = await this.ordersController.updateStatus(
      {
        id: createdOrder._id,
        status: ORDER_STATUSES.CANCELED,
      },
      token
    );
    return order.body.Order;
  }

  @logStep("Create Partially Received Order via API")
  async createOrderInPartiallyReceivedStatus(token: string, numberOFProducts = 2) {
    if (numberOFProducts < 2 || numberOFProducts > 5)
      throw new Error(`Unable to create Partially Received Order with ${numberOFProducts} products`);
    const createdOrder = await this.createInProsessOrder(token, numberOFProducts);
    const response = await this.ordersController.receiveProducts(
      createdOrder._id,
      [createdOrder.products[0]._id],
      token
    );
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep("Create Received Order via API")
  async createOrderInReceivedStatus(token: string, numberOFProducts = 1) {
    const createdOrder = await this.createInProsessOrder(token, numberOFProducts);
    const response = await this.ordersController.receiveProducts(
      createdOrder._id,
      createdOrder.products.map((product) => product._id),
      token
    );
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }

  @logStep("Delete Order with customer and products via API")
  async delete(idOrOrder: string | IOrder, token: string) {
    const createdOrder =
      typeof idOrOrder === "string" ? (await this.ordersController.getByID(idOrOrder, token)).body.Order : idOrOrder;
    const orderId = createdOrder._id;
    const customerId = createdOrder.customer._id;
    const productsIds = createdOrder.products.map((product) => product._id);
    const uniqueProductsIds = [...new Set(productsIds)];

    //delete order
    const orderDeleteResponse = await this.ordersController.delete(orderId, token);
    expect.soft(orderDeleteResponse.status).toBe(STATUS_CODES.DELETED);

    //delete customer
    const responseCustomer = await this.customersController.delete(customerId, token);
    expect.soft(responseCustomer.status).toBe(STATUS_CODES.DELETED);

    //delete products
    const responsesProducts = await Promise.all(
      uniqueProductsIds.map((id) => this.productsController.delete(id, token))
    );
    responsesProducts.forEach((response) => expect.soft(response.status).toBe(STATUS_CODES.DELETED));
  }

  async addComment(orderId: string, token: string, text?: string) {
    const response = await this.ordersController.addComment(orderId, text ?? "Test comment", token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Order;
  }
}
