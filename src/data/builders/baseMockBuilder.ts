import { ICustomersResponse } from "types/customer.types";
import { IMetricsResponse } from "types/metrics.types";
import { IProductsResponse } from "types/products.types";

export abstract class BaseMockBuilder<T extends ICustomersResponse | IProductsResponse | IMetricsResponse> {
  protected abstract data: T;

  public build() {
    return this.data;
  }

  public setIsSuccess(isSuccess: boolean) {
    this.data.IsSuccess = isSuccess;
  }

  public setErrorMessage(errorMessage: string | null) {
    this.data.ErrorMessage = errorMessage;
  }
}
