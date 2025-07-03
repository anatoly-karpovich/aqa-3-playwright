import { SalesPortalPage } from "ui/pages/salesPortal.page";
import { ConfirmationModal } from "ui/pages/modals/confirmation.modal";
import { DeliveryTab } from "ui/pages/orders/orderDetails/delivery.tab";
import { CommentsTab } from "ui/pages/orders/orderDetails/comments.tab";
import { HistoryTab } from "ui/pages/orders/orderDetails/history.tab";
import { logStep } from "utils/reporter.utils";
import { EditCustomerModal } from "ui/pages/modals/orders/editCustomer.modal";
import { CustomerDetailsComponent } from "./customerDetails.component";

export class OrderDetailsPage extends SalesPortalPage {
  url = (id: string) => `/orders/${id}`;

  //modals
  private confirmationModal = new ConfirmationModal(this.page);
  processModal = this.confirmationModal;
  cancelModal = this.confirmationModal;
  reopenModal = this.confirmationModal;
  editCustomerModal = new EditCustomerModal(this.page);

  customerDetails = new CustomerDetailsComponent(this.page);

  //tabs
  deliveryTab = new DeliveryTab(this.page);
  commentsTab = new CommentsTab(this.page);
  historyTab = new HistoryTab(this.page);

  uniqueElement = this.page.locator("#order-details-body");

  readonly title = this.page.locator("h2");
  readonly orderInfoContainer = this.page.locator("#order-info-container");
  readonly orderNumber = this.orderInfoContainer.locator("span.fst-italic").first();
  readonly assignedManagerName = this.orderInfoContainer.locator("#assigned-manager-link");
  readonly editAssignedManagerButton = this.orderInfoContainer.getByTitle("Edit Assigned Manager");
  readonly removeAssignedManagerButton = this.orderInfoContainer.getByTitle("Remove Assigned Manager");
  readonly noAssignedManagerText = this.orderInfoContainer.locator("u");
  readonly refreshOrderButton = this.page.locator("#refresh-order");
  readonly cancerOrderButton = this.page.locator("#cancel-order");
  readonly reopenOrderButton = this.page.locator("#reopen-order");
  readonly processOrderButton = this.page.locator("#process-order");

  readonly orderValuesContainer = this.orderInfoContainer.locator("div.h-m-width");
  readonly orderValues = this.orderValuesContainer.locator("span:not(.fw-bold)");
  readonly status = this.orderValues.nth(0);
  readonly totalPrice = this.orderValues.nth(1);
  readonly deliveryDate = this.orderValues.nth(2);
  readonly createdOn = this.orderValues.nth(3);

  //tabs
  readonly deliveryTabButton = this.page.locator("#delivery-tab");
  readonly commentsTabButton = this.page.locator("#comments-tab");
  readonly historyTabButton = this.page.locator("#history-tab");

  @logStep("Open Order Details page via URL")
  async open(id: string) {
    await this.openPage("ORDER_DETAILS", id);
    await this.waitForOpened();
  }

  async getOrderValues() {
    const [orderNumber, status, totalPrice, deliveryDate, createdOn] = await Promise.all([
      this.orderNumber.innerText(),
      this.status.innerText(),
      this.totalPrice.innerText(),
      this.deliveryDate.innerText(),
      this.createdOn.innerText(),
    ]);
    let assignedManagerName = "";
    if (await this.assignedManagerName.isVisible()) assignedManagerName = await this.assignedManagerName.innerText();
    else assignedManagerName = await this.noAssignedManagerText.innerText();

    return { orderNumber, assignedManagerName, status, totalPrice, deliveryDate, createdOn };
  }

  async clickProcess() {
    await this.processOrderButton.click();
    await this.processModal.waitForOpened();
  }

  async processOrder() {
    await this.processOrderButton.click();
    await this.processModal.waitForOpened();
    await this.processModal.submit();
    await this.waitForOpened();
  }

  async clickCancel() {
    await this.cancerOrderButton.click();
    await this.cancelModal.waitForOpened();
  }

  async clickReopen() {
    await this.reopenOrderButton.click();
    await this.reopenModal.waitForOpened();
  }

  async openTab(tab: "delivery" | "comments" | "history") {
    switch (tab) {
      case "delivery":
        await this.deliveryTabButton.click();
        await this.deliveryTab.waitForOpened();
        break;
      case "comments":
        await this.commentsTabButton.click();
        await this.commentsTab.waitForOpened();
        break;
      case "history":
        await this.historyTabButton.click();
        await this.historyTab.waitForOpened();
        break;
    }
  }
}
