import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { Editor } from "@tiptap/core"
import { toast } from "sonner"
import { postsApi } from "@/services/posts.api"
import { localSeoAnalyzer } from "@/utils/local-seo"

export function useCreatePost(editorInstance: Editor | null) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");

    const [postMetadata, setPostMetadata] = useState({
        slug: "",
        excerpt: "",
        categoryId: "",
        thumbnailUrl: null as string | null,
        status: "draft"
    });

    const createMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => await postsApi.create(data) as { data?: { id: string }, id?: string },
        onSuccess: (res: { data?: { id: string }, id?: string }) => {
            const id = res.data?.id || res.id;
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success("Đã đăng bài viết thành công!");
            router.push(`/posts/${id}/edit`);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Lỗi khi đăng bài viết");
        }
    })

    const handleSave = () => {
        if (!title.trim()) {
            toast.error("Vui lòng nhập tiêu đề bài viết");
            return;
        }

        const content = editorInstance?.getHTML() || "";
        const seoResult = localSeoAnalyzer(
            content,
            title,
            ((postMetadata as Record<string, unknown>).metaDescription as string) || "",
            ((postMetadata as Record<string, unknown>).keywords as string) || ""
        );

        createMutation.mutate({
            ...postMetadata,
            title,
            content,
            focusKeyword: ((postMetadata as Record<string, unknown>).keywords as string) || "",
            seoScore: seoResult.overallScore,
            readabilityScore: seoResult.contentAnalysis.readabilityScore,
            keywordDensity: seoResult.contentAnalysis.keywordDensity
        });
    };

    const handleSaveDraft = () => {
        if (!title.trim()) {
            setTitle("Bản nháp mới");
        }

        const content = editorInstance?.getHTML() || "";
        const finalTitle = title || "Bản nháp mới";

        const seoResult = localSeoAnalyzer(
            content,
            finalTitle,
            ((postMetadata as Record<string, unknown>).metaDescription as string) || "",
            ((postMetadata as Record<string, unknown>).keywords as string) || ""
        );

        createMutation.mutate({
            ...postMetadata,
            title: finalTitle,
            content,
            status: "draft",
            focusKeyword: ((postMetadata as Record<string, unknown>).keywords as string) || "",
            seoScore: seoResult.overallScore,
            readabilityScore: seoResult.contentAnalysis.readabilityScore,
            keywordDensity: seoResult.contentAnalysis.keywordDensity
        })
    }

    return {
        title,
        setTitle,
        postMetadata,
        setPostMetadata,
        handleSave,
        handleSaveDraft,
        isSaving: createMutation.isPending
    }
}
