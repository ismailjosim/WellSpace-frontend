import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const preload = path.join(__dirname, "suppress-baseline-warning.cjs");
const existingNodeOptions = process.env.NODE_OPTIONS || "";
const nextCli = path.join(
  __dirname,
  "..",
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

const result = spawnSync(process.execPath, [nextCli, "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA: "true",
    BROWSERSLIST_IGNORE_OLD_DATA: "true",
    NODE_OPTIONS: `${existingNodeOptions} --require=${preload}`.trim(),
  },
});

process.exit(result.status ?? 1);
