export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

type PostsImageApi = {
  uploadImage(file: File): Promise<{ url: string }>
  deleteImage(url: string): Promise<unknown>
}

type PostsImageApiLoader = () => Promise<PostsImageApi>

export const createImageUploader = (loadApi: PostsImageApiLoader) => async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  if (!file) throw new Error("No file provided")
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`)
  }
  if (abortSignal?.aborted) throw new Error("Upload cancelled")

  try {
    onProgress?.({ progress: 10 })
    const postsApi = await loadApi()
    onProgress?.({ progress: 30 })
    const result = await postsApi.uploadImage(file)
    onProgress?.({ progress: 90 })

    if (abortSignal?.aborted) {
      try {
        await postsApi.deleteImage(result.url)
      } catch (error) {
        console.error("Failed to delete aborted upload:", error)
      }
      throw new Error("Upload cancelled")
    }

    onProgress?.({ progress: 100 })
    return result.url
  } catch (error) {
    if (abortSignal?.aborted) throw new Error("Upload cancelled")
    throw error
  }
}

export const handleImageUpload = createImageUploader(async () => {
  const { postsApi } = await import("@/services/posts.api")
  return postsApi
})
