import { readFileSync } from "fs";

import { build } from "esbuild";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const externalPackages = Object.keys(packageJson.dependencies);

build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outdir: "dist",
    sourcemap: true,
    tsconfig: "tsconfig.build.json",
    platform: "node",
    logLevel: "info",
    target: "node18",
    minify: false,
    external: externalPackages,
});
