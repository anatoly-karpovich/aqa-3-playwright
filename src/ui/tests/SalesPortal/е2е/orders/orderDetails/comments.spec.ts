import { TAGS } from "data/tags";
import { expect, test } from "fixtures";
import { ORDER_STATUSES } from "types/order.types";
import { convertToDateAndTime } from "utils/date.utils";
import { getRandomEnumValue } from "utils/enum.utils";

test.describe("[UI] [Orders] [Order Details] [Comments]", () => {
  test(
    "Should add comment from order",
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ homeUIService, orderDetailsPage, orderDetailsUIService, dataManager }) => {
      const order = await dataManager.createOrder(getRandomEnumValue(ORDER_STATUSES));
      await homeUIService.openAsLoggedInUser();
      await orderDetailsUIService.open(order);
      await orderDetailsPage.openTab("comments");
      const expectedComment = await orderDetailsPage.commentsTab.submit("Test comment", order._id);
      const actualComment = await orderDetailsPage.commentsTab.getComment();
      expect.soft(actualComment, "Check comment from order on ui").toMatchObject({
        commentator: "AQA User",
        commentText: expectedComment!.text,
        createdOn: convertToDateAndTime(expectedComment!.createdOn),
      });
    }
  );

  test(
    "Should delete comment from order",
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ homeUIService, orderDetailsPage, orderDetailsUIService, dataManager }) => {
      const order = await dataManager.createOrder(getRandomEnumValue(ORDER_STATUSES), { numberOfComments: 1 });
      await homeUIService.openAsLoggedInUser();
      await orderDetailsUIService.open(order);
      await orderDetailsPage.openTab("comments");
      await orderDetailsPage.commentsTab.delete();
      expect
        .soft(orderDetailsPage.commentsTab.commentSectionBy(order.comments[0].text), "Should not see deleted comments")
        .not.toBeVisible();
    }
  );
});
