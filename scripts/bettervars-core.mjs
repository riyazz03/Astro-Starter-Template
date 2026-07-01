import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";

function buildClamp(minPx, maxPx, viewport) {
  const slope = (maxPx - minPx) / (viewport.max - viewport.min);
  const intercept = minPx - slope * viewport.min;
  const minRem = (minPx / 16).toFixed(4);
  const maxRem = (maxPx / 16).toFixed(4);
  const interceptRem = (intercept / 16).toFixed(4);
  const slopeVw = (slope * 100).toFixed(4);
  return `clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem)`;
}

export function buildBettervars(root = process.cwd()) {
  const config = JSON.parse(readFileSync(resolve(root, "bettervars/config.json"), "utf-8"));
  const colors = JSON.parse(readFileSync(resolve(root, "bettervars/colors.json"), "utf-8"));
  const typography = JSON.parse(readFileSync(resolve(root, "bettervars/typography.json"), "utf-8"));
  const fluid = JSON.parse(readFileSync(resolve(root, "bettervars/fluid.json"), "utf-8"));

  let css = "";
  css += ":root {\n";

  for (const [, colorMap] of Object.entries(colors.palettes)) {
    for (const [name, hex] of Object.entries(colorMap)) {
      css += `  --${name}: ${hex};\n`;
    }
  }

  for (const [name, { minPx, maxPx }] of Object.entries(fluid)) {
    css += `  --${name}: ${buildClamp(minPx, maxPx, config.viewport)};\n`;
  }

  for (const [name, props] of Object.entries(typography)) {
    css += `  --font-size-${name}: ${buildClamp(props.minPx, props.maxPx, config.viewport)};\n`;
  }

  css += "}\n\n";

  for (const [name, props] of Object.entries(typography)) {
    css += `.text-${name} {\n`;
    css += `  font-family: ${props.fontFamily};\n`;
    css += `  font-weight: ${props.weight};\n`;
    css += `  line-height: ${props.lineHeight};\n`;
    css += `  font-size: var(--font-size-${name});\n`;
    css += "}\n\n";
  }

  const outputPath = resolve(root, config.output);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, css);

  return outputPath;
}
