import { copyFile, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function titleFromFilename(path) {
  const normalized = path.replaceAll("\\", "/");
  const filename = normalized.split("/").pop() || path;
  return filename.replace(/\.[^.]+$/, "");
}

async function collectImages(sourceDir, currentDir = sourceDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const images = [];

  for (const entry of entries) {
    const fullPath = join(currentDir, entry.name);

    if (entry.isDirectory()) {
      images.push(...await collectImages(sourceDir, fullPath));
      continue;
    }

    if (entry.isFile() && imageExtensions.has(extname(entry.name).toLowerCase())) {
      images.push({
        fullPath,
        relativePath: relative(sourceDir, fullPath)
      });
    }
  }

  return images.sort((left, right) => left.relativePath.localeCompare(right.relativePath, "zh-CN"));
}

function pickImage(images, random = Math.random) {
  if (images.length === 0) {
    throw new Error("No supported image files found in source folder.");
  }

  const index = Math.floor(random() * images.length);
  return images[Math.min(index, images.length - 1)];
}

function buildManifest(image, publishedFilename) {
  const manifestItems = [{
    title: titleFromFilename(image.relativePath),
    src: `./pictures/photography/${publishedFilename}`,
    description: "今日随机摄影作品。"
  }];

  return `window.photographyImages = ${JSON.stringify(manifestItems, null, 2)};\n`;
}

function runGit(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, { cwd, stdio: "inherit" });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`git ${args.join(" ")} failed with exit code ${code}`));
    });
  });
}

async function commitAndPush(siteDir, paths, message) {
  await runGit(["add", ...paths], siteDir);

  await new Promise((resolve, reject) => {
    const diff = spawn("git", ["diff", "--cached", "--quiet"], { cwd: siteDir });
    diff.on("error", reject);
    diff.on("exit", (code) => {
      if (code === 0) {
        resolve(false);
      } else if (code === 1) {
        resolve(true);
      } else {
        reject(new Error(`git diff --cached --quiet failed with exit code ${code}`));
      }
    });
  }).then(async (hasChanges) => {
    if (!hasChanges) {
      return;
    }

    await runGit(["commit", "-m", message], siteDir);
    await runGit(["push"], siteDir);
  });
}

export async function syncPhotography(options = {}) {
  const siteDir = options.siteDir || process.cwd();
  const sourceDir = options.sourceDir || "G:\\Lumix_Photo";
  const destinationDir = join(siteDir, "pictures", "photography");
  const publishedFilename = options.publishedFilename || "daily-photo.jpg";
  const publishedPath = join(destinationDir, publishedFilename);
  const manifestPath = join(siteDir, "photography-manifest.js");

  await stat(sourceDir);
  const images = await collectImages(sourceDir);
  const selectedImage = pickImage(images, options.random);

  await rm(destinationDir, { recursive: true, force: true });
  await mkdir(destinationDir, { recursive: true });
  await copyFile(selectedImage.fullPath, publishedPath);
  await writeFile(manifestPath, buildManifest(selectedImage, publishedFilename), "utf8");

  if (options.commitAndPush) {
    await commitAndPush(
      siteDir,
      ["photography-manifest.js", `pictures/photography/${publishedFilename}`],
      options.commitMessage || "chore: update daily photography"
    );
  }

  return {
    availableCount: images.length,
    publishedCount: 1,
    selectedImage: selectedImage.relativePath,
    sourceDir,
    destinationDir,
    publishedPath,
    manifestPath
  };
}

async function main() {
  const sourceArgIndex = process.argv.indexOf("--source");
  const sourceDir = sourceArgIndex >= 0 ? process.argv[sourceArgIndex + 1] : undefined;
  const siteArgIndex = process.argv.indexOf("--site");
  const siteDir = siteArgIndex >= 0 ? process.argv[siteArgIndex + 1] : undefined;
  const result = await syncPhotography({
    sourceDir,
    siteDir,
    commitAndPush: process.argv.includes("--commit-and-push")
  });

  console.log(`Found ${result.availableCount} photography image(s).`);
  console.log(`Published 1 daily image: ${result.selectedImage}`);
  console.log(`Source: ${result.sourceDir}`);
  console.log(`Destination: ${result.publishedPath}`);
  console.log(`Manifest: ${result.manifestPath}`);
}

const isCli = process.argv[1] === fileURLToPath(import.meta.url);

if (isCli) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
