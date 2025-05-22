import { MANUFACTURERS } from "data/products/manufacturers.data";
import { test } from "fixtures/ui-services.fixture";
import { IProduct } from "types/products.types";

test.describe("[UI] [Integration] [Products] [Add] Validations", () => {
  test("Should see correct error message for name field", async ({
    signInUIService,
    homeUIService,
    productsPage,
    addNewProductPage,
  }) => {
    await homeUIService.openAsLoggedInUser();
    await homeUIService.openModule("Products");
    await productsPage.addNewProductButton.click();
    await addNewProductPage.fillInputs({
      name: 1231451 as unknown as IProduct["name"],
      amount: 1,
      price: 1,
      manufacturer: MANUFACTURERS.APPLE,
      notes: "123",
    });
  });
});
