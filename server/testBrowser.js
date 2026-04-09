import { chromium } from "playwright";

(async () => {

  try {

    console.log("Step 1: launching browser");

    const browser = await chromium.launch();

    console.log("Step 2: creating page");

    const page = await browser.newPage();

    console.log("Step 3: navigating");

    await page.goto("https://example.com");

    console.log("Browser launched successfully");

    await browser.close();

  } catch (err) {

    console.error("ERROR:", err);

  }

})();