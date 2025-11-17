// sailet.config.ts

import { script, step, cmd, $ } from "sailet";

script("build", () => [
  step("Build project using TypeScript", () => [
    cmd(
      $`bun build --outdir dist --target node --packages external src/index.ts`
    ),
  ]),
]);
