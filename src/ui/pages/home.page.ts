import { Locator, Page } from "@playwright/test";
import { ModuleName } from "types/home.types";
import { SalesPortalPage } from "./salesPortal.page";
import { logStep } from "utils/reporter.utils";

export class HomePage extends SalesPortalPage {
  title = this.page.locator(".welcome-text");
  customersButton = this.page.locator("#customers-from-home");
  productsButton = this.page.locator("#products-from-home");
  ordersButton = this.page.locator("#orders-from-home");

  //metrics
  readonly ordersThisYearValue = this.page.locator("#total-orders-container p");
  readonly totalRevenueValue = this.page.locator("#total-revenue-container p");
  readonly newCustomersValue = this.page.locator("#total-customers-container p");
  readonly avgOrderValue = this.page.locator("#avg-orders-value-container p");
  readonly canceledOrdersValue = this.page.locator("#canceled-orders-container p");
  uniqueElement = this.title;

  @logStep("Open Home page via URL")
  async open() {
    await this.openPage("HOME");
    await this.waitForOpened();
  }

  @logStep("Click on Module button")
  async clickModuleButton(moduleName: ModuleName) {
    const moduleButtons: Record<ModuleName, Locator> = {
      Customers: this.customersButton,
      Products: this.productsButton,
      Orders: this.ordersButton,
    };

    await moduleButtons[moduleName].click();
  }

  private metrics: Record<Metric, Locator> = {
    "Orders This Year": this.ordersThisYearValue,
    "Total Revenue": this.totalRevenueValue,
    "New Customers": this.newCustomersValue,
    "Average Order": this.avgOrderValue,
    "Canceled Orders": this.canceledOrdersValue,
  };

  async getMetricValue(metricName: Metric) {
    return await this.metrics[metricName].innerText();
  }

  async getAllMetrics(): Promise<Record<Metric, string>> {
    const [ordersThisYearValue, totalRevenueValue, newCustomersValue, avgOrderValue, canceledOrdersValue] =
      await Promise.all(Object.values(this.metrics).map((el) => el.innerText()));
    return {
      "Orders This Year": ordersThisYearValue,
      "Total Revenue": totalRevenueValue,
      "New Customers": newCustomersValue,
      "Average Order": avgOrderValue,
      "Canceled Orders": canceledOrdersValue,
    };
  }
}

type Metric = "Orders This Year" | "Total Revenue" | "New Customers" | "Average Order" | "Canceled Orders";
