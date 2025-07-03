import { IProductFromResponse, IProductsResponse, PRODUCTS_SORT_FIELD } from "types/products.types";
import { BaseMockBuilder } from "./baseMockBuilder";
import { SORT_DIRECTION } from "types/api.types";
import { defaultProductMockData, generateProductData } from "data/products/generateProduct.data";
import { MANUFACTURERS } from "data/products/manufacturers.data";
import { ObjectId } from "bson";

export class ProductsMockBuilder extends BaseMockBuilder<IProductsResponse> {
  protected data: IProductsResponse = {
    Products: [],
    ErrorMessage: null,
    IsSuccess: true,
    manufacturer: [],
    page: 1,
    limit: 10,
    search: "",
    total: 0,
    sorting: {
      sortField: PRODUCTS_SORT_FIELD.CREATED_ON,
      sortOrder: SORT_DIRECTION.ASC,
    },
  };

  addRandomProduct() {
    const product = {
      ...generateProductData(),
      _id: new ObjectId().toHexString(),
      createdOn: new Date().toISOString(),
    };
    this.addProduct(product);
    return this;
  }

  addDefaultProduct() {
    this.addProduct(defaultProductMockData);
    return this;
  }

  addBulkProducts(count: number, type: "random" | "default" = "random") {
    for (let i = 0; i < count; i++) {
      if (type === "default") this.addDefaultProduct();
      else this.addRandomProduct();
    }
    return this;
  }

  private addProduct(customer: IProductFromResponse) {
    this.data.Products.push(customer);
    this.data.total++;
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

  setFilters(manufacturers: MANUFACTURERS[]) {
    this.data.manufacturer = manufacturers;
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

  setSortField(sortField: PRODUCTS_SORT_FIELD, reverse = false) {
    this.data.sorting.sortField = reverse
      ? Object.values(PRODUCTS_SORT_FIELD).find((c) => c !== sortField)!
      : sortField;
    return this;
  }
}
