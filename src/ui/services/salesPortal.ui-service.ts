import { OrderDetailsPage } from "ui/pages/orders/orderDetails/orderDetails.page";
import { BaseUIService } from "./base.ui-service";
import { expect } from "@playwright/test";

export abstract class SalesPortalUIService extends BaseUIService {
  protected orderDetailsPage = new OrderDetailsPage(this.page);

  async openNotificationsModal() {
    await this.anyPage.notificationBell.click();
    await this.anyPage.notificationsModal.waitForOpened();
  }

  async openOrderDetailsFromNotification(by: "text" | "date" | "index", value: string | number) {
    await this.anyPage.notificationsModal.clickOrderDetailsButtonBy(by, value);
    await this.orderDetailsPage.waitForOpened();
  }

  async readAllNotifications() {
    await this.anyPage.notificationsModal.clickReadAll();
    await this.anyPage.notificationsModal.waitForSpinner();
    expect(await this.anyPage.notificationsModal.getNotifications(true)).toHaveLength(0);
  }
}
