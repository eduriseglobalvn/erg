export const RSS_SOURCE_URL = 'https://giaoducthoidai.vn/rss/giao-duc-17.rss'
export const DEFAULT_NEWS_IMAGE = 'https://media.erg.edu.vn/posts/default-thumbnail.webp'

export interface RssNewsItem {
  id?: string
  title: string
  pubDate: string
  link: string
  thumbnail: string
  description: string
  source: 'RSS'
}

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function unwrapCdata(value: string) {
  return value
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .trim()
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function getTagContent(source: string, tagName: string) {
  const pattern = new RegExp(
    `<${escapeRegex(tagName)}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapeRegex(tagName)}>`,
    'i'
  )
  const match = source.match(pattern)

  if (!match?.[1]) {
    return ''
  }

  return decodeXmlEntities(unwrapCdata(match[1]))
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractImage(source: string) {
  if (!source) {
    return DEFAULT_NEWS_IMAGE
  }

  const match = source.match(/<img[^>]+src=['"]([^'"]+)['"]/i)
  const src = match?.[1]?.trim()

  if (!src) {
    return DEFAULT_NEWS_IMAGE
  }

  return src.startsWith('/') ? `https://giaoduc.edu.vn${src}` : src
}

export function parseRssItemsFromXml(xml: string): RssNewsItem[] {
  const items = Array.from(xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi))

  return items
    .map((match) => {
      const itemXml = match[1]
      const descriptionHtml = getTagContent(itemXml, 'description')
      const encodedContent = getTagContent(itemXml, 'content:encoded')
      const link =
        getTagContent(itemXml, 'guid') ||
        getTagContent(itemXml, 'link')

      return {
        title: getTagContent(itemXml, 'title'),
        pubDate: getTagContent(itemXml, 'pubDate'),
        link,
        thumbnail:
          extractImage(encodedContent) !== DEFAULT_NEWS_IMAGE
            ? extractImage(encodedContent)
            : extractImage(descriptionHtml),
        description: stripHtml(descriptionHtml),
        source: 'RSS' as const,
      }
    })
    .filter((item) => item.title && item.link)
    .sort(
      (left, right) =>
        new Date(right.pubDate).getTime() - new Date(left.pubDate).getTime()
    )
}
