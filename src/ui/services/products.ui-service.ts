import { ProductsPage } from "ui/pages/products/products.page";
import { SalesPortalUIService } from "./salesPortal.ui-service";
import { SALES_PORTAL_URL } from "config/evnironment";
import { AddNewProductPage } from "ui/pages/products/addNewProduct.page";
import { EditProductPage } from "ui/pages/products/editProduct.page";

export class ProductsUIService extends SalesPortalUIService {
  private productsPage = new ProductsPage(this.page);
  private addNewProductPage = new AddNewProductPage(this.page);
  private editProductPage = new EditProductPage(this.page);

  async openListPageViaUrl() {
    await this.page.goto(SALES_PORTAL_URL + "/products");
    await this.productsPage.waitForOpened();
  }

  async openAddPageViaUrl() {
    await this.page.goto(SALES_PORTAL_URL + "/products/add");
    await this.addNewProductPage.waitForOpened();
  }

  async openEditPageViaUrl(id: string) {
    await this.page.goto(SALES_PORTAL_URL + `/products/${id}/edit`);
    await this.editProductPage.waitForOpened();
  }
}
