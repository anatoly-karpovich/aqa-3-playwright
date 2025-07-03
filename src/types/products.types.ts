import { MANUFACTURERS } from "data/products/manufacturers.data";
import { IResponseFields, sortDirection } from "./api.types";

export interface IProduct {
  name: string;
  manufacturer: MANUFACTURERS;
  price: number;
  amount: number;
  notes?: string;
}

export interface IProductFromResponse extends IProduct {
  _id: string;
  createdOn: string;
}

export interface IProductResponse extends IResponseFields {
  Product: IProductFromResponse;
}

export interface IProductsResponse extends IResponseFields {
  Products: IProductFromResponse[];
  sorting: {
    sortField: PRODUCTS_SORT_FIELD;
    sortOrder: sortDirection;
  };
  page: number;
  limit: number;
  search: string;
  total: number;
  manufacturer: MANUFACTURERS[];
}

export enum PRODUCTS_SORT_FIELD {
  CREATED_ON = "createdOn",
  NAME = "name",
  MANUFACTURER = "manufacturer",
  PRICE = "price",
}
