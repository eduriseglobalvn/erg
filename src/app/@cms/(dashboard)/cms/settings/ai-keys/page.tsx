import { AIKeysPageClient } from "@/components/cms/settings/ai-keys-page-client"
import { createPageMetadata } from "@/utils/seo/page-metadata"

export const metadata = createPageMetadata({
    title: "AI API Keys | ERG CMS",
    description: "Quan ly AI API keys trong ERG CMS",
    path: "/cms/settings/ai-keys",
    imageAlt: "ERG CMS AI API keys",
    robots: { index: false, follow: false },
})

export default function AIKeysPage() {
    return <AIKeysPageClient />
}
