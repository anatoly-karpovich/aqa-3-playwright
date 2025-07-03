import { apiConfig } from "config/api-config";
import { Modal } from "../modal.page";
import { IOrderResponse } from "types/order.types";
import { logStep } from "utils/reporter.utils";

export class CreateOrderModal extends Modal {
  readonly uniqueElement = this.page.locator(`#add-order-modal`);
  readonly title = this.uniqueElement.locator("h5.modal-title");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  readonly customerDropdown = this.uniqueElement.locator("#inputCustomerOrder");
  readonly productDropdown = this.uniqueElement.locator(`select[name="Product"]`);
  readonly removeProductDropdownButton = this.uniqueElement.locator(".del-btn-modal");
  readonly addProductButton = this.uniqueElement.locator("#add-product-btn");
  readonly createButton = this.uniqueElement.locator("#create-order-btn");
  readonly cancelButton = this.uniqueElement.locator("#cancel-order-modal-btn");
  readonly totalPrice = this.uniqueElement.locator("#total-price-order-modal");

  @logStep("Select customer in dropdown on Create Order Modal")
  async selectCustomer(customerName: string) {
    await this.customerDropdown.selectOption(customerName);
  }

  async getCustomersInDropdown() {
    return this.customerDropdown.locator("option").allInnerTexts();
  }

  async getProductsInDropdown(dropdownIndex = 0) {
    return this.productDropdown.nth(dropdownIndex).locator("option").allInnerTexts();
  }

  @logStep("Select product in dropdown on Create Order Modal")
  async selectProduct(productName: string, dropdownIndex = 0) {
    await this.productDropdown.nth(dropdownIndex).selectOption(productName);
  }

  @logStep("Select products in all dropdowns on Create Order Modal")
  async selectProducts(...productsNames: string[]) {
    const maxProducts = productsNames.length > 5 ? 5 : productsNames.length;
    for (let i = 0; i < maxProducts; i++) {
      if (i > 0) await this.addProductButton.click();
      await this.selectProduct(productsNames[i], i);
    }
  }

  @logStep("Click Create button on Create Order Modal")
  async clickCreate() {
    await this.createButton.click();
  }

  @logStep("Submit order on Create Order Modal")
  async submit() {
    const response = await this.interceptResponse<IOrderResponse, any>(
      apiConfig.ENDPOINTS.ORDERS,
      this.clickCreate.bind(this)
    );
    await this.waitForClosed();
    return response;
  }
}
