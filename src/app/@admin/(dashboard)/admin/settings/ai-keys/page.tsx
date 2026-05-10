import { AIKeysPageClient } from "@/components/admin/settings/ai-keys-page-client"
import { createPageMetadata } from "@/utils/seo/page-metadata"

export const metadata = createPageMetadata({
    title: "AI API Keys | ERG Admin",
    description: "Quan ly AI API keys trong ERG Admin",
    path: "/admin/settings/ai-keys",
    imageAlt: "ERG Admin AI API keys",
    robots: { index: false, follow: false },
})

export default function AIKeysPage() {
    return <AIKeysPageClient />
}
