"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';

// Sắp tới sẽ fetch API cấu hình từ Backend theo subdomain
// Tạm thời để Mockup Configuration
const getSubdomainSeoConfig = (subdomain: string) => {
    return {
        siteName: "EduRise Global",
        googleVerification: "your-google-verification-code",
        bingVerification: "your-bing-verification-code",
        yandexVerification: "your-yandex-code",
        baiduVerification: "your-baidu-code",
    };
};

export function SearchEngineMeta({ subdomain }: { subdomain: string }) {
    const { data: configData } = useQuery({
        queryKey: ['seo-config', subdomain],
        queryFn: () => seoApi.getConfig('webmaster_verification', { requireAuth: false }).then(res => res.data).catch(() => null)
    });

    const defaultConfig = getSubdomainSeoConfig(subdomain);
    const config = configData || defaultConfig;

    return (
        <>
            {/* Google */}
            {config.googleVerification && (
                <meta name="google-site-verification" content={config.googleVerification} />
            )}

            {/* Bing */}
            {config.bingVerification && (
                <meta name="msvalidate.01" content={config.bingVerification} />
            )}

            {/* Yandex */}
            {config.yandexVerification && (
                <meta name="yandex-verification" content={config.yandexVerification} />
            )}

            {/* Baidu */}
            {config.baiduVerification && (
                <meta name="baidu-site-verification" content={config.baiduVerification} />
            )}

            {/* Apple */}
            <meta name="apple-mobile-web-app-title" content={config.siteName || defaultConfig.siteName} />
            <meta name="apple-mobile-web-app-capable" content="yes" />

            {/* CocCoc: không cần meta riêng, chỉ cần robots.txt đúng + content tốt */}
        </>
    );
}
