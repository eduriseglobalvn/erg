import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { postsApi } from "@/services/posts.api"
import { useImageTracker } from "@/hooks/use-image-tracker"
import { localSeoAnalyzer } from "@/utils/local-seo"

export function useEditPost(
    id: string,
    editorInstance: import('@tiptap/core').Editor | null,
    contentOverride = "",
    contentBlocks?: unknown[] | null
) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const [title, setTitle] = useState("");
    const hasInitializedMetadata = useRef(false);
    const hasInitializedEditor = useRef(false);

    const [postMetadata, setPostMetadata] = useState({
        slug: "",
        excerpt: "",
        categoryId: "",
        thumbnailUrl: null as string | null,
        status: "draft",
        updatedAt: undefined as string | undefined
    });

    const { updateImages, getDeletedImages, cleanupDeletedImages } = useImageTracker();

    const getCurrentContent = () => contentOverride || editorInstance?.getHTML() || fetchedPost?.content || "";
    const getStructuredFields = (html: string) => ({
        contentHtml: html,
        ...(contentBlocks?.length ? { contentBlocks } : {}),
    });

    const { data: fetchedPost, isLoading } = useQuery({
        queryKey: ['post', id],
        queryFn: () => postsApi.getOne(id).then(res => res.data),
        enabled: !!id,
    })

    useEffect(() => {
        if (fetchedPost && !hasInitializedMetadata.current) {
            setTitle(fetchedPost.title || "");
            setPostMetadata({
                slug: fetchedPost.slug || "",
                excerpt: fetchedPost.excerpt || "",
                categoryId: fetchedPost.category?.id || "",
                thumbnailUrl: (fetchedPost as Record<string, unknown>).thumbnailUrl as string || null,
                status: (fetchedPost as Record<string, unknown>).status as string || "draft",
                updatedAt: (fetchedPost as Record<string, unknown>).updatedAt as string | undefined
            });
            hasInitializedMetadata.current = true;
        }
    }, [fetchedPost])

    useEffect(() => {
        if (fetchedPost && editorInstance && !hasInitializedEditor.current) {
            editorInstance.commands.setContent(fetchedPost.content || "");
            updateImages(fetchedPost.content || "");
            hasInitializedEditor.current = true;
        }
    }, [fetchedPost, editorInstance, updateImages])

    const updateMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            const currentContent = getCurrentContent();
            const deletedImages = getDeletedImages(currentContent);
            if (deletedImages.length > 0) {
                cleanupDeletedImages(deletedImages);
            }
            updateImages(currentContent);
            return postsApi.update(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', id] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success("Đã cập nhật bài viết thành công!")
            router.push('/posts')
        },
        onError: (error: Error) => {
            toast.error(error.message || "Lỗi khi cập nhật bài viết")
        }
    })

    const draftMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            const currentContent = getCurrentContent();
            updateImages(currentContent);
            return postsApi.update(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', id] });
            toast.success("Đã lưu bản nháp thành công!", { duration: 2000 })
        },
        onError: (error: Error) => {
            toast.error(error.message || "Lỗi khi lưu bản nháp")
        }
    })

    const handleSave = () => {
        if (!title.trim()) {
            toast.error("Vui lòng nhập tiêu đề bài viết")
            return
        }
        const content = getCurrentContent();
        const seoResult = localSeoAnalyzer(
            content,
            title,
            ((postMetadata as Record<string, unknown>).metaDescription as string) || "",
            ((postMetadata as Record<string, unknown>).keywords as string) || ""
        );

        updateMutation.mutate({
            ...postMetadata,
            title,
            content,
            ...getStructuredFields(content),
            focusKeyword: ((postMetadata as Record<string, unknown>).keywords as string) || "",
            seoScore: seoResult.overallScore,
            readabilityScore: seoResult.contentAnalysis.readabilityScore,
            keywordDensity: seoResult.contentAnalysis.keywordDensity
        })
    }

    const handleSaveDraft = () => {
        if (!title.trim()) {
            setTitle("Bản nháp không tiêu đề");
        }
        setPostMetadata(prev => ({ ...prev, status: "draft" }));
        const content = getCurrentContent();
        const finalTitle = title || "Bản nháp không tiêu đề";

        const seoResult = localSeoAnalyzer(
            content,
            finalTitle,
            ((postMetadata as Record<string, unknown>).metaDescription as string) || "",
            ((postMetadata as Record<string, unknown>).keywords as string) || ""
        );

        draftMutation.mutate({
            ...postMetadata,
            title: finalTitle,
            content,
            ...getStructuredFields(content),
            status: "draft",
            focusKeyword: ((postMetadata as Record<string, unknown>).keywords as string) || "",
            seoScore: seoResult.overallScore,
            readabilityScore: seoResult.contentAnalysis.readabilityScore,
            keywordDensity: seoResult.contentAnalysis.keywordDensity
        })
    }

    return {
        fetchedPost,
        isLoading,
        title,
        setTitle,
        postMetadata,
        setPostMetadata,
        handleSave,
        handleSaveDraft,
        isSaving: updateMutation.isPending || draftMutation.isPending,
    }
}
