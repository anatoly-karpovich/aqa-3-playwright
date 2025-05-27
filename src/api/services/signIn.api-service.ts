import { APIRequestContext, expect } from "@playwright/test";
import { SignInController } from "api/controllers/signIn.controller";
import { USER_LOGIN, USER_PASSWORD } from "config/evnironment";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validations/responseValidation";

export class SignInApiService {
  controller: SignInController;
  constructor(request: APIRequestContext) {
    this.controller = new SignInController(request);
  }

  async loginAsLocalUser() {
    const response = await this.controller.signIn({
      username: USER_LOGIN,
      password: USER_PASSWORD,
    });

    validateResponse(response, STATUS_CODES.OK, true, null);
    const token = response.headers["authorization"];
    return token;
  }
}
