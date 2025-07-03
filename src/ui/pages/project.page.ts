import { Locator } from "@playwright/test";
import { SALES_PORTAL_URL } from "config/evnironment";
import { expect } from "fixtures";
import { BasePage } from "./base.page";
import { ROUTES } from "data/routes";
import { logStep } from "utils/reporter.utils";

export abstract class ProjectPage extends BasePage {
  abstract uniqueElement: Locator;

  readonly spinner = this.page.locator(".spinner-border");
  readonly toast = this.page.locator(".toast-body");

  @logStep("Wait for page to be loaded")
  async waitForOpened() {
    await expect(this.uniqueElement, "Verify unique element on page").toBeVisible();
    await this.waitForSpinner();
  }

  async waitForSpinner() {
    await expect(this.spinner, "Wait for spinners to disappear").toHaveCount(0, { timeout: 30000 });
  }

  async waitForToast(text: string) {
    await expect(this.toast.last()).toContainText(text);
  }

  async openPortal() {
    this.page.goto(SALES_PORTAL_URL);
  }

  async reload() {
    await this.page.reload();
    await this.waitForOpened();
  }

  async openPage(page: keyof typeof ROUTES, id?: string) {
    const route = ROUTES[page];
    if (typeof route === "string") {
      await this.page.goto(route);
    } else {
      if (!id) throw new Error("Id was not provided");
      await this.page.goto(route(id));
    }
  }
}
