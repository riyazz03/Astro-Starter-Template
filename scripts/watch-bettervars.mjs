import chokidar from "chokidar";
import { resolve } from "path";
import { buildBettervars } from "./bettervars-core.mjs";

const root = process.cwd();
const watchDir = resolve(root, "bettervars");

function runBuild(reason) {
  try {
    const outputPath = buildBettervars(root);
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] BetterVars rebuilt -> ${outputPath} (${reason})`);
  } catch (err) {
    console.error(`BetterVars build failed: ${err.message}`);
  }
}

runBuild("initial build");

const watcher = chokidar.watch(watchDir, {
  ignoreInitial: true,
});

watcher
  .on("add", (path) => runBuild(`added ${path}`))
  .on("change", (path) => runBuild(`changed ${path}`))
  .on("unlink", (path) => runBuild(`removed ${path}`));

console.log(`Watching ${watchDir} for changes...`);
