import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['vi', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'vi';

export default getRequestConfig(async () => {
    // 1. Check cookie first
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;

    // 2. Fall back to Accept-Language header
    const headerStore = await headers();
    const acceptLang = headerStore.get('accept-language') || '';
    const browserLocale = acceptLang.split(',')[0]?.split('-')[0]?.toLowerCase();

    // 3. Resolve locale with validation
    const resolved: Locale =
        locales.includes(cookieLocale as Locale)
            ? (cookieLocale as Locale)
            : locales.includes(browserLocale as Locale)
                ? (browserLocale as Locale)
                : defaultLocale;

    return {
        locale: resolved,
        messages: (await import(`../../messages/${resolved}/index.ts`)).default,
    };
});
