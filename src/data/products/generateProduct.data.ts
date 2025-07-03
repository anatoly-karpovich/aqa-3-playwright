import { faker } from "@faker-js/faker";
import { IProduct, IProductFromResponse } from "types/products.types";
import { MANUFACTURERS } from "./manufacturers.data";
import { getRandomEnumValue } from "utils/enum.utils";
import { ObjectId } from "bson";

export function generateProductData(customData?: Partial<IProduct>): IProduct {
  return {
    name: faker.commerce.product() + faker.number.int({ min: 1, max: 100000 }),
    manufacturer: getRandomEnumValue(MANUFACTURERS),
    amount: faker.number.int({ min: 0, max: 999 }),
    price: faker.number.int({ min: 1, max: 99999 }),
    notes: faker.string.alphanumeric({ length: 250 }),
    ...customData,
  };
}

export function generateProductFromResponse(): IProductFromResponse {
  return {
    ...generateProductData(),
    _id: new ObjectId().toHexString(),
    createdOn: new Date().toISOString(),
  };
}

export const defaultProductMockData: IProductFromResponse = {
  _id: "684034ff1c508c5d5e50c107",
  name: "Mock Product",
  amount: 1,
  price: 1000,
  manufacturer: MANUFACTURERS.SAMSUNG,
  createdOn: "2025-05-22T17:04:41.000Z",
  notes: "Test Mock Notes",
};
