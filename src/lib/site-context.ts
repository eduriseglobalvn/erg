const DEFAULT_ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'erg.edu.local'
const DEFAULT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://erg.edu.vn'

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
  return value.split(':')[0]?.trim().toLowerCase()
}

function normalizeRootDomain(rootDomain?: string) {
  return stripPort(rootDomain || DEFAULT_ROOT_DOMAIN)
}

function detectProtocol(host: string, hostname: string): 'http' | 'https' {
  if (
    host.includes('localhost') ||
    hostname.includes('localhost') ||
    hostname.endsWith('.local')
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
  const host = normalizedRawHost || fallbackUrl.host
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
    isAdmin: siteKey === 'admin',
    protocol,
    baseUrl,
  }
}

export function resolveSiteContextFromHeaders(
  headerStore: Pick<Headers, 'get'> | { get(name: string): string | null }
) {
  const rawHost =
    headerStore.get('x-forwarded-host') ||
    headerStore.get('host') ||
    ''

  return resolveSiteContext(rawHost)
}
