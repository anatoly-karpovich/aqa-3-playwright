import { OrderBuilder, CustomersMockBuilder } from "data/builders";
import { VALIDATION_ERROR_MESSAGES } from "data/errorMessages.data";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";
import { ICommendUIData } from "types/order.types";
import { convertToDateAndTime } from "utils/date.utils";

test.describe("[UI] [Orders] [Order Details] [Comments Tab]", async () => {
  test(
    "Should see correct tab without comments",
    { tag: [TAGS.REGRESSION, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("comments");
      const actualValues = await orderDetailsPage.commentsTab.getComments();
      expect.soft(actualValues).toHaveLength(0);
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeVisible();
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeDisabled();
      await expect.soft(orderDetailsPage.commentsTab.textarea).toBeVisible();
      await expect.soft(orderDetailsPage.commentsTab.title).toHaveText("Comments");
    }
  );

  test(
    "Should see correct tab with 1 comment",
    { tag: [TAGS.REGRESSION, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().addComment().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("comments");
      const numberOfComments = await orderDetailsPage.commentsTab.getNumberOfComments();
      expect.soft(numberOfComments, "Check number of comments").toBe(1);

      const actualComment = await orderDetailsPage.commentsTab.getComment(0);
      const expectedCommnet: ICommendUIData = {
        commentator: "AQA User",
        commentText: order.comments[0].text,
        createdOn: convertToDateAndTime(order.comments[0].createdOn),
      };

      expect.soft(actualComment, "Check comment from order on ui").toMatchObject({ ...expectedCommnet });
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeVisible();
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeDisabled();
      await expect.soft(orderDetailsPage.commentsTab.textarea).toBeVisible();
    }
  );

  test(
    "Should see correct tab with 3 comments",
    { tag: [TAGS.REGRESSION, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder()
        .addComment({ text: "Comment 1" })
        .addComment({ text: "Comment 2" })
        .addComment({ text: "Comment 3" })
        .build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("comments");
      const numberOfComments = await orderDetailsPage.commentsTab.getNumberOfComments();
      expect.soft(numberOfComments, "Check number of comments").toBe(order.comments.length);

      const actualComments = await orderDetailsPage.commentsTab.getComments();
      const expectedComments: ICommendUIData[] = order.comments.map((comment) => {
        return {
          commentator: "AQA User",
          commentText: comment.text,
          createdOn: convertToDateAndTime(comment.createdOn),
        };
      });
      actualComments.forEach((actualComment, index) => {
        expect
          .soft(actualComment, `Check ${index} comment from order on ui`)
          .toMatchObject({ ...expectedComments.find((comment) => comment.commentText === actualComment.commentText) });
      });
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeVisible();
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeDisabled();
      await expect.soft(orderDetailsPage.commentsTab.textarea).toBeVisible();
    }
  );

  test(
    "Should not see validation error message for comment with 250 characters",
    { tag: [TAGS.REGRESSION, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("comments");
      await orderDetailsPage.commentsTab.type("a".repeat(250));
      await expect.soft(orderDetailsPage.commentsTab.errorMessage).not.toBeVisible();
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeEnabled();
      await expect.soft(orderDetailsPage.commentsTab.errorMessage).not.toBeVisible();
    }
  );

  test(
    "Should not see validation error message for comment with 1 character",
    { tag: [TAGS.REGRESSION, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("comments");
      await orderDetailsPage.commentsTab.type("a");
      await expect.soft(orderDetailsPage.commentsTab.errorMessage).not.toBeVisible();
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeEnabled();
      await expect.soft(orderDetailsPage.commentsTab.errorMessage).not.toBeVisible();
    }
  );

  test(
    "Should see validation error message for comment with 251 characters",
    { tag: [TAGS.REGRESSION, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("comments");
      await orderDetailsPage.commentsTab.type("a".repeat(251));
      await expect.soft(orderDetailsPage.commentsTab.errorMessage).toHaveText(VALIDATION_ERROR_MESSAGES.COMMENTS);
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeDisabled();
    }
  );

  test(
    "Should see validation error message for comment with 0 characters",
    { tag: [TAGS.REGRESSION, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("comments");
      await orderDetailsPage.commentsTab.type("a");
      await orderDetailsPage.commentsTab.type("");
      await expect.soft(orderDetailsPage.commentsTab.errorMessage).toHaveText(VALIDATION_ERROR_MESSAGES.COMMENTS);
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeDisabled();
    }
  );

  test(
    "Should see validation error message for comment with '<' character",
    { tag: [TAGS.REGRESSION, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("comments");
      await orderDetailsPage.commentsTab.type("<");
      await expect.soft(orderDetailsPage.commentsTab.errorMessage).toHaveText(VALIDATION_ERROR_MESSAGES.COMMENTS);
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeDisabled();
    }
  );

  test(
    "Should see validation error message for comment with '>' character",
    { tag: [TAGS.REGRESSION, TAGS.VISUAL] },
    async ({ homeUIService, mock, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      const order = new OrderBuilder().build();
      const customers = new CustomersMockBuilder().addDefaultCustomer().build();
      await mock.orderDetails(customers, { Order: order, ErrorMessage: null, IsSuccess: true });
      await orderDetailsPage.open(order._id);
      await orderDetailsPage.openTab("comments");
      await orderDetailsPage.commentsTab.type(">");
      await expect.soft(orderDetailsPage.commentsTab.errorMessage).toHaveText(VALIDATION_ERROR_MESSAGES.COMMENTS);
      await expect.soft(orderDetailsPage.commentsTab.createButton).toBeDisabled();
    }
  );
});
