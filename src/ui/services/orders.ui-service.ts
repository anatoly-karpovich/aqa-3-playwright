import { SALES_PORTAL_URL } from "config/evnironment";
import { OrdersPage } from "ui/pages/orders/orders.page";
import { SalesPortalUIService } from "./salesPortal.ui-service";

export class OrdersUIService extends SalesPortalUIService {
  private ordersPage = new OrdersPage(this.page);
  async openListPageViaUrl() {
    await this.page.goto(SALES_PORTAL_URL + "/orders");
    await this.ordersPage.waitForOpened();
  }
}
