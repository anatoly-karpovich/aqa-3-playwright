export const apiConfig = {
  BASE_URL: "https://aqa-course-project.app",
  ENDPOINTS: {
    CUSTOMERS: "/api/customers",
    CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}/`,
    LOGIN: "/api/login",
  },
} as const;
