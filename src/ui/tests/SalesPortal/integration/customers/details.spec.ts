import { COUNTRIES } from "data/customers/countries.data";
import { expect, test } from "fixtures";
import { convertToDateAndTime } from "utils/date.utils";

test.describe("[UI] [Customers] [Details]", async () => {
  test("Should display valid customer data", async ({ homeUIService, customerDetailsPage, mock }) => {
    const expected = {
      email: "aaa@gmail.com",
      name: "Anatoly Karpovich",
      country: "USA" as COUNTRIES,
      city: "Warszawa",
      street: "asda",
      house: 321,
      flat: 123,
      phone: "+1111111111111111111",
      createdOn: "2025-05-13T17:33:12.000Z",
      notes: "asdasda",
    };
    const id = "68238258d006ba3d47613e8d";

    // await mock.customers({
    //   Customers: [
    //     {
    //       _id: id,
    //       ...expected,
    //     },
    //   ],
    //   ErrorMessage: null,
    //   IsSuccess: true,
    //   sorting: {
    //     sortField: "createdOn",
    //     sortOrder: "desc",
    //   },
    // });

    await mock.customerDetails(
      { Customer: { _id: id, ...expected }, ErrorMessage: null, IsSuccess: true },
      {
        Orders: [],
        ErrorMessage: null,
        IsSuccess: true,
      }
    );

    await homeUIService.openAsLoggedInUser();

    // await homePage.clickModuleButton("Customers");
    // await customersPage.waitForOpened();

    // await customersPage.clickTableAction("aaa@gmail.com", "details");
    // await page.evaluate(async (id: string) => {
    //   await (
    //     window as typeof window & { renderCustomerDetailsPage: (id: string) => Promise<void> }
    //   ).renderCustomerDetailsPage(id);
    // }, id);
    await customerDetailsPage.open(id);
    await customerDetailsPage.waitForOpened();

    const actual = await customerDetailsPage.getDetails();
    expect(actual).toEqual({ ...expected, createdOn: convertToDateAndTime(expected.createdOn) });
  });
});
