import {
  IMetricsResponse,
  ITopCustomerEntry,
  ICustomerGrowthEntry,
  ITopProductEntry,
  IOrdersCountPerDayEntry,
} from "types/metrics.types";
import { IOrder } from "types/order.types";
import { BaseMockBuilder } from "./baseMockBuilder";
import { OrderBuilder } from "./";

export class MetricsMockBuilder extends BaseMockBuilder<IMetricsResponse> {
  protected data: IMetricsResponse = {
    IsSuccess: true,
    ErrorMessage: null,
    Metrics: {
      orders: {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        totalCanceledOrders: 0,
        recentOrders: [],
        ordersCountPerDay: [],
      },
      customers: {
        totalNewCustomers: 0,
        topCustomers: [],
        customerGrowth: [],
      },
      products: {
        topProducts: [],
      },
    },
  };

  setTotalRevenue(value: number) {
    this.data.Metrics.orders.totalRevenue = value;
    return this;
  }

  setTotalOrders(value: number) {
    this.data.Metrics.orders.totalOrders = value;
    return this;
  }

  setAverageOrderValue(value: number) {
    this.data.Metrics.orders.averageOrderValue = value;
    return this;
  }

  setTotalCanceledOrders(value: number) {
    this.data.Metrics.orders.totalCanceledOrders = value;
    return this;
  }

  addRecentOrders(...orders: IOrder[]) {
    const currentOrdersCount = this.data.Metrics.orders.recentOrders.length;
    if (currentOrdersCount >= 3 || currentOrdersCount + orders.length > 3) {
      throw new Error("Cannot add more than 3 orders");
    }
    this.data.Metrics.orders.recentOrders = orders;
    return this;
  }

  addDefaultRecentOrder() {
    this.data.Metrics.orders.recentOrders.push(new OrderBuilder().build());
    return this;
  }

  setOrdersCountPerDay(entries: IOrdersCountPerDayEntry[]) {
    this.data.Metrics.orders.ordersCountPerDay = entries;
    return this;
  }

  // CUSTOMERS
  setTotalNewCustomers(value: number) {
    this.data.Metrics.customers.totalNewCustomers = value;
    return this;
  }

  setTopCustomers(...customers: ITopCustomerEntry[]) {
    this.data.Metrics.customers.topCustomers = customers;
    return this;
  }

  setCustomerGrowth(growth: ICustomerGrowthEntry[]) {
    this.data.Metrics.customers.customerGrowth = growth;
    return this;
  }

  // PRODUCTS
  setTopProducts(products: ITopProductEntry[]) {
    this.data.Metrics.products.topProducts = products;
    return this;
  }

  // Быстрые add-методы для удобства
  addTopCustomer(customer: ITopCustomerEntry) {
    this.data.Metrics.customers.topCustomers.push(customer);
    return this;
  }

  addCustomerGrowth(entry: ICustomerGrowthEntry) {
    this.data.Metrics.customers.customerGrowth.push(entry);
    return this;
  }

  addTopProduct(product: ITopProductEntry) {
    this.data.Metrics.products.topProducts.push(product);
    return this;
  }

  addRecentOrder(order: IOrder) {
    this.data.Metrics.orders.recentOrders.push(order);
    return this;
  }

  addOrdersCountPerDay(entry: IOrdersCountPerDayEntry) {
    this.data.Metrics.orders.ordersCountPerDay.push(entry);
    return this;
  }
}
