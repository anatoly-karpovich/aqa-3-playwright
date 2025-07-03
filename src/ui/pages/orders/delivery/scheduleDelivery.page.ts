import { logStep } from "utils/reporter.utils";
import { DeliveryPage } from "./delivery.page";

export class ScheduleDeliveryPage extends DeliveryPage {
  readonly uniqueElement = this.page.locator("#schedule-delivery");

  @logStep("Open Schedule Delivery page via URL")
  async open(id: string) {
    await this.openPage("ORDER_SCHEDULE_DELIVERY", id);
    await this.waitForOpened();
  }
}
