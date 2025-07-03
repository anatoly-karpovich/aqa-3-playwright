import { BaseMockBuilder } from "data/builders/baseMockBuilder";
import { ICustomerFromResponse, ICustomersResponse } from "types/customer.types";
import { defaultCustomerMockData, generateCustomerData } from "../customers/generateCustomer.data";
import { ObjectId } from "bson";
import { COUNTRIES } from "../customers/countries.data";
import { CUSTOMERS_SORT_FIELD, SORT_DIRECTION } from "types/api.types";

export class CustomersMockBuilder extends BaseMockBuilder<ICustomersResponse> {
  protected data: ICustomersResponse = {
    Customers: [],
    sorting: {
      sortField: CUSTOMERS_SORT_FIELD.CREATED_ON,
      sortOrder: SORT_DIRECTION.ASC,
    },
    page: 1,
    limit: 10,
    search: "",
    total: 0,
    country: [],
    IsSuccess: true,
    ErrorMessage: null,
  };

  addRandomCustomer() {
    const customer = {
      ...generateCustomerData(),
      _id: new ObjectId().toHexString(),
      createdOn: new Date().toISOString(),
    };
    this.addCustomer(customer);
    return this;
  }

  addDefaultCustomer(notes = true) {
    const data = notes ? defaultCustomerMockData : { ...defaultCustomerMockData, notes: "" };
    this.addCustomer(data);
    return this;
  }

  addCustomCustomer(customer: ICustomerFromResponse) {
    this.addCustomer(customer);
    return this;
  }

  addBulkCustomers(count: number, type: "random" | "default" = "random") {
    for (let i = 0; i < count; i++) {
      if (type === "default") this.addDefaultCustomer();
      else this.addRandomCustomer();
    }
    return this;
  }

  setPage(page: number) {
    this.data.page = page;
    return this;
  }

  setLimit(limit: number) {
    this.data.limit = limit;
    return this;
  }

  setSearch(search: string) {
    this.data.search = search;
    return this;
  }

  setTotal(total: number) {
    this.data.total = total;
    return this;
  }

  setFilters(country: COUNTRIES[]) {
    this.data.country = country;
    return this;
  }

  setSortField(sortField: CUSTOMERS_SORT_FIELD, reverse = false) {
    this.data.sorting.sortField = reverse
      ? Object.values(CUSTOMERS_SORT_FIELD).find((c) => c !== sortField)!
      : sortField;
    return this;
  }

  setSortOrder(sortOrder: SORT_DIRECTION, reverse = false) {
    this.data.sorting.sortOrder = reverse
      ? sortOrder === SORT_DIRECTION.ASC
        ? SORT_DIRECTION.DESC
        : SORT_DIRECTION.ASC
      : sortOrder;
    return this;
  }

  private addCustomer(customer: ICustomerFromResponse) {
    this.data.Customers.push(customer);
    this.data.total++;
    return this;
  }
}
