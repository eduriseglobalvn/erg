import { describe, expect, test } from "bun:test"
import { createImageUploader, MAX_FILE_SIZE } from "../src/lib/tiptap-image-upload"

const file = (size) => ({ name: "image.png", size })

describe("Tiptap image upload", () => {
  test("rejects files over 5 MB before loading the API", async () => {
    let loads = 0
    const upload = createImageUploader(async () => {
      loads += 1
      return { uploadImage: async () => ({ url: "/unused" }), deleteImage: async () => undefined }
    })

    await expect(upload(file(MAX_FILE_SIZE + 1))).rejects.toThrow("File size exceeds maximum allowed (5MB)")
    expect(loads).toBe(0)
  })

  test("rejects an already-aborted upload before loading the API", async () => {
    const controller = new AbortController()
    controller.abort()
    let loads = 0
    const upload = createImageUploader(async () => {
      loads += 1
      return { uploadImage: async () => ({ url: "/unused" }), deleteImage: async () => undefined }
    })

    await expect(upload(file(1), undefined, controller.signal)).rejects.toThrow("Upload cancelled")
    expect(loads).toBe(0)
  })

  test("reports stable progress and returns the backend URL", async () => {
    const progress = []
    const upload = createImageUploader(async () => ({
      uploadImage: async () => ({ url: "/images/result.png" }),
      deleteImage: async () => undefined,
    }))

    await expect(upload(file(1), event => progress.push(event.progress))).resolves.toBe("/images/result.png")
    expect(progress).toEqual([10, 30, 90, 100])
  })

  test("deletes an uploaded image when cancellation wins after upload", async () => {
    const controller = new AbortController()
    const deleted = []
    const upload = createImageUploader(async () => ({
      uploadImage: async () => {
        controller.abort()
        return { url: "/images/orphan.png" }
      },
      deleteImage: async url => { deleted.push(url) },
    }))

    await expect(upload(file(1), undefined, controller.signal)).rejects.toThrow("Upload cancelled")
    expect(deleted).toEqual(["/images/orphan.png"])
  })
})
