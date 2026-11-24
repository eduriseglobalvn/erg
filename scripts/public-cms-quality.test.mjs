import assert from "node:assert/strict"
import { mkdir, mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"

import { auditPublicCmsBoundary } from "./check-public-cms-boundary.mjs"
import { auditPublicCmsBundle } from "./check-public-cms-bundle.mjs"
import { runPublicCmsSmoke } from "./public-cms-smoke.mjs"

async function fixture() {
    const root = await mkdtemp(join(tmpdir(), "erg-public-cms-"))
    const files = [
        "AGENTS.md",
        "docs/architecture/public-cms-quality-boundary.md",
        ".github/workflows/public-cms-quality.yml",
        "src/app/page.tsx",
        "src/app/@main/tin-tuc/page.tsx",
        "src/components/cms/owner.txt",
        "src/app/api/preview/route.ts",
        "src/app/api/rss/route.ts",
        "src/app/api/[...path]/route.ts",
    ]
    for (const relativePath of files) {
        const target = join(root, relativePath)
        await mkdir(join(target, ".."), { recursive: true })
        await writeFile(target, "ERG Public CMS Canonical ownership verify:public-cms quality:boundary bundle:check smoke:public", "utf8")
    }
    await writeFile(join(root, "package.json"), JSON.stringify({ scripts: {
        "quality:boundary": "node scripts/check-public-cms-boundary.mjs",
        "test:tiptap": "node --test scripts/tiptap-simple-editor-split.policy.test.mjs && bun test scripts/tiptap-image-upload.test.mjs scripts/tiptap-url-utils.test.mjs",
        "bundle:check": "node scripts/check-public-cms-bundle.mjs",
        "smoke:public": "node scripts/public-cms-smoke.mjs",
        "verify:public-cms": "bun run quality:boundary && bun run test:tiptap && bun run lint && bun run typecheck && bun run security:check && bun run build && bun run bundle:check",
    } }), "utf8")
    return root
}

const boundary = {
    repository: "erg",
    owner: "ERG Public CMS",
    ownedScopes: ["src/app/@main", "src/components/cms"],
    forbiddenOperationalScopes: ["src/features/lms"],
    routes: [
        { path: "/", source: "src/app/page.tsx" },
        { path: "/tin-tuc", source: "src/app/@main/tin-tuc/page.tsx" },
    ],
    apiRoutes: [
        { path: "/api/preview", source: "src/app/api/preview/route.ts" },
        { path: "/api/rss", source: "src/app/api/rss/route.ts" },
        { path: "/api/*", source: "src/app/api/[...path]/route.ts" },
    ],
    smokePaths: [{ path: "/", statuses: [200] }, { path: "/robots.txt", statuses: [200] }],
    bundle: { directory: ".next/static/chunks", maxTotalJsBytes: 1000, maxChunkJsBytes: 700 },
}

test("accepts a complete public CMS ownership and quality boundary", async () => {
    const root = await fixture()
    assert.deepEqual(await auditPublicCmsBoundary({ root, boundary }), { ok: true, findings: [] })
})

test("rejects missing route sources and copied operational scopes", async () => {
    const root = await fixture()
    await mkdir(join(root, "src/features/lms"), { recursive: true })
    const broken = structuredClone(boundary)
    broken.routes.push({ path: "/missing", source: "src/app/missing/page.tsx" })

    const result = await auditPublicCmsBoundary({ root, boundary: broken })
    assert.equal(result.ok, false)
    assert.ok(result.findings.some((item) => item.code === "MISSING_ROUTE_SOURCE"))
    assert.ok(result.findings.some((item) => item.code === "FORBIDDEN_OPERATIONAL_SCOPE"))
})

test("enforces total and individual JavaScript bundle budgets", async () => {
    const root = await fixture()
    const chunks = join(root, ".next/static/chunks")
    await mkdir(chunks, { recursive: true })
    await writeFile(join(chunks, "a.js"), "a".repeat(600))
    await writeFile(join(chunks, "b.js"), "b".repeat(300))
    assert.equal((await auditPublicCmsBundle({ root, bundle: boundary.bundle })).ok, true)
    await writeFile(join(chunks, "c.js"), "c".repeat(200))
    assert.equal((await auditPublicCmsBundle({ root, bundle: boundary.bundle })).ok, false)
})

test("smoke runner reports unexpected HTTP status", async () => {
    const result = await runPublicCmsSmoke({
        baseUrl: "http://127.0.0.1:3000",
        checks: boundary.smokePaths,
        fetchImpl: async (url) => new Response(null, { status: String(url).endsWith("robots.txt") ? 500 : 200 }),
    })
    assert.equal(result.ok, false)
    assert.deepEqual(result.results.map(({ status }) => status), [200, 500])
})
