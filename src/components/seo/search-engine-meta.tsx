import { getPreferredBackendBaseUrl } from '@/lib/backend-url';

interface SearchEngineConfig {
    siteName?: string;
    googleVerification?: string;
    bingVerification?: string;
    yandexVerification?: string;
    baiduVerification?: string;
}

const getSubdomainSeoConfig = (_subdomain: string): SearchEngineConfig => {
    return {
        siteName: "EduRise Global",
    };
};

async function getSearchEngineConfig(): Promise<SearchEngineConfig | null> {
    try {
        const apiUrl = getPreferredBackendBaseUrl();
        const response = await fetch(
            `${apiUrl}/api/seo/config/webmaster_verification`,
            {
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) {
            return null;
        }

        const payload = await response.json();
        return (payload.data || payload) as SearchEngineConfig;
    } catch (error) {
        return null;
    }
}

export async function SearchEngineMeta({ subdomain }: { subdomain: string }) {
    const configData = await getSearchEngineConfig();

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
