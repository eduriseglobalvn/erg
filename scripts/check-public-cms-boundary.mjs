import { access, readFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

const EXPECTED_SCRIPTS = {
    "quality:boundary": "node scripts/check-public-cms-boundary.mjs",
    "test:tiptap": "node --test scripts/tiptap-simple-editor-split.policy.test.mjs && bun test scripts/tiptap-image-upload.test.mjs scripts/tiptap-url-utils.test.mjs",
    "bundle:check": "node scripts/check-public-cms-bundle.mjs",
    "smoke:public": "node scripts/public-cms-smoke.mjs",
    "verify:public-cms": "bun run quality:boundary && bun run test:tiptap && bun run lint && bun run typecheck && bun run security:check && bun run build && bun run bundle:check",
}

async function exists(path) {
    try {
        await access(path)
        return true
    } catch {
        return false
    }
}

export async function loadPublicCmsBoundary(root) {
    return JSON.parse(await readFile(join(root, "config/public-cms-boundary.json"), "utf8"))
}

export async function auditPublicCmsBoundary({ root, boundary }) {
    const findings = []
    if (boundary.repository !== "erg" || !boundary.owner) {
        findings.push({ code: "INVALID_OWNER", path: "config/public-cms-boundary.json" })
    }

    for (const scope of boundary.ownedScopes ?? []) {
        if (!(await exists(join(root, scope)))) findings.push({ code: "MISSING_OWNED_SCOPE", path: scope })
    }
    for (const scope of boundary.forbiddenOperationalScopes ?? []) {
        if (await exists(join(root, scope))) findings.push({ code: "FORBIDDEN_OPERATIONAL_SCOPE", path: scope })
    }
    for (const route of [...(boundary.routes ?? []), ...(boundary.apiRoutes ?? [])]) {
        if (!(await exists(join(root, route.source)))) {
            findings.push({ code: "MISSING_ROUTE_SOURCE", path: route.source, route: route.path })
        }
    }
    if (!(boundary.smokePaths?.length > 0)) {
        findings.push({ code: "MISSING_SMOKE_PATHS", path: "config/public-cms-boundary.json" })
    }

    for (const [path, markers] of [
        ["AGENTS.md", ["Public CMS", "Canonical ownership"]],
        ["docs/architecture/public-cms-quality-boundary.md", ["ERG Public CMS", "bundle", "smoke"]],
        [".github/workflows/public-cms-quality.yml", ["verify:public-cms", "smoke:public"]],
    ]) {
        const target = join(root, path)
        if (!(await exists(target))) {
            findings.push({ code: "MISSING_GOVERNANCE_FILE", path })
            continue
        }
        const content = await readFile(target, "utf8")
        for (const marker of markers) {
            if (!content.includes(marker)) findings.push({ code: "MISSING_GOVERNANCE_MARKER", path, marker })
        }
    }

    const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"))
    for (const [name, command] of Object.entries(EXPECTED_SCRIPTS)) {
        if (packageJson.scripts?.[name] !== command) {
            findings.push({ code: "MISSING_PACKAGE_COMMAND", path: "package.json", command: name })
        }
    }

    return { ok: findings.length === 0, findings }
}

async function main() {
    const root = resolve(process.env.ERG_PUBLIC_CMS_ROOT ?? ".")
    const boundary = await loadPublicCmsBoundary(root)
    const result = await auditPublicCmsBoundary({ root, boundary })
    if (!result.ok) {
        for (const finding of result.findings) console.error(`${finding.code} ${finding.path}`)
        process.exitCode = 1
        return
    }
    console.log("Public CMS ownership, route/API, bundle and smoke boundary passed.")
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main()
