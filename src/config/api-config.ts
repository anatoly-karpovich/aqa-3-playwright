export const apiConfig = {
  BASE_URL: "https://aqa-course-project.app",
  ENDPOINTS: {
    CUSTOMERS: "/api/customers",
    CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}/`,
    PRODUCTS: "/api/products",
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}/`,
    LOGIN: "/api/login",
  },
} as const;
