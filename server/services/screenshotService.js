const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

async function captureScreenshot(url) {
  const browser = await chromium.launch({ headless: true });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 30000
  });

  const timestamp = Date.now();

  const filename = `screenshot-${timestamp}.png`;

  const filepath = path.join(__dirname, "../../uploads", filename);

  await page.screenshot({
    path: filepath,
    fullPage: true
  });

  await browser.close();

  return filepath;
}

module.exports = captureScreenshot;