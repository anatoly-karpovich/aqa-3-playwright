import { MetricsMockBuilder } from "data/builders";
import { test } from "fixtures";

test.describe("[UI] [Sales Portal] [Home] [Metrics]", async () => {
  test("Should see correct metrics", async ({ homeUIService, mock, homePage }) => {
    const data = new MetricsMockBuilder()
      .addDefaultRecentOrder()
      .addDefaultRecentOrder()
      .addDefaultRecentOrder()
      .build();
    await mock.metrics(data);
    await homeUIService.openAsLoggedInUser();
    const metrics = await homePage.getAllMetrics();
    console.log(metrics);
  });
});
