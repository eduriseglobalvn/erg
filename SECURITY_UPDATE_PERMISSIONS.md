# 🔒 Cập Nhật Bảo Mật: Kiểm Tra Permissions Bắt Buộc

**Ngày cập nhật**: 22/01/2026  
**Vấn đề**: User không có permissions/roles vẫn có thể truy cập dashboard

---

## ❌ Vấn Đề Trước Đây

User có thể đăng nhập và truy cập dashboard ngay cả khi:
- Không có bất kỳ permission nào
- Không có bất kỳ role nào
- `accessControl.permissions = []`
- `accessControl.roles = []`

**Nguyên nhân**: Hệ thống chỉ kiểm tra token hợp lệ, không kiểm tra xem user có quyền gì không.

---

## ✅ Giải Pháp Đã Triển Khai

### 1. AdminAuthGuard - Kiểm tra khi truy cập trang

**File**: `src/components/admin/admin-auth-guard.tsx`

```tsx
// Sau khi lấy permissions từ /sessions/current
const permissions = sessionData.accessControl.permissions || [];
const roles = sessionData.accessControl.roles || [];

// Nếu user không có quyền gì cả -> Redirect về 403
if (permissions.length === 0 && roles.length === 0) {
    console.warn('User has no permissions or roles');
    router.push('/403');
    return;
}
```

**Kết quả**: User không có quyền sẽ bị redirect về trang 403 ngay khi cố truy cập bất kỳ trang nào trong dashboard.

---

### 2. Login Flow - Kiểm tra ngay sau đăng nhập

**File**: `src/components/auth/login-form.tsx`

```tsx
// Sau khi login thành công và lấy permissions
const permissions = sessionData.accessControl.permissions || [];
const roles = sessionData.accessControl.roles || [];

if (permissions.length === 0 && roles.length === 0) {
    toast.error("Tài khoản của bạn chưa được cấp quyền truy cập");
    window.location.href = "/403";
    return;
}
```

**Kết quả**: User sẽ thấy thông báo lỗi ngay sau khi đăng nhập và bị redirect về 403.

---

### 3. OTP Activation Flow - Kiểm tra sau kích hoạt

**File**: `src/components/auth/otp-form.tsx`

```tsx
// Sau khi kích hoạt tài khoản thành công
const permissions = sessionData.accessControl.permissions || [];
const roles = sessionData.accessControl.roles || [];

if (permissions.length === 0 && roles.length === 0) {
    toast.error("Tài khoản của bạn chưa được cấp quyền truy cập");
    window.location.href = "/403";
    return;
}
```

**Kết quả**: User mới kích hoạt tài khoản nhưng chưa được cấp quyền sẽ bị redirect về 403.

---

### 4. Trang 403 - Cập nhật thông báo

**File**: `src/app/@admin/(dashboard)/403/page.tsx`

Đã cập nhật nội dung để rõ ràng hơn:
- ✅ Giải thích về việc chưa được cấp permissions/roles
- ✅ Hướng dẫn liên hệ admin
- ✅ Danh sách nguyên nhân cụ thể

---

## 🎯 Luồng Hoạt Động Mới

### Trường hợp 1: User đăng nhập

```
1. User nhập email/password
2. POST /auth/login → Nhận tokens
3. GET /sessions/current → Nhận permissions
4. CHECK: permissions.length === 0 && roles.length === 0?
   ├─ YES → Toast error + Redirect /403
   └─ NO  → Continue to dashboard/onboarding
```

### Trường hợp 2: User kích hoạt tài khoản

```
1. User nhập PIN
2. POST /auth/verify-pin → Nhận tokens
3. GET /sessions/current → Nhận permissions
4. CHECK: permissions.length === 0 && roles.length === 0?
   ├─ YES → Toast error + Redirect /403
   └─ NO  → Continue to dashboard/onboarding
```

### Trường hợp 3: User truy cập trang bất kỳ

```
1. User vào /dashboard hoặc bất kỳ trang nào
2. AdminAuthGuard check token
3. GET /sessions/current → Nhận permissions
4. CHECK: permissions.length === 0 && roles.length === 0?
   ├─ YES → Redirect /403
   └─ NO  → Render page
```

---

## 🧪 Test Cases

### Test 1: User không có permissions
```
Permissions: []
Roles: []
Expected: Redirect to /403 ✅
```

### Test 2: User có ít nhất 1 permission
```
Permissions: ["posts.read"]
Roles: []
Expected: Allow access ✅
```

### Test 3: User có ít nhất 1 role
```
Permissions: []
Roles: ["user"]
Expected: Allow access ✅
```

### Test 4: User có cả permissions và roles
```
Permissions: ["posts.read", "posts.create"]
Roles: ["editor"]
Expected: Allow access ✅
```

---

## 📊 Điểm Kiểm Tra

Hệ thống hiện kiểm tra permissions ở **3 điểm**:

1. **Login** - Ngay sau khi đăng nhập thành công
2. **OTP Activation** - Ngay sau khi kích hoạt tài khoản
3. **Page Access** - Mỗi lần truy cập trang trong dashboard

→ **Triple protection** đảm bảo user không có quyền không thể vào dashboard.

---

## 🔐 Bảo Mật

### Frontend (UX Layer)
- ✅ Kiểm tra permissions để ẩn/hiện UI
- ✅ Redirect user không có quyền về 403
- ✅ Hiển thị thông báo rõ ràng

### Backend (Security Layer)
- ⚠️ **QUAN TRỌNG**: Backend PHẢI validate permissions cho mọi API
- ⚠️ Frontend chỉ để UX, không phải security
- ⚠️ User có thể modify localStorage, nên backend là source of truth

---

## 📝 Thông Báo Lỗi

### Khi login/activation
```
"Tài khoản của bạn chưa được cấp quyền truy cập"
```

### Khi truy cập trang
```
Console: "User has no permissions or roles"
→ Redirect to /403
```

### Trang 403
```
"Tài khoản của bạn không có đủ quyền hạn để truy cập hệ thống quản trị.
Vui lòng liên hệ với quản trị viên để được cấp quyền truy cập."
```

---

## 🎓 Hướng Dẫn Cho Admin

Khi user báo lỗi "không vào được dashboard":

1. **Kiểm tra permissions**:
   ```sql
   SELECT * FROM user_permissions WHERE user_id = 'xxx';
   ```

2. **Kiểm tra roles**:
   ```sql
   SELECT * FROM user_roles WHERE user_id = 'xxx';
   ```

3. **Cấp quyền cơ bản**:
   - Gán role "user" hoặc
   - Gán ít nhất 1 permission (vd: "posts.read")

4. **User login lại** để nhận permissions mới

---

## ✅ Checklist Hoàn Thành

- [x] AdminAuthGuard kiểm tra permissions
- [x] Login flow kiểm tra permissions
- [x] OTP activation kiểm tra permissions
- [x] Trang 403 với thông báo rõ ràng
- [x] Toast notifications cho user
- [x] Console warnings cho debug
- [x] Tài liệu hướng dẫn

---

**Cập nhật bởi**: Antigravity AI  
**Trạng thái**: ✅ HOÀN THÀNH
