import assert from "node:assert/strict";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { tmpdir } from "node:os";

import { syncPhotography } from "../scripts/sync-photography.mjs";

test("syncPhotography publishes only one random image and writes a single-item manifest", async () => {
  const root = join(tmpdir(), `photo-sync-${Date.now()}`);
  await mkdir(root, { recursive: true });
  const sourceDir = join(root, "Lumix_Photo");
  const siteDir = join(root, "site");

  await mkdir(join(sourceDir, "武汉"), { recursive: true });
  await mkdir(siteDir, { recursive: true });
  await writeFile(join(sourceDir, "武汉", "东湖.jpg"), "jpg-content");
  await writeFile(join(sourceDir, "武汉", "黄鹤楼.png"), "png-content");
  await writeFile(join(sourceDir, "notes.txt"), "ignore me");

  const result = await syncPhotography({ sourceDir, siteDir, random: () => 0 });

  assert.equal(result.availableCount, 2);
  assert.equal(result.publishedCount, 1);
  await assert.doesNotReject(() => stat(join(siteDir, "pictures", "photography", "daily-photo.jpg")));
  assert.deepEqual(await readdir(join(siteDir, "pictures", "photography")), ["daily-photo.jpg"]);

  const manifest = await readFile(join(siteDir, "photography-manifest.js"), "utf8");
  assert.match(manifest, /window\.photographyImages/);
  assert.match(manifest, /东湖/);
  assert.match(manifest, /daily-photo\.jpg/);
  assert.doesNotMatch(manifest, /黄鹤楼/);
  assert.doesNotMatch(manifest, /notes\.txt/);
});
