import { Modal } from "../modal.page";

export class EditCustomerModal extends Modal {
  readonly uniqueElement = this.page.locator(`#edit-customer-modal`);

  readonly title = this.uniqueElement.locator("h5.modal-title");
  readonly dropdownLabel = this.uniqueElement.locator(`label[for="inputCustomerOrder"]`);
  readonly customersDropdown = this.uniqueElement.locator("#inputCustomerOrder");
  readonly updateButton = this.uniqueElement.locator(`#update-customer-btn`);
  readonly cancelButton = this.uniqueElement.locator(`#cancel-edit-customer-modal-btn`);
  readonly closeButton = this.uniqueElement.locator("button.btn-close");

  async selectCustomer(customerName: string) {
    await this.customersDropdown.selectOption(customerName);
  }

  async getDropdownValues() {
    return await this.customersDropdown.locator("option").allInnerTexts();
  }

  async save() {
    await this.updateButton.click();
    await this.waitForClosed();
  }

  async close() {
    await this.closeButton.click();
    await this.waitForClosed();
  }

  async cancel() {
    await this.cancelButton.click();
    await this.waitForClosed();
  }
}
