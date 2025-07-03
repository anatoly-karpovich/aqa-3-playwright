import { expect } from "@playwright/test";
import { IDeliveryInfo } from "types/order.types";
import { SalesPortalPage } from "ui/pages/salesPortal.page";

export abstract class DeliveryPage extends SalesPortalPage {
  readonly conditionInput = this.page.locator("#inputType");
  readonly dateInput = this.page.locator("#date-input");
  readonly datePicker = this.page.locator(".datepicker");
  readonly locationInput = this.page.locator("#inputLocation");
  readonly countryInput = this.page.locator("#inputCountry");
  readonly cityInput = this.page.locator("#inputCity");
  readonly streetInput = this.page.locator("#inputStreet");
  readonly houseInput = this.page.locator("#inputHouse");
  readonly flatInput = this.page.locator("#inputFlat");
  readonly saveButton = this.page.locator("#save-delivery");
  readonly cancelButton = this.page.locator("#back-to-order-details-page");

  async openDatePicker() {
    await this.dateInput.click();
  }

  async setDate(availableDayIndex = 0) {
    await this.page.locator(".datepicker-days tbody td:not(.disabled)").nth(availableDayIndex).click();
    await expect(this.datePicker).toBeHidden();
  }

  async fill(delivery?: Partial<IDeliveryInfo>) {
    await this.openDatePicker();
    await this.setDate();
    if (!delivery) return;

    const { condition } = delivery;
    if (condition) await this.conditionInput.selectOption(condition);
  }

  async clickSave() {
    await this.saveButton.click();
  }
}
