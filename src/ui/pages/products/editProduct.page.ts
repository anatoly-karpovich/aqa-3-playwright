import { logStep } from "utils/reporter.utils";
import { SalesPortalPage } from "../salesPortal.page";

export class EditProductPage extends SalesPortalPage {
  uniqueElement = this.page.locator("#edit-product-container");

  @logStep("Open Edit product page via URL")
  async open(id: string) {
    await this.openPage("PRODUCT_EDIT", id);
    await this.waitForOpened();
  }
}
