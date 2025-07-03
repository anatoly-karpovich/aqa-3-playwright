import { Page } from "@playwright/test";
import { apiConfig } from "config/api-config";
import { STATUS_CODES } from "data/statusCodes";
import { IResponseFields } from "types/api.types";
import { ICustomersResponse, ICustomerResponse } from "types/customer.types";
import { IMetricsResponse } from "types/metrics.types";
import { IOrderResponse, IOrdersResponse } from "types/order.types";
import { IProductsResponse, IProductResponse } from "types/products.types";

export class Mock {
  constructor(private page: Page) {}

  async customers(body: ICustomersResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/customers(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async editCustomer(customer: ICustomerResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMER_BY_ID(customer.Customer._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(customer),
      });
    });
  }

  async customerDetails(
    customer: ICustomerResponse,
    orders: IOrdersResponse,
    statusCode: STATUS_CODES = STATUS_CODES.OK
  ) {
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMER_BY_ID(customer.Customer._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(customer),
      });
    });
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMER_ORDERS(customer.Customer._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(orders),
      });
    });
  }

  async products(body: IProductsResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/products(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async productDetails(body: IProductResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.PRODUCT_BY_ID(body.Product._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async metrics(body: IMetricsResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.METRICS, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async ordersPaginated(body: IOrdersResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/orders(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  // async orders(body: IOrderResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
  //   this.page.route(apiConfig.BASE_URL + "/" + apiConfig.ENDPOINTS.ORDERS, async (route) => {
  //     await route.fulfill({
  //       status: statusCode,
  //       contentType: "application/json",
  //       body: JSON.stringify(body),
  //     });
  //   });
  // }

  async orders(options: {
    getResponse?: IOrdersResponse | IResponseFields;
    postResponse?: IOrderResponse | IResponseFields;
    getStatus?: STATUS_CODES;
    postStatus?: STATUS_CODES;
  }) {
    const { getResponse, postResponse, getStatus = STATUS_CODES.OK, postStatus = STATUS_CODES.CREATED } = options;

    await this.page.route(
      (url) => {
        return url.pathname.endsWith("/api/orders");
      },
      async (route) => {
        const method = route.request().method();

        if (method === "GET" && getResponse) {
          await route.fulfill({
            status: getStatus,
            contentType: "application/json",
            body: JSON.stringify(getResponse),
          });
        } else if ((method === "POST" || method === "PUT") && postResponse) {
          await route.fulfill({
            status: postStatus,
            contentType: "application/json",
            body: JSON.stringify(postResponse),
          });
        } else {
          await route.continue();
        }
      }
    );
  }

  async createOrderModal(options: {
    customers: ICustomersResponse | IResponseFields;
    products: IProductsResponse | IResponseFields;
    customersStatusCode?: STATUS_CODES;
    productsStatusCode?: STATUS_CODES;
  }) {
    const {
      customers,
      products,
      customersStatusCode = STATUS_CODES.OK,
      productsStatusCode = STATUS_CODES.OK,
    } = options;
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMERS_ALL, async (route) => {
      await route.fulfill({
        status: customersStatusCode,
        contentType: "application/json",
        body: JSON.stringify(customers),
      });
    });
    console.log(apiConfig.BASE_URL);
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.PRODUCTS_ALL, async (route) => {
      await route.fulfill({
        status: productsStatusCode,
        contentType: "application/json",
        body: JSON.stringify(products),
      });
    });
  }

  async orderDetails(customers: ICustomersResponse, order: IOrderResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.CUSTOMERS_ALL, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(customers),
      });
    });
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDER_BY_ID(order.Order._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(order),
      });
    });
  }

  async delivery(order: IOrderResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + apiConfig.ENDPOINTS.ORDER_BY_ID(order.Order._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(order),
      });
    });
  }
}

export interface ISortingMockOptions {
  sortField: string;
  sortDir: string;
}
