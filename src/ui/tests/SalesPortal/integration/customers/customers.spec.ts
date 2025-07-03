import { apiConfig } from "config/api-config";
import { CustomersMockBuilder } from "data/builders";
import { EMPTY_TABLE_ROW_TEXT } from "data/notifications.data";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures";
import { CUSTOMERS_SORT_FIELD, SORT_DIRECTION } from "types/api.types";

test.describe("[UI] [Customers] [Table component]", async () => {
  const fields = Object.values(CUSTOMERS_SORT_FIELD);
  const directions = Object.values(SORT_DIRECTION).reverse();

  fields.forEach((sortField) => {
    directions.forEach((sortOrder) => {
      test(
        `Should display correct sorting for ${sortField} field and ${sortOrder} direction`,
        { tag: [TAGS.VISUAL] },
        async ({ customersPage, mock, homeUIService }) => {
          await mock.customers(
            new CustomersMockBuilder().addDefaultCustomer().setSortField(sortField).setSortOrder(sortOrder).build()
          );
          await homeUIService.openAsLoggedInUser();
          await customersPage.open();
          await customersPage.waitForOpened();
          await expect(customersPage.table).toHaveScreenshot();
        }
      );
      test(
        `Should send correct query clicking on "${sortField}" header with ${sortOrder} direction`,
        { tag: [TAGS.VISUAL] },
        async ({ homeUIService, customersPage, mock }) => {
          const mockData = new CustomersMockBuilder()
            .addRandomCustomer()
            .setSortOrder(sortOrder, true)
            .setSortField(sortField)
            .build();
          await mock.customers(mockData);
          await homeUIService.openAsLoggedInUser();
          await customersPage.open();
          await customersPage.waitForOpened();
          const request = await customersPage.interceptRequest(
            apiConfig.ENDPOINTS.CUSTOMERS,
            customersPage.clickTableHeader.bind(customersPage),
            sortField
          );
          expect(request.url()).toBe(
            `${apiConfig.BASE_URL}/${apiConfig.ENDPOINTS.CUSTOMERS}?sortField=${sortField}&sortOrder=${sortOrder}&page=${mockData.page}&limit=${mockData.limit}`
          );
        }
      );
    });
  });

  const testData = [
    {
      page: 1,
      limit: 10,
      total: 1,
    },
    {
      page: 1,
      limit: 25,
      total: 1,
    },
    {
      page: 1,
      limit: 50,
      total: 1,
    },
    {
      page: 1,
      limit: 100,
      total: 1,
    },
  ];
  testData.forEach(({ page, limit, total }) => {
    test(
      `Should see correct pagination with ${page} page, ${limit} limit and ${total} total items`,
      { tag: [TAGS.VISUAL] },
      async ({ homeUIService, customersPage, mock }) => {
        const mockData = new CustomersMockBuilder()
          .addRandomCustomer()
          .setPage(page)
          .setLimit(limit)
          .setTotal(total)
          .build();
        await mock.customers(mockData);
        await homeUIService.openAsLoggedInUser();
        await customersPage.open();
        await customersPage.waitForOpened();
        await expect(customersPage.paginationSection).toHaveScreenshot();
      }
    );
  });

  test(`Should see empty table`, { tag: [TAGS.VISUAL] }, async ({ homeUIService, customersPage, mock }) => {
    const mockData = new CustomersMockBuilder().build();
    await mock.customers(mockData);
    await homeUIService.openAsLoggedInUser();
    await customersPage.open();
    await customersPage.waitForOpened();
    await expect(customersPage.tableRow).toHaveText(EMPTY_TABLE_ROW_TEXT);
  });
});
