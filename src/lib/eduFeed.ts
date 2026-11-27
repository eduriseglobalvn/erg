// "Điểm tin giáo dục": latest items from Báo Giáo dục và Thời đại's education RSS, fetched at build time.
import type { Article } from '@/data/news';

const FEED = 'https://giaoducthoidai.vn/rss/giao-duc-17.rss';

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? m[1].replace(/^<!\[CDATA\[|\]\]>$/g, '').trim() : '';
};
const text = (html: string) =>
  html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

export function parseFeed(xml: string, limit = 12): Article[] {
  return xml.split('<item>').slice(1, limit + 1).map((item) => {
    const link = tag(item, 'link');
    const d = new Date(tag(item, 'pubDate'));
    // The description holds an image link, the summary <p>, then a list of related links we drop.
    const summary = text(tag(item, 'description').match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? '').replace(/^GD&TĐ\s*[-–]\s*/, '');
    return {
      slug: link.split('/').pop()!.replace(/\.html$/, ''),
      date: isNaN(+d) ? '' : d.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: 'numeric', month: 'numeric', year: 'numeric' }),
      cat: 'Điểm tin giáo dục',
      title: text(tag(item, 'title')),
      text: summary,
      tags: [],
      href: link,
      image: tag(item, 'thumb') || undefined,
    };
  }).filter((a) => a.title && a.href.startsWith('https://giaoducthoidai.vn/'));
}

// A feed outage must not break the deploy: the tab then just shows no digest items.
export async function fetchEduNews(): Promise<Article[]> {
  try {
    const res = await fetch(FEED, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseFeed(await res.text());
  } catch (e) {
    console.warn(`[eduFeed] ${FEED} unavailable, digest left empty:`, e);
    return [];
  }
}
