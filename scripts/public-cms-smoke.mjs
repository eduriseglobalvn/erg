import { readFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

export async function runPublicCmsSmoke({ baseUrl, checks, fetchImpl = fetch }) {
    const results = []
    for (const check of checks) {
        try {
            const response = await fetchImpl(new URL(check.path, baseUrl))
            results.push({ path: check.path, status: response.status, ok: check.statuses.includes(response.status) })
        } catch (error) {
            results.push({ path: check.path, status: 0, ok: false, error: String(error) })
        }
    }
    return { ok: results.every((result) => result.ok), results }
}

const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds))

async function main() {
    const root = resolve(process.env.ERG_PUBLIC_CMS_ROOT ?? ".")
    const baseUrl = process.env.PUBLIC_CMS_BASE_URL ?? "http://127.0.0.1:3000"
    const boundary = JSON.parse(await readFile(join(root, "config/public-cms-boundary.json"), "utf8"))
    let result
    for (let attempt = 1; attempt <= 30; attempt += 1) {
        result = await runPublicCmsSmoke({ baseUrl, checks: boundary.smokePaths })
        if (result.ok || result.results.some((item) => item.status > 0)) break
        await delay(1000)
    }
    if (!result.ok) {
        console.error(JSON.stringify(result, null, 2))
        process.exitCode = 1
        return
    }
    console.log(`Public CMS smoke passed for ${result.results.map((item) => item.path).join(", ")}.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main()
