const { chromium } = require("playwright");

(async () => {
  try {
    console.log("Step 1: launching browser");

    const browser = await chromium.launch({ headless: true });

    console.log("Step 2: creating page");

    const page = await browser.newPage();

    console.log("Step 3: navigating");

    await page.goto("https://example.com", {
      waitUntil: "load",
      timeout: 30000
    });

    console.log("Step 4: success");

    await browser.close();
  } catch (err) {
    console.error("ERROR:", err);
  }
})();