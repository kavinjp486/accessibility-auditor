import { chromium } from "playwright";
import axe from "axe-core";

const axeSource = axe.source;

export default async function runAxeAudit(url) {

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 30000
  });

  await page.addScriptTag({
    content: axeSource
  });

  const results = await page.evaluate(async () => {
    return await axe.run();
  });

  await browser.close();

  return results;
}