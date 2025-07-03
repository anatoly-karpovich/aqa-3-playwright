import { IOrder, ORDER_STATUSES } from "types/order.types";
import { logStep } from "utils/reporter.utils";
import { expect } from "@playwright/test";
import { SalesPortalUIService } from "./salesPortal.ui-service";

export class OrderDetailsUIService extends SalesPortalUIService {
  private order: IOrder | null = null;

  @logStep("Open order details page")
  async open(order: IOrder) {
    await this.orderDetailsPage.open(order._id);
    this.order = order;
  }

  @logStep("Process order on Order Details page")
  async process() {
    if (this.order!.status !== ORDER_STATUSES.DRAFT) throw new Error(`Order is not in "draft" status`);
    await this.orderDetailsPage.clickProcess();
    await this.orderDetailsPage.processModal.submit();
    await this.orderDetailsPage.waitForOpened();
  }

  @logStep("Cancel order on Order Details page")
  async cancel() {
    if (this.order!.status !== ORDER_STATUSES.DRAFT && this.order!.status !== ORDER_STATUSES.IN_PROCESS)
      throw new Error(`Order is not in "draft" or "in process" status`);
    await this.orderDetailsPage.clickCancel();
    await this.orderDetailsPage.cancelModal.submit();
    await this.orderDetailsPage.waitForOpened();
  }

  @logStep("Refresh order details page")
  async refresh() {
    await this.orderDetailsPage.refreshOrderButton.click();
    await this.orderDetailsPage.waitForOpened();
  }

  @logStep("Reopen order on Order Details page")
  async reopen() {
    await this.checkOrderStatus(ORDER_STATUSES.CANCELED);
    await this.orderDetailsPage.reopenOrderButton.click();
    await this.orderDetailsPage.reopenModal.submit();
    await this.orderDetailsPage.waitForOpened();
  }

  @logStep("Change Customer on Order Details page")
  async changeCustomer(customerName: string) {
    await this.checkOrderStatus(ORDER_STATUSES.DRAFT);
    await this.orderDetailsPage.customerDetails.clickEdit();
    await this.orderDetailsPage.editCustomerModal.waitForOpened();
    await this.orderDetailsPage.editCustomerModal.selectCustomer(customerName);
    await this.orderDetailsPage.editCustomerModal.save();
    await this.orderDetailsPage.waitForOpened();
  }

  @logStep("Check order status")
  async checkOrderStatus(status: ORDER_STATUSES) {
    await expect.soft(this.orderDetailsPage.status).toHaveText(status);
  }
}
