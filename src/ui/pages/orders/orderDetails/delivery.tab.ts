import { SalesPortalPage } from "ui/pages/salesPortal.page";

export class DeliveryTab extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#delivery");
  title = this.uniqueElement.locator("h4");
  value = this.uniqueElement.locator("span:not(.strong-details)");
  scheduleButton = this.uniqueElement.locator("#delivery-btn");
  editButton = this.scheduleButton;

  async getInfo() {
    const [type, date, country, city, street, house, flat] = await this.value.allInnerTexts();
    return {
      type,
      date,
      country,
      city,
      street,
      house: house,
      flat: flat,
    };
  }
}
