import { readdir, readFile, stat } from "node:fs/promises"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

async function jsFiles(directory) {
    const files = []
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name)
        if (entry.isDirectory()) files.push(...await jsFiles(path))
        else if (entry.isFile() && entry.name.endsWith(".js")) files.push(path)
    }
    return files
}

export async function auditPublicCmsBundle({ root, bundle }) {
    const directory = join(root, bundle.directory)
    const files = await jsFiles(directory)
    const chunks = await Promise.all(files.map(async (path) => ({ path, bytes: (await stat(path)).size })))
    const totalBytes = chunks.reduce((sum, chunk) => sum + chunk.bytes, 0)
    const oversized = chunks.filter((chunk) => chunk.bytes > bundle.maxChunkJsBytes)
    return {
        ok: totalBytes <= bundle.maxTotalJsBytes && oversized.length === 0,
        files: chunks.length,
        totalBytes,
        maxTotalJsBytes: bundle.maxTotalJsBytes,
        maxChunkJsBytes: bundle.maxChunkJsBytes,
        oversized,
    }
}

async function main() {
    const root = resolve(process.env.ERG_PUBLIC_CMS_ROOT ?? ".")
    const boundary = JSON.parse(await readFile(join(root, "config/public-cms-boundary.json"), "utf8"))
    const result = await auditPublicCmsBundle({ root, bundle: boundary.bundle })
    if (!result.ok) {
        console.error(JSON.stringify(result, null, 2))
        process.exitCode = 1
        return
    }
    console.log(`Public CMS bundle passed: ${result.files} chunks, ${result.totalBytes}/${result.maxTotalJsBytes} bytes.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main()
