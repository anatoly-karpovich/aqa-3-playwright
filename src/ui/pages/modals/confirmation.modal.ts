import { expect } from "@playwright/test";
import { Modal } from "./modal.page";

export class ConfirmationModal extends Modal {
  uniqueElement = this.page.locator(`.modal-dialog`);
  title = this.uniqueElement.locator("h5");
  description = this.uniqueElement.locator("p");
  confirmButton = this.uniqueElement.locator(`button[type="submit"]`);
  cancelButton = this.uniqueElement.locator("button.btn-secondary");
  closeButton = this.uniqueElement.locator("button.btn-close");

  async close() {
    await this.closeButton.click();
    await expect(this.uniqueElement).not.toBeVisible();
  }

  async submit() {
    await this.confirmButton.click();
    await expect(this.uniqueElement).not.toBeVisible();
  }

  async cancel() {
    await this.cancelButton.click();
    await expect(this.uniqueElement).not.toBeVisible();
  }
}
