import { CustomersMockBuilder, OrderBuilder, ProductsMockBuilder } from "data/builders";
import { ROUTES } from "data/routes";
import { test } from "fixtures";

test.describe("[UI] [Sales Portal] [Routing]", async () => {
  test("Should open home page via url", async ({ homePage, page }) => {
    await homePage.open();
    await homePage.waitForOpened();
  });

  test("Should open orders page via url", async ({ ordersPage, page }) => {
    await ordersPage.open();
    await ordersPage.waitForOpened();
  });

  test("Should open order details page via url", async ({ orderDetailsPage, mock, page }) => {
    const order = new OrderBuilder().build();
    const customers = new CustomersMockBuilder().addDefaultCustomer().build();
    await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
    await orderDetailsPage.open(order._id);
    await orderDetailsPage.waitForOpened();
  });

  test("Should open schedule delivery page via url", async ({ scheduleDeliveryPage, mock, page }) => {
    const order = new OrderBuilder().build();
    await mock.delivery({ Order: order, ErrorMessage: null, IsSuccess: true });
    await scheduleDeliveryPage.open(order._id);
    await scheduleDeliveryPage.waitForOpened();
  });

  test("Should open edit delivery page via url", async ({ editDeliveryPage, mock, page }) => {
    const order = new OrderBuilder().addDelivery().build();
    await mock.delivery({ Order: order, ErrorMessage: null, IsSuccess: true });
    await editDeliveryPage.open(order._id);
    await editDeliveryPage.waitForOpened();
  });

  test("Should open products page via url", async ({ productsPage, page }) => {
    await productsPage.open();
    await productsPage.waitForOpened();
  });

  test("Should open add new product page via url", async ({ addNewProductPage, page }) => {
    await addNewProductPage.open();
    await addNewProductPage.waitForOpened();
  });

  test("Should open edit product page via url", async ({ editProductPage, mock, page }) => {
    const product = new ProductsMockBuilder().addRandomProduct().build().Products[0];
    await mock.productDetails({ Product: product, IsSuccess: true, ErrorMessage: null });
    await editProductPage.open(product._id);
    await editProductPage.waitForOpened();
  });

  test("Should open customers page via url", async ({ customersPage, page }) => {
    await customersPage.open();
    await customersPage.waitForOpened();
  });

  test("Should open customer details page via url", async ({ customerDetailsPage, mock, page }) => {
    const customer = new CustomersMockBuilder().addRandomCustomer().build().Customers[0];
    await mock.customerDetails(
      { Customer: customer, IsSuccess: true, ErrorMessage: null },
      { Orders: [], ErrorMessage: null, IsSuccess: true }
    );
    await customerDetailsPage.open(customer._id);
    await customerDetailsPage.waitForOpened();
  });

  test("Should open add new customer page via url", async ({ addNewCustomerPage, page }) => {
    await addNewCustomerPage.open();
    await addNewCustomerPage.waitForOpened();
  });

  test("Should open edit customer page via url", async ({ editCustomerPage, mock, page }) => {
    const customer = new CustomersMockBuilder().addRandomCustomer().build().Customers[0];
    await mock.editCustomer({ Customer: customer, IsSuccess: true, ErrorMessage: null });
    await editCustomerPage.open(customer._id);
    await editCustomerPage.waitForOpened();
  });
});
