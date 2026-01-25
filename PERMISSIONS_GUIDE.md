# 🔐 Hướng Dẫn Sử Dụng Hệ Thống Phân Quyền

## 📋 Mục Lục
1. [Tổng quan](#tổng-quan)
2. [Cách sử dụng](#cách-sử-dụng)
3. [Trang 403 Permission Denied](#trang-403)
4. [Protected Routes](#protected-routes)
5. [Testing](#testing)

---

## Tổng Quan

Hệ thống phân quyền cho phép bạn kiểm soát quyền truy cập của user vào các tính năng khác nhau dựa trên **permissions** và **roles**.

### Luồng hoạt động:
1. User đăng nhập → Backend trả về `accessToken`
2. Frontend gọi `/sessions/current` → Nhận `permissions` và `roles`
3. Lưu vào `localStorage` để sử dụng trong UI
4. Sử dụng hooks/components để kiểm tra quyền

---

## Cách Sử Dụng

### 1. Sử dụng Hook `usePermission`

```tsx
import { usePermission } from '@/hooks/use-permission';

function MyComponent() {
  const canCreatePost = usePermission('posts.create');
  
  return (
    <div>
      {canCreatePost && (
        <button>Tạo bài viết</button>
      )}
    </div>
  );
}
```

### 2. Sử dụng Component `<Can>`

#### Ví dụ cơ bản:
```tsx
import { Can } from '@/components/admin/shared/can';

function MyComponent() {
  return (
    <Can permission="posts.create">
      <button>Tạo bài viết</button>
    </Can>
  );
}
```

#### Với fallback:
```tsx
<Can 
  permission="users.delete"
  fallback={<span className="text-red-500">Không có quyền xóa</span>}
>
  <button>Xóa user</button>
</Can>
```

### 3. Lấy tất cả permissions

```tsx
import { usePermissions, useRoles } from '@/hooks/use-permission';

function MyComponent() {
  const permissions = usePermissions();
  const roles = useRoles();
  
  console.log('Permissions:', permissions);
  // ['posts.create', 'posts.update', 'users.read', ...]
  
  console.log('Roles:', roles);
  // ['admin', 'editor']
}
```

---

## Trang 403

### Tự động redirect khi không có quyền

Trang 403 được tạo tại `/403` với giao diện đẹp mắt, bao gồm:
- ✅ Icon animation với glow effect
- ✅ Thông báo rõ ràng bằng tiếng Việt
- ✅ Giải thích nguyên nhân
- ✅ Nút quay lại và về trang chủ
- ✅ Thông tin liên hệ admin

### Truy cập:
```
http://localhost:3000/403
```

---

## Protected Routes

### Sử dụng Component `<ProtectedRoute>`

Bảo vệ toàn bộ trang dựa trên permission:

```tsx
import { ProtectedRoute } from '@/components/admin/shared/protected-route';

export default function UsersPage() {
  return (
    <ProtectedRoute permission="users.read">
      <div>
        <h1>Danh sách Users</h1>
        {/* Nội dung trang */}
      </div>
    </ProtectedRoute>
  );
}
```

### Tùy chỉnh redirect:

```tsx
<ProtectedRoute 
  permission="posts.delete"
  redirectTo="/dashboard"  // Redirect về dashboard thay vì 403
>
  <DeletePostPage />
</ProtectedRoute>
```

### Với fallback custom:

```tsx
<ProtectedRoute 
  permission="system.settings"
  fallback={
    <div>
      <h1>Không có quyền</h1>
      <p>Liên hệ admin để được cấp quyền</p>
    </div>
  }
>
  <SettingsPage />
</ProtectedRoute>
```

---

## Testing

### Trang Test Permissions

Truy cập: `http://localhost:3000/test-permissions`

Trang này cho phép bạn:
- ✅ Xem tất cả permissions và roles hiện tại
- ✅ Kiểm tra từng permission cụ thể
- ✅ Xem demo các component `<Can>`
- ✅ Test các trường hợp có/không có quyền

### Các permissions phổ biến:

| Permission | Mô tả |
|-----------|-------|
| `posts.create` | Tạo bài viết mới |
| `posts.update` | Sửa bài viết |
| `posts.delete` | Xóa bài viết |
| `users.read` | Xem danh sách user |
| `users.create` | Tạo user mới |
| `users.update` | Cập nhật user |
| `users.delete` | Xóa user |
| `roles.read` | Xem roles |
| `roles.create` | Tạo role |
| `roles.update` | Cập nhật role |
| `roles.assign` | Gán role cho user |
| `system.settings` | Cài đặt hệ thống |
| `system.logs` | Xem logs |

---

## Ví Dụ Thực Tế

### 1. Trang Quản Lý Bài Viết

```tsx
import { Can } from '@/components/admin/shared/can';
import { ProtectedRoute } from '@/components/admin/shared/protected-route';

export default function PostsPage() {
  return (
    <ProtectedRoute permission="posts.read">
      <div>
        <div className="flex justify-between">
          <h1>Quản lý bài viết</h1>
          
          <Can permission="posts.create">
            <button>Tạo bài viết mới</button>
          </Can>
        </div>
        
        <table>
          {/* Danh sách bài viết */}
          <tr>
            <td>Tiêu đề bài viết</td>
            <td>
              <Can permission="posts.update">
                <button>Sửa</button>
              </Can>
              
              <Can permission="posts.delete">
                <button>Xóa</button>
              </Can>
            </td>
          </tr>
        </table>
      </div>
    </ProtectedRoute>
  );
}
```

### 2. Sidebar Menu với Permissions

```tsx
import { Can } from '@/components/admin/shared/can';

function Sidebar() {
  return (
    <nav>
      <Can permission="posts.read">
        <a href="/posts">Bài viết</a>
      </Can>
      
      <Can permission="users.read">
        <a href="/users">Người dùng</a>
      </Can>
      
      <Can permission="system.settings">
        <a href="/settings">Cài đặt</a>
      </Can>
    </nav>
  );
}
```

### 3. Conditional Actions

```tsx
import { usePermission } from '@/hooks/use-permission';

function PostCard({ post }) {
  const canEdit = usePermission('posts.update');
  const canDelete = usePermission('posts.delete');
  
  const handleEdit = () => {
    if (!canEdit) {
      alert('Bạn không có quyền sửa bài viết');
      return;
    }
    // Logic sửa bài viết
  };
  
  return (
    <div>
      <h2>{post.title}</h2>
      <div>
        {canEdit && <button onClick={handleEdit}>Sửa</button>}
        {canDelete && <button>Xóa</button>}
      </div>
    </div>
  );
}
```

---

## 🔒 Lưu Ý Bảo Mật

1. **Frontend chỉ để UX**: Permissions ở frontend chỉ để ẩn/hiện UI, không phải để bảo mật thực sự.

2. **Backend là source of truth**: Luôn validate permissions ở backend trước khi thực hiện action.

3. **Không tin tưởng localStorage**: User có thể modify localStorage, nên backend phải check lại.

4. **Best practice**:
   ```tsx
   // ✅ ĐÚNG: Ẩn nút ở FE + Check ở BE
   <Can permission="users.delete">
     <button onClick={deleteUser}>Xóa</button>
   </Can>
   
   // Backend API:
   async deleteUser(userId) {
     if (!user.hasPermission('users.delete')) {
       throw new ForbiddenException();
     }
     // Xóa user
   }
   ```

---

## 📞 Hỗ Trợ

Nếu có vấn đề về permissions:
1. Kiểm tra trang `/test-permissions`
2. Xem console log để debug
3. Liên hệ admin: admin@erg.edu.vn

---

**Tài liệu này được tạo tự động bởi Antigravity AI**
