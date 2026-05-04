import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(content, needle, file) {
  assert(content.includes(needle), `${file} must include ${needle}`);
}

function assertExcludes(content, needle, file) {
  assert(!content.includes(needle), `${file} must not include ${needle}`);
}

function minVersion(actualRange, minimum) {
  const actual = actualRange.replace(/^[^\d]*/, '').split('.').map(Number);
  const expected = minimum.split('.').map(Number);

  for (let index = 0; index < expected.length; index += 1) {
    const actualPart = actual[index] ?? 0;
    const expectedPart = expected[index] ?? 0;
    if (actualPart > expectedPart) return true;
    if (actualPart < expectedPart) return false;
  }

  return true;
}

const proxyRoute = read('src/app/api/[...path]/route.ts');
assertIncludes(proxyRoute, 'validateMutationOrigin', 'src/app/api/[...path]/route.ts');
assertIncludes(proxyRoute, 'TRUSTED_REQUEST_HEADERS', 'src/app/api/[...path]/route.ts');
assertExcludes(proxyRoute, "'x-forwarded-for'", 'src/app/api/[...path]/route.ts');
assertExcludes(proxyRoute, "'x-real-ip'", 'src/app/api/[...path]/route.ts');

const crawlerStream = read('src/app/api/crawler/stream/route.ts');
assertExcludes(crawlerStream, "'Access-Control-Allow-Origin': '*'", 'src/app/api/crawler/stream/route.ts');
assertIncludes(crawlerStream, "'X-Content-Type-Options': 'nosniff'", 'src/app/api/crawler/stream/route.ts');

const nextConfig = read('next.config.ts');
assertExcludes(nextConfig, 'Access-Control-Allow-Origin', 'next.config.ts');

const siteContext = read('src/lib/site-context.ts');
assertIncludes(siteContext, 'KNOWN_SITE_SUBDOMAINS', 'src/lib/site-context.ts');
assertIncludes(siteContext, 'isAllowedSiteHost', 'src/lib/site-context.ts');
assertIncludes(siteContext, 'normalizeAllowedHost', 'src/lib/site-context.ts');

const sitemap = read('src/app/sitemap.ts');
assertIncludes(sitemap, 'new URLSearchParams({ domain: host })', 'src/app/sitemap.ts');

const robots = read('src/app/robots.ts');
assertIncludes(robots, 'resolveSiteContextFromHeaders', 'src/app/robots.ts');
assertExcludes(robots, "headersList.get('host')", 'src/app/robots.ts');

const sanitizer = read('src/utils/sanitize-html.ts');
assertIncludes(sanitizer, 'sanitizeInlineStyle', 'src/utils/sanitize-html.ts');
assertIncludes(sanitizer, 'data.keepAttr = false', 'src/utils/sanitize-html.ts');
assertIncludes(sanitizer, "property === '--erg-image-column'", 'src/utils/sanitize-html.ts');

const nextAuthPatch = read('patches/next-auth@4.24.14.patch');
assertIncludes(nextAuthPatch, 'function generateJti()', 'patches/next-auth@4.24.14.patch');
assertIncludes(nextAuthPatch, '.setJti(generateJti())', 'patches/next-auth@4.24.14.patch');

const schemaScript = read('src/components/seo/schema-script.tsx');
assertIncludes(schemaScript, 'safeAbsoluteUrl', 'src/components/seo/schema-script.tsx');
assertExcludes(schemaScript, 'https://${domain}', 'src/components/seo/schema-script.tsx');

const packageJson = JSON.parse(read('package.json'));
const deps = packageJson.dependencies;
const devDeps = packageJson.devDependencies;
const overrides = packageJson.overrides ?? {};

assert(minVersion(deps.next, '16.2.3'), 'next must be >= 16.2.3');
assert(minVersion(deps['next-intl'], '4.9.1'), 'next-intl must be >= 4.9.1');
assert(minVersion(deps.firebase, '12.12.1'), 'firebase must be >= 12.12.1');
assert(minVersion(devDeps.postcss, '8.5.10'), 'postcss must be >= 8.5.10');
assert(minVersion(devDeps['eslint-config-next'], '16.2.4'), 'eslint-config-next must be >= 16.2.4');
assert(minVersion(overrides['brace-expansion'], '1.1.13'), 'brace-expansion override must be >= 1.1.13');
assert(minVersion(overrides.lodash, '4.18.1'), 'lodash override must be >= 4.18.1');
assert(minVersion(overrides.postcss, '8.5.10'), 'postcss override must be >= 8.5.10');
assert(minVersion(overrides.protobufjs, '7.5.5'), 'protobufjs override must be >= 7.5.5');
assert(minVersion(overrides.uuid, '14.0.0'), 'uuid override must be >= 14.0.0');
assert(
  packageJson.patchedDependencies?.['next-auth@4.24.14'] === 'patches/next-auth@4.24.14.patch',
  'next-auth patch must remain registered so JWT generation does not require uuid'
);

console.log('Security regression checks passed.');
