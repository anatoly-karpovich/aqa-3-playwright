import { SALES_PORTAL_BACKEND_URL } from "./evnironment";

export const apiConfig = {
  BASE_URL: SALES_PORTAL_BACKEND_URL,
  ENDPOINTS: {
    CUSTOMERS: "/api/customers",
    CUSTOMERS_ALL: "/api/customers/all",
    CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}/`,
    CUSTOMER_ORDERS: (id: string) => `/api/customers/${id}/orders`,
    PRODUCTS: "/api/products",
    PRODUCTS_ALL: "/api/products/all",
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}/`,
    LOGIN: "/api/login",
    METRICS: "/api/metrics",
    ORDERS: "/api/orders",
    ORDER_BY_ID: (id: string) => `/api/orders/${id}/`,
    ORDER_DELIVERY: (id: string) => `/api/orders/${id}/delivery/`,
    ORDER_RECEIVE: (id: string) => `/api/orders/${id}/receive`,
    ORDER_STATUS: (id: string) => `/api/orders/${id}/status`,
    ORDER_COMMENTS: (id: string) => `/api/orders/${id}/comments`,
    ORDER_COMMENTS_DELETE: (orderId: string, commentId: string) => `/api/orders/${orderId}/comments/${commentId}`,
  },
} as const;
