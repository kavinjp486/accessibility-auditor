export default function calculateScore(violations) {

  let critical = 0;
  let serious = 0;
  let moderate = 0;
  let minor = 0;

  violations.forEach(v => {

    switch (v.impact) {

      case "critical":
        critical++;
        break;

      case "serious":
        serious++;
        break;

      case "moderate":
        moderate++;
        break;

      default:
        minor++;

    }

  });

  const score = Math.max(
    0,
    100 - (critical * 10) - (serious * 5) - (moderate * 3) - (minor * 1)
  );

  return {
    score,
    critical,
    serious,
    moderate,
    minor
  };

}