import { COUNTRIES } from "data/customers/countries.data";
import { customersSortField, IResponseFields, sortDirection } from "./api.types";

export interface ICustomer {
  email: string;
  name: string;
  country: COUNTRIES;
  city: string;
  street: string;
  house: number;
  flat: number;
  phone: string;
  notes?: string;
}

export interface ICustomerFromResponse extends ICustomer {
  _id: string;
  createdOn: string;
}

export interface ICustomerResponse extends IResponseFields {
  Customer: ICustomerFromResponse;
}

export interface ICustomersResponse extends ICustomersSortedResponse {
  sorting: {
    sortField: customersSortField;
    sortOrder: sortDirection;
  };
  page: number;
  limit: number;
  search: string;
  total: number;
  country: COUNTRIES[];
}

export interface ICustomersSortedResponse extends IResponseFields {
  Customers: ICustomerFromResponse[];
}

export type ICustomerInTable = Pick<ICustomer, "email" | "country" | "name">;
