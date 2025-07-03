import { faker } from "@faker-js/faker";
import { ICustomer, ICustomerFromResponse } from "types/customer.types";
import { COUNTRIES } from "data/customers/countries.data";
import { getRandomEnumValue } from "utils/enum.utils";

export function generateCustomerData(params?: Partial<ICustomer>): ICustomer {
  return {
    email: `test${Date.now()}${faker.string.alphanumeric(20)}@gmail.com`,
    name: `Test ${faker.string.alpha(35)}`,
    country: getRandomEnumValue(COUNTRIES),
    city: `City ${faker.string.alpha(15)}`,
    street: `Street ${faker.string.alphanumeric(33)}`,
    house: faker.number.int(999),
    flat: faker.number.int(9999),
    phone: `+${faker.number.int({ min: 1000000000, max: 9999999999 })}`,
    notes: `Notes ${faker.string.alpha(244)}`,
    ...params,
  };
}

export const defaultCustomerMockData: ICustomerFromResponse = {
  _id: "682f5929d006ba3d4761eeb4",
  email: "mock@example.com",
  name: "Test Mock Customer",
  country: COUNTRIES.CANADA,
  city: "Test town Colorado",
  street: "Test Mock Street",
  house: 2,
  flat: 2,
  phone: "+14562775964",
  createdOn: "2025-05-22T17:04:41.000Z",
  notes: "Test Mock Notes",
};
