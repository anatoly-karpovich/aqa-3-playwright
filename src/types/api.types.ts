export interface IRequestOptions {
  baseURL: string;
  url: string;
  method: "get" | "post" | "put" | "delete";
  data?: object;
  headers?: Record<string, string>;
}

export interface IResponse<T extends object | null> {
  status: number;
  headers: Record<string, string>;
  body: T;
}

export interface IResponseFields {
  IsSuccess: boolean;
  ErrorMessage: string | null;
}

export type sortDirection = "asc" | "desc";

export type customersSortField = "createdOn" | "email" | "name" | "country";

export enum SORT_DIRECTION {
  ASC = "asc",
  DESC = "desc",
}

export enum CUSTOMERS_SORT_FIELD {
  CREATED_ON = "createdOn",
  EMAIL = "email",
  NAME = "name",
  COUNTRY = "country",
}
