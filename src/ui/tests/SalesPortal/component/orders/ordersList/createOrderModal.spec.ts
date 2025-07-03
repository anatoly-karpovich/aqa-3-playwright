import { CustomersMockBuilder, OrderBuilder, ProductsMockBuilder } from "data/builders";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [Create]", () => {
  test(
    "Should check order modal component with 1 product dropdown",
    { tag: [TAGS.ORDERS, TAGS.REGRESSION, TAGS.COMPONENT] },
    async ({ ordersPage, mock }) => {
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      const products = new ProductsMockBuilder().addDefaultProduct().build();
      await mock.orders({
        getResponse: {
          Orders: [],
          ErrorMessage: null,
          IsSuccess: true,
          limit: 10,
          page: 1,
          search: "",
          status: [],
          total: 1,
          sorting: {
            sortField: "createdOn",
            sortOrder: "desc",
          },
        },
      });
      await mock.createOrderModal({ customers, products });
      await ordersPage.open();
      await ordersPage.clickCreateButton();
      const { createOrderModal } = ordersPage;
      await createOrderModal.waitForOpened();
      await expect.soft(createOrderModal.title).toContainText("Create Order");
      await expect.soft(createOrderModal.closeButton).toBeVisible();
      await expect.soft(createOrderModal.closeButton).toBeEnabled();
      await expect.soft(createOrderModal.cancelButton).toBeVisible();
      await expect.soft(createOrderModal.cancelButton).toBeEnabled();
      await expect.soft(createOrderModal.createButton).toBeVisible();
      await expect.soft(createOrderModal.createButton).toBeEnabled();
      await expect.soft(createOrderModal.addProductButton).toBeVisible();
      await expect.soft(createOrderModal.addProductButton).toBeEnabled();
      await expect.soft(createOrderModal.totalPrice).toHaveText(`$${products.Products[0].price}`);
      await expect.soft(createOrderModal.productDropdown).toHaveCount(1);
      await expect.soft(createOrderModal.removeProductDropdownButton).toHaveCount(1);

      const customersOptions = await createOrderModal.getCustomersInDropdown();
      expect(customersOptions).toEqual(customers.Customers.map((c) => c.name));

      const productsOptions = await createOrderModal.getProductsInDropdown();
      expect(productsOptions).toEqual(products.Products.map((p) => p.name));
    }
  );

  test(
    "Should check order modal component with 5 product dropdowns",
    { tag: [TAGS.ORDERS, TAGS.REGRESSION, TAGS.COMPONENT] },
    async ({ ordersPage, mock }) => {
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      const products = new ProductsMockBuilder().addDefaultProduct().build();
      await mock.orders({
        getResponse: {
          Orders: [],
          ErrorMessage: null,
          IsSuccess: true,
          limit: 10,
          page: 1,
          search: "",
          status: [],
          total: 1,
          sorting: {
            sortField: "createdOn",
            sortOrder: "desc",
          },
        },
      });
      await mock.createOrderModal({ customers, products });
      await ordersPage.open();
      await ordersPage.clickCreateButton();
      const { createOrderModal } = ordersPage;
      await createOrderModal.waitForOpened();
      await createOrderModal.addProductButton.click();
      await createOrderModal.addProductButton.click();
      await createOrderModal.addProductButton.click();
      await createOrderModal.addProductButton.click();
      await expect.soft(createOrderModal.title).toContainText("Create Order");
      await expect.soft(createOrderModal.closeButton).toBeVisible();
      await expect.soft(createOrderModal.closeButton).toBeEnabled();
      await expect.soft(createOrderModal.cancelButton).toBeVisible();
      await expect.soft(createOrderModal.cancelButton).toBeEnabled();
      await expect.soft(createOrderModal.createButton).toBeVisible();
      await expect.soft(createOrderModal.createButton).toBeEnabled();
      await expect.soft(createOrderModal.addProductButton).not.toBeVisible();
      await expect.soft(createOrderModal.totalPrice).toHaveText(`$${products.Products[0].price * 5}`);
      await expect.soft(createOrderModal.productDropdown).toHaveCount(5);
      await expect.soft(createOrderModal.removeProductDropdownButton).toHaveCount(5);

      const customersOptions = await createOrderModal.getCustomersInDropdown();
      expect(customersOptions).toEqual(customers.Customers.map((c) => c.name));

      const productsOptionsArray = await Promise.all([
        createOrderModal.getProductsInDropdown(),
        createOrderModal.getProductsInDropdown(1),
        createOrderModal.getProductsInDropdown(2),
        createOrderModal.getProductsInDropdown(3),
        createOrderModal.getProductsInDropdown(4),
      ]);
      for (const productsOptions of productsOptionsArray) {
        expect(productsOptions).toEqual(products.Products.map((p) => p.name));
      }
    }
  );
});
