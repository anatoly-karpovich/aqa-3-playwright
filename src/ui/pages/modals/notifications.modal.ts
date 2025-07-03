import { expect } from "fixtures";
import { ProjectPage } from "../project.page";

export class NotificationsModal extends ProjectPage {
  readonly uniqueElement = this.page.locator("#notification-popover");
  readonly readAllButton = this.uniqueElement.locator("#mark-all-read");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");

  readonly notificationsListContainer = this.uniqueElement.locator("#notification-list");
  readonly notifications = this.notificationsListContainer.locator("li");

  readonly notificationByIndex = (index: number = 0) => this.notifications.nth(index);
  readonly notificationByText = (text: string) =>
    this.notifications.filter({ has: this.uniqueElement.locator("span", { hasText: text }) });
  readonly notificationByDate = (date: string) =>
    this.notifications.filter({ has: this.uniqueElement.locator("small", { hasText: date }) });
  notificationBy(by: "text" | "date" | "index", value: string | number) {
    if (by === "text" && typeof value === "string") return this.notificationByText(value);
    else if (by === "date" && typeof value === "string") return this.notificationByDate(value);
    else return this.notificationByIndex(value as number);
  }
  readonly orderDetailsButtonBy = (by: "text" | "date" | "index", value: string | number) => {
    if (by === "text" && typeof value === "string") return this.notificationByText(value);
    else if (by === "date" && typeof value === "string") return this.notificationByDate(value);
    else return this.notificationByIndex(value as number);
  };

  async getNotifications(read?: boolean) {
    let notifications = this.notifications;
    if (typeof read === "boolean")
      notifications = notifications.filter({ has: this.uniqueElement.locator(`div[data-read="${read}"]`) });

    const result = [];
    for (const notification of await notifications.all()) {
      const text = await notification.getByTestId("notification-text").innerText();
      const date = await notification.getByTestId("notification-date").innerText();
      const orderId = (await notification.getByTestId("order-details-link").getAttribute("onclick"))!.split("'")[1];
      result.push({ text, date, orderId });
    }
    return result;
  }

  async getNotification(by: "text" | "date" | "index" = "index", value: string | number = 0) {
    const notification = this.notificationBy(by, value);
    const [text, date, orderId] = await Promise.all([
      notification.getByTestId("notification-text").innerText(),
      notification.getByTestId("notification-date").innerText(),
      notification.getByTestId("order-details-link").getAttribute("onclick"),
    ]);
    return { text, date, orderId: orderId!.split("'")[1] };
  }

  async clickReadAll() {
    await this.readAllButton.click();
  }

  async close() {
    await this.closeButton.click();
    await this.waitForClosed();
  }

  async clickNotificationBy(by: "text" | "date" | "index", value: string | number) {
    await this.orderDetailsButtonBy(by, value).click();
  }

  async clickOrderDetailsButtonBy(by: "text" | "date" | "index", value: string | number) {
    await this.orderDetailsButtonBy(by, value).click();
  }

  async waitForClosed() {
    await expect(this.uniqueElement).not.toBeVisible();
  }
}
