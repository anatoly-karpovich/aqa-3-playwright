import { MANUFACTURERS } from "data/products/manufacturers.data";
import { expect, test } from "fixtures/ui-services.fixture";
import _ from "lodash";

test.describe("[UI] [Integration] [Products] [Details]", async () => {
  test("Should see correct data on product details modal", async ({
    signInUIService,
    homeUIService,
    productsPage,
    mock,
  }) => {
    const mockProduct = {
      name: "Test",
      amount: 1,
      price: 1234,
      manufacturer: MANUFACTURERS.APPLE,
      createdOn: "May 20, 2025 1:20 AM",
      _id: "1",
      notes: "",
    };
    await mock.products({
      Products: [mockProduct],
      ErrorMessage: null,
      IsSuccess: true,
      sorting: {
        sortField: "createdOn",
        sortOrder: "desc",
      },
    });
    await mock.productDetails({
      Product: mockProduct,
      ErrorMessage: null,
      IsSuccess: true,
    });

    await signInUIService.signInAsLocalUser();
    await homeUIService.openModule("Products");
    await productsPage.clickDetails("Test");

    const actualData = await productsPage.detailsModal.getDetails();
    const expected = _.omit(mockProduct, "_id");
    expected.notes = expected.notes ? expected.notes : "-";
    expect(actualData).toMatchObject({ ...expected });
  });
});
