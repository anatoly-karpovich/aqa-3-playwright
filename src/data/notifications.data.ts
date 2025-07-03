export const NOTIFICATIONS = {
  CUSTOMER_CREATED: "Customer was successfully created",
  CUSTOMER_DUPLICATED: (email: string) => `Customer with email '${email}' already exists`,
  CUSTOMER_DELETED: "Customer was successfully deleted",
  ORDER_PROCESSED: "Order processing was successfully started",
  ORDER_CANCELED: "Order was successfully canceled",
  ORDER_REOPENED: "Order was successfully reopened",
  ORDER_CREATED: "Order was successfully created",
  ORDER_NOT_CREATED: "Failed to create an order. Please try again later",
};

export const EMPTY_TABLE_ROW_TEXT = "No records created yet";
