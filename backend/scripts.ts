import { spawn } from "node:child_process";
import { watch } from "node:fs/promises";

const command = process.argv.at(2);

if (command === "dev") {  
  let cargoRun = spawn("cargo", ["run"]);
  cargoRun.stderr.on("data", (d) => console.log(d.toString()));

  let debounceTimer: NodeJS.Timeout | null = null;

  const watcher = watch(__dirname, { recursive: true });
  for await (const event of watcher) {
    if (event.filename?.startsWith("target")) continue;

    if (event.filename === "scripts.ts") {
      cargoRun?.kill();
      process.exit(1);
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      console.log("Detected file change, restarting");

      cargoRun.kill();

      cargoRun = spawn("cargo", ["run"]);
      cargoRun.stderr.on("data", (d) => console.log(d.toString()));
    }, 600);
  }
} else {
  console.error("Invalid command");
  process.exit(1);
}
