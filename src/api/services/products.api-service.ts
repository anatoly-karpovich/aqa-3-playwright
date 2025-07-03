import { APIRequestContext, expect } from "@playwright/test";
import { ProductsController } from "api/controllers/products.controller";
import { generateProductData } from "data/products/generateProduct.data";
import { STATUS_CODES } from "data/statusCodes";
import { IProduct } from "types/products.types";
import { logStep } from "utils/reporter.utils";
import { validateResponse } from "utils/validations/responseValidation";

export class ProductsApiService {
  controller: ProductsController;

  constructor(request: APIRequestContext) {
    this.controller = new ProductsController(request);
  }

  @logStep("Create Product via API")
  async create(token: string, customData?: IProduct) {
    const body = generateProductData(customData);
    const response = await this.controller.create(body, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    return response.body.Product;
  }

  @logStep("Delete Product via API")
  async delete(id: string, token: string) {
    const response = await this.controller.delete(id, token);
    expect.soft(response.status).toBe(STATUS_CODES.DELETED);
  }
}
