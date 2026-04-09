import captureScreenshot from "./services/screenshotService.js";

async function runTest() {

  try {

    const url = "https://example.com";

    console.log("Starting screenshot capture...");

    const filepath = await captureScreenshot(url);

    console.log("Screenshot saved at:", filepath);

  } catch (error) {

    console.error("Error capturing screenshot:", error);

  }

}

runTest();