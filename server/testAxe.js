import runAxeAudit from "./services/axeService.js";

async function test() {

  try {

    const url = "https://old.reddit.com";

    console.log("Starting accessibility scan...");

    const results = await runAxeAudit(url);

    console.log("Violations found:", results.violations.length);

    results.violations.forEach((violation, index) => {

      console.log(`\n${index + 1}. ${violation.id}`);
      console.log("Description:", violation.description);
      console.log("Impact:", violation.impact);
      console.log("Nodes affected:", violation.nodes.length);

    });

  } catch (error) {

    console.error("Audit failed:", error);

  }

}

test();