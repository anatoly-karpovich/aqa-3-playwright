import { expect, Page } from "@playwright/test";
import { HomePage } from "ui/pages/home.page";
import { logStep } from "utils/reporter.utils";

export abstract class BaseUIService {
  protected anyPage: HomePage;
  constructor(protected page: Page) {
    this.anyPage = new HomePage(page);
  }

  @logStep("Check notification")
  async checkNotification(toastMessage: string) {
    await expect(this.anyPage.toast).toHaveText(toastMessage);
  }
}
