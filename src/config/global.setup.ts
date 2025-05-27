import path from "path";
import { rimraf } from "rimraf";

export default function globalSetup() {
  if (process.env.CI) return;
  const resultsPath = path.resolve(__dirname, "allure-results");
  rimraf.sync(resultsPath);
}
