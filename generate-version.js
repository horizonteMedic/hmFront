import { execSync } from "child_process";
import { writeFileSync } from "fs";

const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
const timestamp = new Date().toISOString();

const versionData = {
    version: commitHash,
    builtAt: timestamp
};

writeFileSync("public/version.json", JSON.stringify(versionData, null, 2));

console.log("🆕 version.json generado:", versionData);
