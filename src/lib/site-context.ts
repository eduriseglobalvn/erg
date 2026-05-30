const DEFAULT_ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
  (process.env.NODE_ENV === 'production' ? 'erg.edu.vn' : 'erg.edu.local')
const DEFAULT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://erg.edu.vn'
const KNOWN_SITE_SUBDOMAINS = new Set([
  'cms',
  'ai',
  'congdanso',
  'dientoandammay',
  'elearning',
  'elerning',
  'forum',
  'tinhocquocgia',
  'tinhocquocte',
  'tinhocthieunhi',
  'tuyendung',
])

export interface SiteContext {
  rawHost: string
  host: string
  hostname: string
  rootDomain: string
  subdomain: string
  siteKey: string
  isRoot: boolean
  isAdmin: boolean
  protocol: 'http' | 'https'
  baseUrl: string
}

function firstForwardedValue(value: string) {
  return value.split(',')[0]?.trim() || ''
}

function stripPort(value: string) {
  const normalized = value.trim().toLowerCase()

  if (!normalized) return ''

  if (normalized.startsWith('[')) {
    const closingBracketIndex = normalized.indexOf(']')
    return closingBracketIndex > -1
      ? normalized.slice(1, closingBracketIndex)
      : normalized
  }

  if ((normalized.match(/:/g) || []).length > 1) {
    return normalized
  }

  return normalized.split(':')[0]?.trim() || ''
}

function normalizeRootDomain(rootDomain?: string) {
  return stripPort(rootDomain || DEFAULT_ROOT_DOMAIN)
}

function configuredAllowedHosts() {
  return (process.env.NEXT_PUBLIC_ALLOWED_HOSTS || process.env.ALLOWED_HOSTS || '')
    .split(',')
    .map((host) => stripPort(host))
    .filter(Boolean)
}

export function isAllowedSiteHost(rawHost: string, rootDomain?: string) {
  const normalizedRawHost = firstForwardedValue(rawHost)
  const hostname = stripPort(normalizedRawHost)
  const normalizedRootDomain = normalizeRootDomain(rootDomain)

  if (!hostname) return false

  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return true
  }

  if (configuredAllowedHosts().includes(hostname)) {
    return true
  }

  if (hostname === normalizedRootDomain || hostname === `www.${normalizedRootDomain}`) {
    return true
  }

  const subdomain = getSubdomain(hostname, normalizedRootDomain)
  return Boolean(subdomain && KNOWN_SITE_SUBDOMAINS.has(subdomain))
}

function normalizeAllowedHost(rawHost: string, rootDomain?: string) {
  const normalizedRawHost = firstForwardedValue(rawHost)
  if (isAllowedSiteHost(normalizedRawHost, rootDomain)) {
    return normalizedRawHost
  }

  return new URL(DEFAULT_PUBLIC_BASE_URL).host
}

function detectProtocol(host: string, hostname: string): 'http' | 'https' {
  if (
    host.includes('localhost') ||
    hostname.includes('localhost') ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.endsWith('.local') ||
    (process.env.NODE_ENV !== 'production' && /:\d+$/.test(host))
  ) {
    return 'http'
  }

  return 'https'
}

export function getSubdomain(hostname: string, rootDomain?: string) {
  const normalizedHostname = stripPort(hostname)
  const normalizedRootDomain = normalizeRootDomain(rootDomain)

  if (
    !normalizedHostname ||
    normalizedHostname === normalizedRootDomain ||
    normalizedHostname === `www.${normalizedRootDomain}`
  ) {
    return ''
  }

  if (normalizedHostname.endsWith(`.${normalizedRootDomain}`)) {
    return normalizedHostname.slice(0, -(normalizedRootDomain.length + 1))
  }

  return ''
}

export function normalizeSiteKey(subdomain: string) {
  if (!subdomain || subdomain === 'www') {
    return 'main'
  }

  if (subdomain === 'elerning') {
    return 'elearning'
  }

  return subdomain
}

export function resolveSiteContext(rawHost: string, rootDomain?: string): SiteContext {
  const normalizedRawHost = firstForwardedValue(rawHost)
  const fallbackUrl = new URL(DEFAULT_PUBLIC_BASE_URL)
  const host = normalizeAllowedHost(normalizedRawHost || fallbackUrl.host, rootDomain)
  const hostname = stripPort(host) || fallbackUrl.hostname
  const normalizedRootDomain = normalizeRootDomain(rootDomain)
  const subdomain = getSubdomain(hostname, normalizedRootDomain)
  const siteKey = normalizeSiteKey(subdomain)
  const protocol = detectProtocol(host, hostname)
  const baseUrl = `${protocol}://${host || fallbackUrl.host}`

  return {
    rawHost: normalizedRawHost,
    host,
    hostname,
    rootDomain: normalizedRootDomain,
    subdomain,
    siteKey,
    isRoot: siteKey === 'main',
    isAdmin: siteKey === 'cms',
    protocol,
    baseUrl,
  }
}

export function resolveSiteContextFromHeaders(
  headerStore: Pick<Headers, 'get'> | { get(name: string): string | null }
) {
  const forwardedHost = headerStore.get('x-forwarded-host') || ''
  const host = headerStore.get('host') || ''
  const rawHost = isAllowedSiteHost(forwardedHost) ? forwardedHost : host

  return resolveSiteContext(rawHost)
}
