import { DataManager } from "./dataManager";
import { test as base } from "@playwright/test";

interface IDataManager {
  dataManager: DataManager;
}

export const test = base.extend<IDataManager>({
  dataManager: async ({ request, page }, use) => {
    const dataManager = await DataManager.init(request, page);
    await use(dataManager);
    await dataManager.cleanUp();
  },
});

export { expect } from "@playwright/test";
