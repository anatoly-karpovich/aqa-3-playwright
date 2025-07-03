import { CustomersMockBuilder, OrderBuilder } from "data/builders";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";

test.describe("[UI] [Orders] [Order Details] [Edit Customer]", { tag: [TAGS.ORDERS, TAGS.VISUAL] }, () => {
  test(
    "Should see correct Edit Customer modal",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ orderDetailsPage, mock }) => {
      const customers = new CustomersMockBuilder().addDefaultCustomer(false).addRandomCustomer().build();
      const order = new OrderBuilder({ customer: customers.Customers[0] }).build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });

      await orderDetailsPage.open(order._id);
      await orderDetailsPage.customerDetails.clickEdit();
      const actualCustomers = await orderDetailsPage.editCustomerModal.getDropdownValues();
      const expectedCustomers = customers.Customers.map((customer) => customer.name);
      expect
        .soft(actualCustomers.sort((a, b) => a.localeCompare(b)))
        .toEqual(expectedCustomers.sort((a, b) => a.localeCompare(b)));
      await expect.soft(orderDetailsPage.editCustomerModal.title).toHaveText("Edit Customer");
      await expect.soft(orderDetailsPage.editCustomerModal.cancelButton).toBeVisible();
      await expect.soft(orderDetailsPage.editCustomerModal.cancelButton).toBeEnabled();
      await expect.soft(orderDetailsPage.editCustomerModal.cancelButton).toHaveText("Cancel");
      await expect.soft(orderDetailsPage.editCustomerModal.updateButton).toBeVisible();
      await expect.soft(orderDetailsPage.editCustomerModal.updateButton).toBeDisabled();
      await expect.soft(orderDetailsPage.editCustomerModal.updateButton).toHaveText("Save");
      await expect.soft(orderDetailsPage.editCustomerModal.closeButton).toBeVisible();
      await expect.soft(orderDetailsPage.editCustomerModal.closeButton).toBeEnabled();
    }
  );

  test(
    "Should see correct Edit Customer modal after selecting another customer",
    { tag: [TAGS.ORDERS, TAGS.VISUAL] },
    async ({ orderDetailsPage, mock }) => {
      const customers = new CustomersMockBuilder().addDefaultCustomer(false).addRandomCustomer().build();
      const order = new OrderBuilder({ customer: customers.Customers[0] }).build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });

      await orderDetailsPage.open(order._id);
      await orderDetailsPage.customerDetails.clickEdit();
      await orderDetailsPage.editCustomerModal.selectCustomer(customers.Customers[1].name);
      await expect.soft(orderDetailsPage.editCustomerModal.cancelButton).toBeVisible();
      await expect.soft(orderDetailsPage.editCustomerModal.cancelButton).toBeEnabled();
      await expect.soft(orderDetailsPage.editCustomerModal.cancelButton).toHaveText("Cancel");
      await expect.soft(orderDetailsPage.editCustomerModal.updateButton).toBeVisible();
      await expect.soft(orderDetailsPage.editCustomerModal.updateButton).toBeEnabled();
      await expect.soft(orderDetailsPage.editCustomerModal.updateButton).toHaveText("Save");
      await expect.soft(orderDetailsPage.editCustomerModal.closeButton).toBeVisible();
      await expect.soft(orderDetailsPage.editCustomerModal.closeButton).toBeEnabled();
    }
  );
});
