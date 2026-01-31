# API Specification: Image Management for Posts

## 📋 Overview

Frontend cần 2 API endpoints để quản lý ảnh trong Post Editor:
1. **Upload Image** - Upload ảnh và nhận URL
2. **Delete Image** - Xóa ảnh khỏi storage

---

## 🔴 API #1: Upload Image

### Endpoint
```
POST /api/posts/images/upload
```

### Headers
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Request Body
```
FormData:
  - file: <binary_image_data>
```

### Request Example (cURL)
```bash
curl -X POST https://api.erg.edu.vn/api/posts/images/upload \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "file=@/path/to/image.jpg"
```

### Request Example (JavaScript)
```javascript
const formData = new FormData();
formData.append('file', fileObject); // File object from <input type="file">

const response = await fetch('/api/posts/images/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

const result = await response.json();
console.log(result.data.url); // "https://media.erg.edu.vn/posts/abc123.webp"
```

### Success Response (200 OK)
```json
{
  "statusCode": 200,
  "message": "Upload successful",
  "data": {
    "url": "https://media.erg.edu.vn/posts/abc123.webp"
  }
}
```

### Error Responses

#### 400 Bad Request - No file
```json
{
  "statusCode": 400,
  "message": "No file provided"
}
```

#### 400 Bad Request - File too large
```json
{
  "statusCode": 400,
  "message": "File size exceeds maximum allowed (5MB)"
}
```

#### 400 Bad Request - Invalid file type
```json
{
  "statusCode": 400,
  "message": "Only image files are allowed (jpg, png, gif, webp)"
}
```

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Upload failed: <error_details>"
}
```

### Backend Requirements

#### 1. Validation
- ✅ **File type**: Chỉ accept `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- ✅ **File size**: Max 5MB (5 * 1024 * 1024 bytes)
- ✅ **Authentication**: Require valid access token

#### 2. Processing
- ✅ **Resize**: Nếu ảnh > 1920px width, resize về 1920px (giữ aspect ratio)
- ✅ **Convert**: Convert tất cả ảnh sang WebP format (compression quality: 85%)
- ✅ **Filename**: Generate unique filename (recommend: UUID + timestamp)
  - Example: `abc123-1738368000.webp`

#### 3. Storage
- ✅ **Upload to**: Cloudflare R2 bucket
- ✅ **Path**: `/posts/<filename>`
- ✅ **Public URL**: `https://media.erg.edu.vn/posts/<filename>`
- ✅ **Permissions**: Public read

#### 4. Response
- ✅ Return full public URL của ảnh đã upload
- ✅ Format: `{ statusCode, message, data: { url } }`

### Implementation Notes

**Recommended Libraries (NestJS):**
```typescript
import { FileInterceptor } from '@nestjs/platform-express';
import * as sharp from 'sharp'; // Image processing
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; // R2 upload

@Post('images/upload')
@UseInterceptors(FileInterceptor('file'))
async uploadImage(@UploadedFile() file: Express.Multer.File) {
  // 1. Validate
  if (!file) throw new BadRequestException('No file provided');
  if (file.size > 5 * 1024 * 1024) {
    throw new BadRequestException('File size exceeds 5MB');
  }
  if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) {
    throw new BadRequestException('Invalid file type');
  }

  // 2. Process image
  const processedBuffer = await sharp(file.buffer)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  // 3. Generate filename
  const filename = `${uuidv4()}-${Date.now()}.webp`;

  // 4. Upload to R2
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `posts/${filename}`,
    Body: processedBuffer,
    ContentType: 'image/webp',
  }));

  // 5. Return URL
  const url = `https://media.erg.edu.vn/posts/${filename}`;
  return {
    statusCode: 200,
    message: 'Upload successful',
    data: { url }
  };
}
```

---

## 🔴 API #2: Delete Image

Hệ thống hỗ trợ 2 cách xóa ảnh:
1. **API #2.1**: Xóa bằng URL (gửi trong Body) - Khuyên dùng cho Editor sync.
2. **API #2.2**: Xóa bằng Filename (gửi qua Path) - Khuyên dùng khi đã biết rõ ID file.

---

### API #2.1: Delete Image by URL (Body)

### Endpoint
```
DELETE /api/posts/images
```

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Body
```json
{
  "url": "https://media.erg.edu.vn/posts/abc123.webp"
}
```

### Request Example (JavaScript)
```javascript
await fetch('/api/posts/images', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ url: 'https://media.../img.webp' })
});
```

---

### API #2.2: Delete Image by Filename (Path)

### Endpoint
```
DELETE /api/posts/images/id/:filename
```

### Path Parameters
- `filename`: Tên file cụ thể (ví dụ: `abc-123.webp`)

### Request Example (cURL)
```bash
curl -X DELETE https://api.erg.edu.vn/api/posts/images/id/abc-123.webp \
  -H "Authorization: Bearer eyJhbGc..."
```

### Success Response (200 OK)
```json
{
  "statusCode": 200,
  "message": "Deleted successfully"
}
```

---

### Error Responses (Chung cho cả 2 API)

#### 400 Bad Request - Invalid URL
```json
{
  "statusCode": 400,
  "message": "Invalid URL: Only media.erg.edu.vn URLs are allowed"
}
```

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 404 Not Found (Optional - see note below)
```json
{
  "statusCode": 404,
  "message": "File not found"
}
```

**⚠️ Important:** API này nên **idempotent** - tức là nếu file không tồn tại, vẫn return 200 OK thay vì 404. Lý do: Frontend có thể gọi delete nhiều lần cho cùng 1 URL.

### Backend Requirements

#### 1. Validation
- ✅ **URL required**: Check `url` field có trong body
- ✅ **URL format**: Validate URL phải bắt đầu bằng `https://media.erg.edu.vn/posts/`
- ✅ **Authentication**: Require valid access token
- ✅ **Security**: Chặn path traversal attacks (e.g., `../../etc/passwd`)

#### 2. Processing
- ✅ **Extract filename**: Parse URL để lấy filename
  - Example: `https://media.erg.edu.vn/posts/abc123.webp` → `abc123.webp`
- ✅ **Delete from R2**: Xóa file khỏi Cloudflare R2
- ✅ **Idempotent**: Nếu file không tồn tại, vẫn return success

#### 3. Response
- ✅ Return success message
- ✅ Format: `{ statusCode, message }`

### Implementation Notes

**Recommended Implementation (NestJS):**
```typescript
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Delete('images')
async deleteImage(@Body() body: { url: string }) {
  // 1. Validate
  if (!body.url) {
    throw new BadRequestException('URL is required');
  }

  // 2. Security check
  if (!body.url.startsWith('https://media.erg.edu.vn/posts/')) {
    throw new BadRequestException('Invalid URL: Only media.erg.edu.vn URLs are allowed');
  }

  // 3. Extract filename
  const filename = body.url.replace('https://media.erg.edu.vn/posts/', '');
  
  // Prevent path traversal
  if (filename.includes('..') || filename.includes('/')) {
    throw new BadRequestException('Invalid filename');
  }

  // 4. Delete from R2
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `posts/${filename}`,
    }));
  } catch (error) {
    // Idempotent: Nếu file không tồn tại, vẫn return success
    if (error.name === 'NoSuchKey') {
      return {
        statusCode: 200,
        message: 'Deleted successfully (file already deleted)'
      };
    }
    throw error;
  }

  // 5. Return success
  return {
    statusCode: 200,
    message: 'Deleted successfully'
  };
}
```

---

## 🔄 Frontend Integration Flow

### Upload Flow
```
1. User chọn ảnh trong editor
   ↓
2. Frontend gọi handleImageUpload(file)
   ↓
3. POST /api/posts/images/upload với FormData
   ↓
4. Backend: Validate → Resize → Convert → Upload R2 → Return URL
   ↓
5. Frontend: Nhận URL → Chèn <img src="URL" /> vào editor
```

### Delete Flow
```
1. User xóa ảnh khỏi editor content
   ↓
2. User click Save post
   ↓
3. Frontend: So sánh content cũ vs mới → Tìm ảnh bị xóa
   ↓
4. DELETE /api/posts/images với { url: "..." }
   ↓
5. Backend: Validate → Delete from R2 → Return success
   ↓
6. Frontend: Update post content
```

---

## 🧪 Testing Checklist

### Upload API
- [ ] Upload ảnh JPG < 5MB → Success, return WebP URL
- [ ] Upload ảnh PNG > 5MB → Error 400 "File size exceeds 5MB"
- [ ] Upload file PDF → Error 400 "Invalid file type"
- [ ] Upload không có file → Error 400 "No file provided"
- [ ] Upload không có token → Error 401 "Unauthorized"
- [ ] Upload ảnh 3000px width → Resize về 1920px
- [ ] Verify file tồn tại trên R2 sau upload
- [ ] Verify URL trả về accessible (public read)

### Delete API
- [ ] Delete URL hợp lệ → Success 200
- [ ] Delete URL không tồn tại → Success 200 (idempotent)
- [ ] Delete URL external (google.com) → Error 400 "Invalid URL"
- [ ] Delete URL với path traversal (../) → Error 400 "Invalid filename"
- [ ] Delete không có URL → Error 400 "URL is required"
- [ ] Delete không có token → Error 401 "Unauthorized"
- [ ] Verify file bị xóa khỏi R2 sau delete

---

## 📦 Environment Variables Required

Backend cần các env vars sau:

```bash
# Cloudflare R2 Configuration
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<your-access-key>
R2_SECRET_ACCESS_KEY=<your-secret-key>
R2_BUCKET_NAME=erg-media
R2_PUBLIC_URL=https://media.erg.edu.vn

# Optional: Image Processing
MAX_IMAGE_SIZE=5242880  # 5MB in bytes
MAX_IMAGE_WIDTH=1920
WEBP_QUALITY=85
```

---

## 🚀 Deployment Notes

### Cloudflare R2 Setup
1. Tạo R2 bucket tên `erg-media`
2. Enable public access cho bucket
3. Tạo custom domain `media.erg.edu.vn` point đến bucket
4. Generate API token với quyền:
   - Object Read & Write
   - Bucket Read

### CDN Configuration (Optional)
- Enable Cloudflare CDN cho `media.erg.edu.vn`
- Cache TTL: 1 year (ảnh không thay đổi)
- Browser Cache TTL: 1 month

---

## ❓ FAQs

### Q: Tại sao phải convert sang WebP?
**A:** WebP nhẹ hơn JPG/PNG 25-35%, giúp trang load nhanh hơn. Modern browsers đều support WebP.

### Q: Nếu user upload ảnh 10MB thì sao?
**A:** Frontend đã validate max 5MB trước khi upload. Backend cũng nên validate lại để chắc chắn.

### Q: Delete API có cần check permission không?
**A:** Có, nên check user có quyền delete không. Hoặc đơn giản hơn: chỉ cho phép delete ảnh của chính user đó upload.

### Q: Nếu 2 users upload cùng 1 ảnh?
**A:** Không sao, mỗi lần upload sẽ generate filename unique (UUID + timestamp).

### Q: Có cần database để track uploaded images không?
**A:** Không bắt buộc cho MVP. Nhưng nên có để:
- Track ai upload ảnh nào
- Cleanup orphaned images (ảnh không dùng trong post nào)
- Analytics (storage usage, popular images, etc.)

---

## ✅ Summary

**Frontend cần:**
1. `POST /api/posts/images/upload` - Upload ảnh, nhận URL
2. `DELETE /api/posts/images` - Xóa ảnh khỏi storage

**Backend phải:**
- ✅ Validate file type, size
- ✅ Resize + convert to WebP
- ✅ Upload to Cloudflare R2
- ✅ Return public URL
- ✅ Delete from R2 (idempotent)
- ✅ Security: Validate URLs, prevent path traversal

**Ready to implement!** 🚀
