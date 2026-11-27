export type Article = {
  slug: string;
  date: string;
  cat: string;
  title: string;
  text: string;
  /** Longer opening paragraph shown in the featured card and article lead. */
  lead?: string;
  /** Only the design's sample article has the full sectioned body. */
  sample?: boolean;
  tags: string[];
  /** External articles (education digest) link out instead of to /tin-tuc/<slug>. */
  href?: string;
  image?: string;
};

export const NEWS_CATS = ['Tất cả', 'Tin tức ERG', 'Điểm tin giáo dục'];

export const NEWS: Article[] = [
  {
    slug: 'khoa-ban-tru-he-2026',
    date: '18/5/2026',
    cat: 'Tin tức ERG',
    title: 'Khóa bán trú hè 2026 tại ERG: Hè bứt phá - Kiến tạo tương lai',
    text: 'Chương trình bán trú hè 2026 của ERG tích hợp 5 môn cốt lõi theo từng độ tuổi, kết hợp học thuật, công nghệ và các cột mốc đầu ra rõ ràng.',
    lead: 'Chương trình bán trú hè 2026 của ERG tích hợp 5 môn cốt lõi theo từng độ tuổi, kết hợp học thuật, công nghệ và các cột mốc đầu ra rõ ràng cho học sinh.',
    sample: true,
    tags: ['Bán trú hè 2026', 'Tin tức ERG', '[THẺ]'],
  },
  {
    slug: 'tin-hoc-van-phong-ky-nang-bat-buoc',
    date: '16/5/2026',
    cat: 'Tin tức ERG',
    title: 'Tin học văn phòng – Kỹ năng bắt buộc trong thời đại số cùng ERG',
    text: 'Từ Word, Excel đến PowerPoint, ERG giúp người học xây nền kỹ năng tin học văn phòng bài bản, thực tế.',
    tags: ['Tin tức ERG'],
  },
  {
    slug: 'hoc-tin-hoc-tu-som',
    date: '14/5/2026',
    cat: 'Tin tức ERG',
    title: 'Học Tin học từ sớm – Mở rộng tương lai số cùng ERG - Edurise Global',
    text: 'Lộ trình học Tin học bài bản từ Tin học văn phòng, IC3, Scratch đến Python để từng bước làm chủ công nghệ.',
    tags: ['Tin tức ERG'],
  },
];
