import { buildBettervars } from "./bettervars-core.mjs";

const outputPath = buildBettervars();
console.log(`BetterVars built -> ${outputPath}`);
