import { APIResponse, request } from "@playwright/test";
import { apiConfig } from "config/api-config";
import _ from "lodash";
import { IRequestOptions, IResponse } from "types/api.types";

export class RequestApi {
  private response: APIResponse | undefined;

  async send<T extends Object | null>(options: IRequestOptions): Promise<IResponse<T>> {
    try {
      const requestContext = await request.newContext({
        baseURL: options.baseURL ?? apiConfig.BASE_URL,
      });

      this.response = await requestContext.fetch(options.url, _.omit(options, ["baseURL", "url"]));
      if (this.response.status() >= 500) throw new Error("Request failed with status " + this.response.status());
      const result = await this.transformResponse();
      return result;
    } catch (err) {
      console.log((err as Error).message);
      throw err;
    }
  }

  async transformResponse() {
    let body;
    const contentType = this.response!.headers()["content-type"] || "";
    if (contentType.includes("application/json")) {
      body = await this.response!.json();
    } else {
      body = await this.response!.text();
    }

    return {
      status: this.response!.status(),
      body,
      headers: this.response!.headers(),
    };
  }
}
