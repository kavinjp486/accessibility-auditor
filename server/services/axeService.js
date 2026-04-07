const { chromium } = require("playwright");
const axeSource = require("axe-core").source;

async function runAxeAudit(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    // Inject axe-core into the page
    await page.addScriptTag({
      content: axeSource
    });

    // Run accessibility scan
    const results = await page.evaluate(async () => {
      return await axe.run();
    });

    return results;

  } finally {
    await browser.close();
  }
}

module.exports = runAxeAudit;