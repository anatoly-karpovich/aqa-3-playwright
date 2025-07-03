import { logStep } from "utils/reporter.utils";
import { DeliveryPage } from "./delivery.page";

export class EditDeliveryPage extends DeliveryPage {
  readonly uniqueElement = this.page.locator("#edit-delivery");

  @logStep("Open Edit Delivery page via URL")
  async open(id: string) {
    await this.openPage("ORDER_EDIT_DELIVERY", id);
    await this.waitForOpened();
  }
}
