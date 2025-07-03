// === Кусочки для Orders ===

import { IOrder } from "./order.types";

export interface IOrderMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCanceledOrders: number;
  recentOrders: IOrder[]; // Подключай интерфейс заказа, который уже есть
  ordersCountPerDay: IOrdersCountPerDayEntry[];
}

export interface IOrdersCountPerDayEntry {
  date: {
    year: number;
    month: number;
    day: number;
  };
  count: number;
}

// === Кусочки для Customers ===

export interface ICustomerMetrics {
  totalNewCustomers: number;
  topCustomers: ITopCustomerEntry[];
  customerGrowth: ICustomerGrowthEntry[];
}

export interface ITopCustomerEntry {
  _id: string;
  totalSpent: number;
  ordersCount: number;
  customerName: string;
  customerEmail: string;
}

export interface ICustomerGrowthEntry {
  date: {
    year: number;
    month: number;
    day: number;
  };
  count: number;
}

// === Кусочки для Products ===

export interface IProductMetrics {
  topProducts: ITopProductEntry[];
}

export interface ITopProductEntry {
  name: string;
  sales: number;
}

// === Общий респонс ===

export interface IMetricsResponse {
  IsSuccess: boolean;
  Metrics: {
    orders: IOrderMetrics;
    customers: ICustomerMetrics;
    products: IProductMetrics;
  };
  ErrorMessage: string | null;
}
