'use client';

import { useTransition } from 'react';

const LOCALES = [
    { code: 'vi', label: 'VI', flag: '🇻🇳' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
] as const;

function setCookieAndReload(locale: string) {
    // Set cookie that expires in 1 year
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `NEXT_LOCALE=${locale}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    window.location.reload();
}

interface LanguageSwitcherProps {
    currentLocale?: string;
}

export function LanguageSwitcher({ currentLocale = 'vi' }: LanguageSwitcherProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex items-center gap-0.5 bg-white/10 rounded-full px-1 py-0.5 border border-white/20">
            {LOCALES.map((locale) => {
                const isActive = currentLocale === locale.code;
                return (
                    <button
                        key={locale.code}
                        onClick={() => {
                            if (!isActive) {
                                startTransition(() => {
                                    setCookieAndReload(locale.code);
                                });
                            }
                        }}
                        disabled={isPending}
                        title={locale.code === 'vi' ? 'Tiếng Việt' : 'English'}
                        className={`
                            flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-200
                            ${isActive
                                ? 'bg-white text-[#00008b] shadow-sm'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                            }
                            ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        <span>{locale.flag}</span>
                        <span>{locale.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
