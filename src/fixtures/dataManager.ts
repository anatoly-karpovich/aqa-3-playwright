import { APIRequestContext, Page } from "@playwright/test";
import { CustomersApiService } from "api/services/customers.api-service";
import { OrdersApiService } from "api/services/orders.api-service";
import { ProductsApiService } from "api/services/products.api-service";
import { SignInApiService } from "api/services/signIn.api-service";
import { ICustomerFromResponse } from "types/customer.types";
import { IOrder, ORDER_STATUSES } from "types/order.types";
import { IProductFromResponse } from "types/products.types";

export class DataManager {
  private customersApiService: CustomersApiService;
  private productsApiService: ProductsApiService;
  private ordersApiService: OrdersApiService;
  private signInApiService: SignInApiService;
  private token = "";

  private products: IProductFromResponse[] = [];
  private customers: ICustomerFromResponse[] = [];
  private orders: IOrder[] = [];

  private constructor(request: APIRequestContext, token?: string) {
    this.customersApiService = new CustomersApiService(request);
    this.productsApiService = new ProductsApiService(request);
    this.ordersApiService = new OrdersApiService(request);
    this.signInApiService = new SignInApiService(request);
    if (token) this.token = token;
  }

  static async init(request: APIRequestContext, page: Page) {
    const token = (await page.context().cookies()).find((c) => c.name === "Authorization")!.value;
    return new DataManager(request, token);
  }

  async getToken() {
    if (this.token) return this.token;
    this.token = await this.signInApiService.loginAsLocalUser();
    return this.token;
  }

  async createOrder(
    status?: ORDER_STATUSES | "Draft with delivery",
    options: { numberOfComments?: number; numberOFProducts?: number } = { numberOfComments: 0, numberOFProducts: 1 }
  ) {
    const token = await this.getToken();
    let order: IOrder;
    // try {
    switch (status) {
      case ORDER_STATUSES.IN_PROCESS:
        order = await this.ordersApiService.createInProsessOrder(token);
        break;
      case ORDER_STATUSES.PARTIALLY_RECEIVED:
        order = await this.ordersApiService.createOrderInPartiallyReceivedStatus(
          token,
          options.numberOFProducts === 1 ? 2 : options.numberOFProducts
        );
        break;
      case ORDER_STATUSES.RECEIVED:
        order = await this.ordersApiService.createOrderInReceivedStatus(token);
        break;
      case ORDER_STATUSES.CANCELED:
        order = await this.ordersApiService.createCanceledOrder(token);
        break;
      case ORDER_STATUSES.DRAFT:
        order = await this.ordersApiService.createDraftOrder(token);
        break;
      case "Draft with delivery":
        order = await this.ordersApiService.createDraftOrderWithDelivery(token);
        break;
      default:
        order = await this.ordersApiService.createDraftOrder(token);
        break;
    }
    // } catch (e) {
    //   throw new Error(`Failed to create order with status ${status}: \n${e}`);
    // }
    if (options.numberOfComments) {
      for (let i = 0; i < options.numberOfComments; i++) {
        order = await this.ordersApiService.addComment(order._id, token);
      }
    }
    this.orders.push(order);
    return order;
  }

  async createProduct() {
    const token = await this.getToken();
    const product = await this.productsApiService.create(token);
    this.products.push(product);
    return product;
  }

  async createCustomer() {
    const token = await this.getToken();
    const customer = await this.customersApiService.create(token);
    this.customers.push(customer);
    return customer;
  }

  setOrder(order: IOrder) {
    if (this.orders.some((o) => o._id === order._id)) return;
    this.orders.push(order);
    this.removeCustomer(order.customer._id);
    this.removeProducts(order.products.map((p) => p._id));
  }

  private removeCustomer(customerId: string) {
    const index = this.customers.findIndex((c) => c._id === customerId);
    if (index === -1) return;
    this.customers.splice(index, 1);
  }

  private removeProducts(productIds: string[]) {
    for (const productId of productIds) {
      const index = this.products.findIndex((p) => p._id === productId);
      if (index === -1) continue;
      this.products.splice(index, 1);
    }
  }

  async cleanUp() {
    for (const order of this.orders) {
      await this.ordersApiService.delete(order, this.token);
    }

    for (const product of this.products) {
      await this.productsApiService.delete(product._id, this.token);
    }

    for (const customer of this.customers) {
      await this.customersApiService.delete(customer._id, this.token);
    }
  }
}
