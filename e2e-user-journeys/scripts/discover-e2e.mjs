#!/usr/bin/env node
/**
 * Discover E2E test setup in a repo. Prints JSON manifest to stdout.
 *
 * Usage:
 *   node .cursor/skills/e2e-user-journeys/scripts/discover-e2e.mjs [repo-root]
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

const repoRoot = resolve(process.argv[2] ?? process.cwd());

const SPEC_GLOBS = [
  /\.spec\.[cm]?[jt]sx?$/,
  /\.test\.[cm]?[jt]sx?$/,
  /\.cy\.[cm]?[jt]sx?$/,
  /\.e2e\.[cm]?[jt]sx?$/,
];

const CONFIG_NAMES = [
  "playwright.config.ts",
  "playwright.config.js",
  "playwright.config.mjs",
  "cypress.config.ts",
  "cypress.config.js",
  "cypress.config.mjs",
  "wdio.conf.ts",
  "wdio.conf.js",
];

const E2E_DIR_HINTS = [
  "packages/e2e",
  "e2e",
  "tests/e2e",
  "test/e2e",
  "apps/e2e",
];

function walk(dir, files = []) {
  if (!existsSync(dir)) {
    return files;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name === "dist" ||
      entry.name === "build" ||
      entry.name === ".next"
    ) {
      continue;
    }

    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (SPEC_GLOBS.some((pattern) => pattern.test(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function readJsonSafe(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function hasE2eDependency(packageJson) {
  const deps = {
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies,
    ...packageJson?.peerDependencies,
  };
  return Boolean(
    deps?.["@playwright/test"] ||
      deps?.playwright ||
      deps?.cypress ||
      deps?.["@cypress/webpack-preprocessor"] ||
      deps?.webdriverio ||
      deps?.["@wdio/cli"],
  );
}

function findConfigFiles(startDir, depth = 0, found = []) {
  if (depth > 6 || !existsSync(startDir)) {
    return found;
  }

  for (const name of CONFIG_NAMES) {
    const configPath = join(startDir, name);
    if (existsSync(configPath)) {
      found.push(configPath);
    }
  }

  for (const entry of readdirSync(startDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name === "dist"
    ) {
      continue;
    }
    findConfigFiles(join(startDir, entry.name), depth + 1, found);
  }

  return found;
}

function readConfigText(configPath) {
  try {
    return readFileSync(configPath, "utf8");
  } catch {
    return "";
  }
}

function extractStringLiteral(source, key) {
  const patterns = [
    new RegExp(`${key}\\s*:\\s*["'\`]([^"'\`]+)["'\`]`),
    new RegExp(`${key}\\s*=\\s*["'\`]([^"'\`]+)["'\`]`),
  ];
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

function parseTestDir(configPath, source) {
  const dir = extractStringLiteral(source, "testDir");
  if (dir) {
    return resolve(dirname(configPath), dir);
  }

  if (source.includes("cypress")) {
    const specPattern = extractStringLiteral(source, "specPattern");
    if (specPattern?.includes("/")) {
      return resolve(dirname(configPath), specPattern.split("*")[0]);
    }
    return resolve(dirname(configPath), "cypress/e2e");
  }

  return resolve(dirname(configPath), "tests");
}

function detectFramework(configPath, source, packageJson) {
  const name = basename(configPath);
  if (name.startsWith("playwright")) {
    return "playwright";
  }
  if (name.startsWith("cypress")) {
    return "cypress";
  }
  if (name.startsWith("wdio")) {
    return "webdriverio";
  }

  const deps = {
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies,
  };

  if (deps?.["@playwright/test"] || deps?.playwright) {
    return "playwright";
  }
  if (deps?.cypress) {
    return "cypress";
  }
  if (deps?.webdriverio || deps?.["@wdio/cli"]) {
    return "webdriverio";
  }

  return "unknown";
}

function extractSpecMetadata(source) {
  const describes = [];
  const tests = [];
  const tags = new Set();

  for (const match of source.matchAll(/test\.describe(?:\.only|\.skip)?\s*\(\s*["'`]([^"'`]+)["'`]/g)) {
    describes.push(match[1]);
  }
  for (const match of source.matchAll(/describe(?:\.only|\.skip)?\s*\(\s*["'`]([^"'`]+)["'`]/g)) {
    describes.push(match[1]);
  }
  for (const match of source.matchAll(/(?:test|it)(?:\.only|\.skip)?\s*\(\s*["'`]([^"'`]+)["'`]/g)) {
    tests.push(match[1]);
  }
  for (const match of source.matchAll(/tag:\s*["'`](@[^"'`]+)["'`]/g)) {
    tags.add(match[1]);
  }
  for (const match of source.matchAll(/@(?:smoke|regression|e2e)\b/g)) {
    tags.add(match[0]);
  }

  return {
    describes: [...new Set(describes)],
    tests: [...new Set(tests)],
    tags: [...tags],
  };
}

function scoreCandidate(candidate) {
  let score = 0;
  if (candidate.framework !== "unknown") {
    score += 10;
  }
  if (candidate.config_path) {
    score += 8;
  }
  if (candidate.spec_count > 0) {
    score += 5;
  }
  if (candidate.package_name?.includes("e2e")) {
    score += 3;
  }
  if (E2E_DIR_HINTS.some((hint) => candidate.e2e_root.endsWith(hint))) {
    score += 2;
  }
  return score;
}

function buildCandidate(e2eRoot) {
  const packageJsonPath = join(e2eRoot, "package.json");
  const packageJson = existsSync(packageJsonPath)
    ? readJsonSafe(packageJsonPath)
    : null;

  const configInRoot = CONFIG_NAMES.map((name) => join(e2eRoot, name)).find(
    (path) => existsSync(path),
  );

  const configPath =
    configInRoot ??
    findConfigFiles(e2eRoot, 0).find((path) => dirname(path) === e2eRoot) ??
    findConfigFiles(e2eRoot, 0)[0] ??
    null;

  const configSource = configPath ? readConfigText(configPath) : "";
  const framework = configPath
    ? detectFramework(configPath, configSource, packageJson)
    : packageJson && hasE2eDependency(packageJson)
      ? detectFramework("", "", packageJson)
      : "unknown";

  const testDir = configPath
    ? parseTestDir(configPath, configSource)
    : join(e2eRoot, framework === "cypress" ? "cypress/e2e" : "tests");

  const specFiles = walk(testDir.length > 0 ? testDir : e2eRoot)
    .filter((file) => !/\.(setup|seed)\./.test(basename(file)))
    .sort();

  const specs = specFiles.map((absolutePath) => {
    const source = readConfigText(absolutePath);
    const meta = extractSpecMetadata(source);
    return {
      path: relative(e2eRoot, absolutePath).replaceAll("\\", "/"),
      ...meta,
    };
  });

  return {
    e2e_root: relative(repoRoot, e2eRoot).replaceAll("\\", "/") || ".",
    framework,
    config_path: configPath
      ? relative(repoRoot, configPath).replaceAll("\\", "/")
      : null,
    test_dir: relative(repoRoot, testDir).replaceAll("\\", "/"),
    package_name: packageJson?.name ?? null,
    spec_glob: framework === "cypress" ? "**/*.{cy,spec}.{ts,js}" : "**/*.{spec,test}.{ts,js}",
    spec_count: specs.length,
    specs,
    score: 0,
  };
}

function collectCandidateRoots() {
  const roots = new Set();

  for (const hint of E2E_DIR_HINTS) {
    const path = join(repoRoot, hint);
    if (existsSync(path) && statSync(path).isDirectory()) {
      roots.add(resolve(path));
    }
  }

  for (const configPath of findConfigFiles(repoRoot)) {
    roots.add(resolve(dirname(configPath)));
  }

  walk(repoRoot)
    .filter((file) => /package\.json$/.test(file))
    .forEach((packagePath) => {
      const dir = dirname(packagePath);
      const packageJson = readJsonSafe(packagePath);
      if (hasE2eDependency(packageJson)) {
        roots.add(resolve(dir));
      }
    });

  return [...roots];
}

const candidates = collectCandidateRoots()
  .map(buildCandidate)
  .map((candidate) => ({ ...candidate, score: scoreCandidate(candidate) }))
  .sort((a, b) => b.score - a.score || b.spec_count - a.spec_count);

const primary = candidates[0] ?? null;

const manifest = {
  repo_root: repoRoot,
  discovered_at: new Date().toISOString(),
  primary: primary
    ? {
        e2e_root: primary.e2e_root,
        framework: primary.framework,
        config_path: primary.config_path,
        test_dir: primary.test_dir,
        spec_glob: primary.spec_glob,
        spec_count: primary.spec_count,
      }
    : null,
  candidates: candidates.map(({ score, ...candidate }) => ({
    ...candidate,
    confidence: score,
  })),
  matching_hints: {
    path_segments: [
      "auth",
      "account",
      "checkout",
      "cart",
      "storefront",
      "sign-in",
      "sign-up",
      "login",
      "register",
      "password",
    ],
    describe_and_test_titles: "Match journey names to spec describes/tests before guessing from path alone.",
  },
};

process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
