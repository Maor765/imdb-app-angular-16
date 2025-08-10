const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(__dirname, "package.json");

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const version = packageJson.version;

  if (!version) {
    throw new Error("No version field found in package.json");
  }

  const versionParts = version.split(".").map(Number);
  if (versionParts.length !== 3 || versionParts.some(isNaN)) {
    throw new Error("Version is not in valid MAJOR.MINOR.PATCH format");
  }

  // Increment patch version
  versionParts[2] += 1;

  const newVersion = versionParts.join(".");

  packageJson.version = newVersion;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log(`Version updated from ${version} to ${newVersion}`);
} catch (error) {
  console.error("Error updating version:", error.message);
  process.exit(1);
}
