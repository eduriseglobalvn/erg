import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { test } from "node:test";

const root = resolve(process.cwd());
const posts = join(root, "src/components/cms/posts");

const requiredOwners = [
  "visual-post-editor-workspace-shell.tsx",
  "use-visual-post-editor-controller.ts",
  "visual-post-editor-block-library.tsx",
  "visual-post-editor-presets.ts",
  "visual-post-editor-canvas.tsx",
  "visual-post-editor-side-panel.tsx",
  "visual-post-editor-inspectors.tsx",
  "visual-post-editor-types.ts",
];

test("visual post editor exposes a thin facade and explicit cohesion owners", async () => {
  const facade = await readFile(join(posts, "visual-post-editor-workspace.tsx"), "utf8");
  assert.ok(facade.split(/\r?\n/u).length < 250, "public facade must stay below 250 lines");
  assert.doesNotMatch(facade, /\buseState\b/u, "state belongs in the controller owner");

  for (const owner of requiredOwners) {
    await assert.doesNotReject(access(join(posts, owner)), `missing cohesion owner: ${owner}`);
  }
});

test("runtime owners stay reviewable", async () => {
  for (const owner of requiredOwners.filter((file) => !file.endsWith("presets.ts"))) {
    const source = await readFile(join(posts, owner), "utf8");
    assert.ok(source.split(/\r?\n/u).length < 500, `${owner} must stay below 500 lines`);
  }
});
