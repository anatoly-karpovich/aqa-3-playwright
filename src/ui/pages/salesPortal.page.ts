import { HeaderNavigationButton } from "types/header.types";
import { NotificationsModal } from "./modals/notifications.modal";
import { ProjectPage } from "./project.page";

export abstract class SalesPortalPage extends ProjectPage {
  readonly notificationsModal = new NotificationsModal(this.page);
  readonly headerMenu = this.page.locator("header");
  readonly navigationMenuButton = (name: HeaderNavigationButton) => this.headerMenu.locator(`[name="${name}"]`);
  readonly themeToggle = this.headerMenu.locator("#theme-toggle");
  readonly logoutButton = this.headerMenu.locator("#signOut");
  readonly notificationBell = this.headerMenu.locator("#notification-bell");

  async clickNavigationMenuItem(itemName: HeaderNavigationButton) {
    await this.navigationMenuButton(itemName).click();
  }
}
