import { apiConfig } from "config/api-config";
import { ICommendUIData, IOrder, IOrderResponse } from "types/order.types";
import { SalesPortalPage } from "ui/pages/salesPortal.page";

export class CommentsTab extends SalesPortalPage {
  readonly uniqueElement = this.page.locator(`#comments-tab-container`);
  readonly title = this.uniqueElement.locator("h4");
  readonly textarea = this.uniqueElement.locator("#textareaComments");
  readonly errorMessage = this.uniqueElement.locator("#error-textareaComments");
  readonly createButton = this.uniqueElement.locator("#create-comment-btn");
  readonly commentSection = this.uniqueElement.locator(".shadow-sm");
  readonly commentSectionBy = (textOrIndex: string | number) => {
    return typeof textOrIndex === "string"
      ? this.uniqueElement.locator(".shadow-sm", { has: this.uniqueElement.locator("p", { hasText: textOrIndex }) })
      : this.uniqueElement.locator(".shadow-sm").nth(textOrIndex);
  };

  readonly commentText = (textOrIndex: string | number) => this.commentSectionBy(textOrIndex).locator("p");
  readonly commentator = (textOrIndex: string | number) =>
    this.commentSectionBy(textOrIndex).locator("span.text-primary");
  readonly commentDate = (textOrIndex: string | number) =>
    this.commentSectionBy(textOrIndex).locator("span:not(.text-primary)");
  readonly commentDeleteButton = (textOrIndex: string | number) => this.commentSectionBy(textOrIndex).locator("button");

  async submit(text: string, orderId: string) {
    await this.type(text);
    const response = await this.interceptResponse<IOrderResponse, any>(
      apiConfig.ENDPOINTS.ORDER_COMMENTS(orderId),
      this.clickSubmit.bind(this)
    );
    await this.waitForOpened();
    return response.body.Order.comments.at(-1);
  }

  async delete(textOrIndex?: string | number) {
    textOrIndex = textOrIndex ? textOrIndex : (await this.getNumberOfComments()) - 1;
    await this.deleteComment(textOrIndex);
    await this.waitForOpened();
  }

  async clickSubmit() {
    await this.createButton.click();
  }

  async type(text: string) {
    await this.textarea.fill(text);
  }

  async getComment(textOrIndex?: string | number): Promise<ICommendUIData> {
    textOrIndex = textOrIndex ? textOrIndex : (await this.getNumberOfComments()) - 1;
    const [commentText, commentator, createdOn] = await Promise.all([
      this.commentText(textOrIndex).innerText(),
      this.commentator(textOrIndex).innerText(),
      this.commentDate(textOrIndex).innerText(),
    ]);

    return { commentText, commentator, createdOn };
  }

  async getComments() {
    const commentsSectins = await this.commentSection.all();
    const comments = await Promise.all(commentsSectins.map((_, index) => this.getComment(index)));
    return comments;
  }

  async getNumberOfComments() {
    return (await this.commentSection.all()).length;
  }

  async deleteComment(textOrIndex: string | number) {
    await this.commentDeleteButton(textOrIndex).click();
    await this.waitForOpened();
  }
}
