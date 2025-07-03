import { generateProductData } from "data/products/generateProduct.data";
import { STATUS_CODES } from "data/statusCodes";
import { test, expect } from "fixtures";
import { validateResponse } from "utils/validations/responseValidation";

test.describe("[API] [Products] [Create]", () => {
  let id = "";
  let token = "";

  test.afterEach(async ({ productsController }) => {
    if (!id) return;
    const response = await productsController.delete(id, token);
    expect.soft(response.status).toBe(STATUS_CODES.DELETED);
  });

  test("Create product with smoke data using controller", async ({ signInApiService, productsController }) => {
    token = await signInApiService.loginAsLocalUser();
    const product = generateProductData();
    const response = await productsController.create(product, token);
    id = response.body.Product._id;
    validateResponse(response, STATUS_CODES.CREATED, true, null);
  });

  test("Create product with smoke data using service", async ({ signInApiService, productsApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    const product = await productsApiService.create(token);
    id = product._id;
  });

  test("Delete all products", async ({ signInApiService, productsController }) => {
    token = await signInApiService.loginAsLocalUser();
    const products = (await productsController.getAll(token)).body.Products;
    for (const product of products) {
      await productsController.delete(product._id, token);
    }
  });
});
