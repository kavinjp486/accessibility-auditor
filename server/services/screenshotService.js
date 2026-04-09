import { chromium } from "playwright";
import path from "path";
import fs from "fs";

export default async function captureScreenshot(url) {

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 30000
  });

  const timestamp = Date.now();
  const filename = `screenshot-${timestamp}.png`;

  const filepath = path.join("uploads", filename);

  await page.screenshot({
    path: filepath,
    fullPage: true
  });

  await browser.close();

  return filepath;
}