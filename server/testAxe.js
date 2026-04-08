const runAxeAudit = require("./services/axeService");

async function test() {
  const url = "https://dequeuniversity.com/demo/mars/";

  try {
    console.log("Starting accessibility scan...");
    console.log("Scanning:", url);

    const results = await runAxeAudit(url);

    console.log(results);

    if (!results || !results.violations) {
      console.log("No results returned.");
      return;
    }

    console.log("\nViolations found:", results.violations.length);

    results.violations.forEach((violation, index) => {
      console.log(`\n${index + 1}. ${violation.id}`);
      console.log("Description:", violation.description);
      console.log("Impact:", violation.impact || "none");
      console.log("Nodes affected:", violation.nodes.length);
    });

  } catch (error) {
    console.error("Audit failed:", error.message || error);
  }
}

test();