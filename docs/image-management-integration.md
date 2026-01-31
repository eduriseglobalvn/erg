# Image Management Integration - Implementation Summary

## 📋 Tổng Quan

Đã hoàn thành tích hợp quản lý ảnh cho Post Editor theo đúng spec từ Backend:
- ✅ Upload ảnh qua API `/api/posts/images/upload`
- ✅ Tự động xóa ảnh bị remove khỏi content
- ✅ Track images trong editor để cleanup storage

---

## 🔧 Files Modified

### 1. **`src/services/posts.api.ts`**
Thêm 2 API methods mới:

```typescript
uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await httpClient<{ 
        statusCode: number; 
        message: string; 
        data: { url: string } 
    }>('/posts/images/upload', {
        method: 'POST',
        body: formData,
    });
    
    return response.data;
},

deleteImage: async (url: string): Promise<void> => {
    await httpClient('/posts/images', {
        method: 'DELETE',
        body: JSON.stringify({ url }),
    });
},
```

**Lý do**: Cần API client để gọi từ editor và cleanup logic.

---

### 2. **`src/lib/tiptap-utils.ts`**
Sửa `handleImageUpload` từ demo → real API:

**Before:**
```typescript
// Demo simulation với fake progress
for (let progress = 0; progress <= 100; progress += 10) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    onProgress?.({ progress })
}
return "/images/tiptap-ui-placeholder-image.jpg"
```

**After:**
```typescript
// Real API upload với progress tracking
const { postsApi } = await import('@/services/posts.api')
onProgress?.({ progress: 30 })

const result = await postsApi.uploadImage(file)
onProgress?.({ progress: 90 })

// Handle abort + cleanup
if (abortSignal?.aborted) {
    await postsApi.deleteImage(result.url)
    throw new Error("Upload cancelled")
}

return result.url
```

**Features:**
- ✅ Dynamic import để tránh circular dependency
- ✅ Progress tracking (10% → 30% → 90% → 100%)
- ✅ Abort handling với auto cleanup
- ✅ Error handling

---

### 3. **`src/hooks/use-image-tracker.ts`** (NEW)
Custom hook để track images trong HTML content:

```typescript
export function useImageTracker() {
    const previousImagesRef = useRef<Set<string>>(new Set());

    // Extract URLs từ HTML
    const extractImageUrls = (htmlContent: string): string[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const images = doc.querySelectorAll('img');
        
        return Array.from(images)
            .map(img => img.getAttribute('src'))
            .filter(src => src?.includes('media.erg.edu.vn'));
    };

    // Update danh sách ảnh hiện tại
    const updateImages = (htmlContent: string) => {
        const currentUrls = extractImageUrls(htmlContent);
        previousImagesRef.current = new Set(currentUrls);
    };

    // Tìm ảnh bị xóa
    const getDeletedImages = (newHtmlContent: string): string[] => {
        const currentUrls = new Set(extractImageUrls(newHtmlContent));
        const deletedUrls: string[] = [];

        previousImagesRef.current.forEach(url => {
            if (!currentUrls.has(url)) {
                deletedUrls.push(url);
            }
        });

        return deletedUrls;
    };

    // Cleanup ảnh bị xóa
    const cleanupDeletedImages = async (deletedUrls: string[]) => {
        const deletePromises = deletedUrls.map(url =>
            postsApi.deleteImage(url).catch(err => {
                console.error(`Failed to delete image ${url}:`, err);
            })
        );
        await Promise.allSettled(deletePromises);
    };

    return {
        updateImages,
        getDeletedImages,
        cleanupDeletedImages,
        extractImageUrls,
    };
}
```

**Logic:**
1. **Extract**: Parse HTML → lấy tất cả `<img src="...">`
2. **Filter**: Chỉ lấy ảnh từ `media.erg.edu.vn` (bỏ qua external/base64)
3. **Compare**: So sánh previous vs current để tìm ảnh bị xóa
4. **Cleanup**: Gọi API delete cho từng ảnh (parallel)

---

### 4. **`src/app/@admin/(dashboard)/admin/posts/[id]/edit/page.tsx`**
Tích hợp image tracking vào edit flow:

**Changes:**

```typescript
// Import hook
import { useImageTracker } from "@/hooks/use-image-tracker"

// Initialize hook
const { updateImages, getDeletedImages, cleanupDeletedImages } = useImageTracker();

// Track initial images khi load post
useEffect(() => {
    if (fetchedPost && !hasInitialized.current) {
        // ... existing code ...
        if (editorInstance) {
            editorInstance.commands.setContent(fetchedPost.content || "");
            updateImages(fetchedPost.content || ""); // ← NEW
            hasInitialized.current = true;
        }
    }
}, [fetchedPost, editorInstance, updateImages])

// Cleanup khi save
const updateMutation = useMutation({
    mutationFn: async (data: any) => {
        const currentContent = editorInstance?.getHTML() || "";
        
        // Tìm ảnh bị xóa
        const deletedImages = getDeletedImages(currentContent);
        
        // Cleanup (background, không chờ)
        if (deletedImages.length > 0) {
            cleanupDeletedImages(deletedImages);
        }
        
        // Update tracker
        updateImages(currentContent);
        
        // Save post
        return postsApi.update(id, data);
    },
    // ... rest
})
```

**Flow:**
1. **Load**: Track initial images từ `fetchedPost.content`
2. **Edit**: User thêm/xóa ảnh trong editor
3. **Save**: 
   - So sánh current vs previous
   - Cleanup ảnh bị xóa (background)
   - Update tracker với content mới
   - Gọi API update post

---

## 🎯 Workflow Chi Tiết

### A. Upload Ảnh (User chèn ảnh vào editor)

```
1. User kéo thả/chọn ảnh
   ↓
2. TipTap gọi handleImageUpload(file)
   ↓
3. Validate file (size, type)
   ↓
4. POST /api/posts/images/upload với FormData
   ↓
5. Backend: Resize → WebP → Upload R2 → Return URL
   ↓
6. Frontend: Chèn <img src="URL" /> vào editor
```

**Code trong editor:**
```typescript
ImageUploadNode.configure({
    accept: "image/*",
    maxSize: MAX_FILE_SIZE,
    upload: handleImageUpload, // ← Hàm đã sửa
})
```

---

### B. Xóa Ảnh (User xóa ảnh khỏi content)

```
1. User xóa ảnh trong editor
   ↓
2. Content HTML thay đổi (không còn <img src="URL" />)
   ↓
3. User click Save
   ↓
4. getDeletedImages() so sánh previous vs current
   ↓
5. cleanupDeletedImages() gọi DELETE /api/posts/images
   ↓
6. Backend xóa file khỏi R2
   ↓
7. updateImages() cập nhật tracker
   ↓
8. POST /api/posts/:id với content mới
```

---

### C. Edit Post Flow (Full)

```
1. Load Post
   ├─ Fetch /api/posts/:id
   ├─ Set content vào editor
   └─ updateImages(content) → Track initial images

2. User Edit
   ├─ Thêm ảnh → Upload → Insert URL
   ├─ Xóa ảnh → Remove <img> tag
   └─ Sửa text/format

3. Save Post
   ├─ getHTML() → Get current content
   ├─ getDeletedImages() → Find removed images
   ├─ cleanupDeletedImages() → DELETE images (background)
   ├─ updateImages() → Update tracker
   └─ PUT /api/posts/:id → Save post
```

---

## 🧪 Testing Checklist

### Upload Flow
- [ ] Upload ảnh < 5MB → Success
- [ ] Upload ảnh > 5MB → Error message
- [ ] Upload file không phải ảnh → Error
- [ ] Cancel upload (abort) → Ảnh bị xóa khỏi R2
- [ ] Progress bar hiển thị đúng

### Delete Flow
- [ ] Xóa 1 ảnh → API delete được gọi
- [ ] Xóa nhiều ảnh → Tất cả được delete
- [ ] Xóa ảnh external (không phải media.erg.edu.vn) → Không gọi API
- [ ] Save mà không xóa ảnh → Không gọi delete API

### Edge Cases
- [ ] Load post → Edit → Không save → Reload → Ảnh vẫn còn
- [ ] Thêm ảnh → Xóa ngay → Save → Ảnh bị cleanup
- [ ] Network error khi delete → Log error, vẫn save post
- [ ] Concurrent edits → Tracker hoạt động đúng

---

## 📝 Notes for Backend

### API Endpoints Cần Có

#### 1. Upload Image
```
POST /api/posts/images/upload
Content-Type: multipart/form-data

Body:
- file: Binary

Response:
{
  "statusCode": 200,
  "message": "Upload successful",
  "data": {
    "url": "https://media.erg.edu.vn/posts/abc123.webp"
  }
}
```

**Requirements:**
- ✅ Accept only images (jpg, png, gif, webp)
- ✅ Max size: 5MB
- ✅ Auto resize + convert to WebP
- ✅ Upload to Cloudflare R2
- ✅ Return public URL

#### 2. Delete Image
```
DELETE /api/posts/images
Content-Type: application/json

Body:
{
  "url": "https://media.erg.edu.vn/posts/abc123.webp"
}

Response:
{
  "statusCode": 200,
  "message": "Deleted successfully"
}
```

**Requirements:**
- ✅ Validate URL (chỉ cho phép media.erg.edu.vn)
- ✅ Delete file khỏi R2
- ✅ Không fail nếu file không tồn tại (idempotent)

---

## 🚀 Future Enhancements

### 1. Orphaned Images Cleanup
Tạo cron job để tìm ảnh không được dùng trong bất kỳ post nào:

```sql
-- Pseudo SQL
SELECT url FROM uploaded_images
WHERE url NOT IN (
  SELECT DISTINCT unnest(regexp_matches(content, 'src="([^"]+)"', 'g'))
  FROM posts
)
AND created_at < NOW() - INTERVAL '7 days'
```

### 2. Image Gallery/Library
- Lưu metadata của ảnh đã upload (size, dimensions, alt text)
- UI để browse/reuse ảnh đã upload
- Bulk delete

### 3. CDN Integration
- Serve ảnh qua CDN (Cloudflare CDN)
- Auto generate thumbnails (small, medium, large)
- Lazy loading với blur placeholder

### 4. Advanced Features
- Drag & drop reorder images
- Image captions/credits
- Alt text editor (SEO)
- Compress on-the-fly

---

## ✅ Summary

**Completed:**
- ✅ Upload API integration
- ✅ Delete API integration
- ✅ Image tracking hook
- ✅ Edit page integration
- ✅ Abort handling
- ✅ Error handling

**Not Needed:**
- ❌ Create page (no previous images to compare)
- ❌ View page (read-only)

**Ready for Testing!** 🎉
