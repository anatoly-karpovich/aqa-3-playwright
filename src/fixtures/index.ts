import { test as pages } from "./pages.fixture";
import { test as uiServices } from "./ui-services.fixture";
// import { test as businessSteps } from "./businessSteps.fixture";
import { test as apiServices } from "./api-services.fixture";
import { test as mock } from "./mock.fixture";
import { test as dataManager } from "./dataManager.fixture";
import { test as controllers } from "./contollers.fixture";
import { expect, mergeTests } from "@playwright/test";

const test = mergeTests(
  pages,
  uiServices,
  // businessSteps,
  apiServices,
  mock,
  dataManager,
  controllers
);

export { expect, test };
