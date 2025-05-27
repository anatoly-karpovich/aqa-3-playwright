import { sendNotification } from "utils/notifications/telegram";

export default async function () {
  await sendNotification(`Test run finished!
    
Link to deployed report:

https://anatoly-karpovich.github.io/aqa-3-playwright/allure-report/#`);
}
