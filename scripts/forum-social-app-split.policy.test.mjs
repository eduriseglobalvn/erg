import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import { test } from "node:test"

const forum = join(resolve("."), "src/components/forum")
const owners = [
    "forum-social-app-shell.tsx",
    "use-forum-social-controller.ts",
    "forum-social-model.ts",
    "forum-social-data.ts",
    "forum-social-layout.tsx",
    "forum-social-composer.tsx",
    "forum-social-post.tsx",
    "forum-social-primitives.tsx",
    "forum-social-types.ts",
]

test("forum social app is a thin facade over reviewable cohesion owners", async () => {
    const facade = await readFile(join(forum, "forum-social-app.tsx"), "utf8")
    assert.ok(facade.split(/\r?\n/u).length < 250)
    assert.doesNotMatch(facade, /\buseState\b/u)
    for (const owner of owners) await assert.doesNotReject(access(join(forum, owner)), `missing ${owner}`)
})

test("forum runtime owners remain below 500 lines", async () => {
    for (const owner of owners) {
        const source = await readFile(join(forum, owner), "utf8")
        assert.ok(source.split(/\r?\n/u).length < 500, `${owner} exceeds 500 lines`)
    }
})
