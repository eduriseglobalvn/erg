import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['vi', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'vi';

export default getRequestConfig(async () => {
    // 1. Check cookie first
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;

    // 3. Resolve locale with Geo / Browser Detection
    const headerStore = await headers();
    const country = headerStore.get('x-vercel-ip-country');
    const acceptLang = headerStore.get('accept-language') || '';
    const browserLocale = acceptLang.split(',')[0]?.split('-')[0]?.toLowerCase();

    // Mapping Strategy:
    // a. Cookie (User explicit choice)
    // b. Geolocation (Country-based)
    // c. Browser Locale (Language-based)
    // d. Default ('vi')
    
    let resolved: Locale = defaultLocale;

    if (locales.includes(cookieLocale as Locale)) {
        resolved = cookieLocale as Locale;
    } else if (country) {
        // If in Vietnam, always default to Vietnamese regardless of browser language
        // unless they have a cookie set from a previous choice.
        resolved = country === 'VN' ? 'vi' : 'en';
    } else if (locales.includes(browserLocale as Locale)) {
        resolved = browserLocale as Locale;
    } else {
        resolved = defaultLocale;
    }

    return {
        locale: resolved,
        messages: (await import(`../../messages/${resolved}/index.ts`)).default,
    };
});
