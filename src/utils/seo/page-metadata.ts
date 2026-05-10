import type { Metadata } from 'next';

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  siteName?: string;
  robots?: Metadata['robots'];
};

const DEFAULT_OG_IMAGE = 'https://media.erg.edu.vn/logo/erg.png';

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt = 'Edurise Global',
  siteName = 'Edurise Global',
  robots,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      title,
      description,
      url: path,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    ...(robots && { robots }),
  };
}
