# KẾ HOẠCH TỐI ƯU & PHÁT TRIỂN - FRONTEND (Next.js)

> **Dự án:** EduRise Global (ERG)
> **Ngày tạo:** 2026-02-27
> **Mục tiêu:** Tối ưu hóa, nâng cấp hệ thống Frontend cho production-ready
> **Người thực hiện:** AI Agent (Google Antigravity)
> **Nguyên tắc:** Áp dụng best practices cho agent-based development, UX/UI chuẩn, SEO-first approach

---

## MỤC LỤC

0. [Phase 0: Security & Critical Bug Fixes](#phase-0)
1. [Phase 1: Phân Quyền Chuyên Sâu Admin Dashboard](#phase-1)
2. [Phase 2: Quản Lý User Chi Tiết (Admin UI)](#phase-2)
3. [Phase 3: Giao Diện Khóa Học & Hiển Thị Subdomain](#phase-3)
4. [Phase 4: SEO Toàn Diện - Posts Lên Top Tìm Kiếm](#phase-4)
5. [Phase 5: SEO Scoring Dashboard](#phase-5)
6. [Phase 6: Giao Diện Quản Lý Crawler](#phase-6)
7. [Phase 7: AI Writer UI - Multi API Key](#phase-7)
8. [Phase 8: Tối Ưu Performance & UX](#phase-8)

---

<a id="phase-0"></a>
## PHASE 0: SECURITY & CRITICAL BUG FIXES (Từ REVIEW-VERIFIED.md)

### 0.1 Security Fixes (CRITICAL)
- **B-C1**: Chuyển preview logic qua server action, xóa hardcoded `PREVIEW_SECRET` khỏi client bundle (`src/components/admin/shared/post-sidebar.tsx`).
- **B-C2**: Thêm `DOMPurify.sanitize()` trước khi render HTML trong `PostContentRenderer` (`src/components/shared/post-content-renderer.tsx`) phòng chống XSS.
- **B-C3 & B-C4**: Cải thiện cơ chế lưu trữ tokens và permissions (tránh lưu JSON nguyên bản trên localStorage).

### 0.2 Critical Bug Fixes (HIGH/MEDIUM)
- **B-H1**: Sửa port fallback `3000` thành `3003` trong backend URL ở trang tin tức.
- **B-H2**: Xóa block component `AiSearchSummaryBox` bị gọi duplicate.
- **B-H3 & B-H4**: Fix memory leaks thiếu `capture: true` trong `removeEventListener` và `clearInterval` trong `use-ai-writer.ts`.
- **C1.1, C1.2, C1.3**: Sửa file exports của `services/index.ts`, đồng bộ `analytics.api.ts` dùng `httpClient`, và thêm báo lỗi chuẩn cho HTTP retry.
- **C2.4**: Hiện `toast.error()` chuẩn ở khối catch trong Course Edit thay vì success.
- **C3.1**: Bổ sung `onError` handler vào các `deleteMutation`.
- **C4.1**: Thêm `aria-label` cho các icon-only buttons.
- **C5.1**: Tạo Error Boundary (`error.tsx`) cho public web pages.

---

<a id="phase-1"></a>
## PHASE 1: PHÂN QUYỀN CHUYÊN SÂU ADMIN DASHBOARD

### 1.1 Hiện trạng

- `AdminAuthGuard` component bảo vệ admin routes
- `usePermission()`, `useRole()` hooks check quyền từ localStorage
- `usePermissionSync()` auto-sync mỗi 5 phút
- Sidebar hiển thị cố định cho tất cả users
- **Thiếu:** Dynamic sidebar based on permissions, feature-level access control, permission denied UI, role management UI

### 1.2 Kế hoạch nâng cấp

#### Task 1.2.1: Dynamic Sidebar dựa trên Permissions

**File:** `src/components/admin/app-sidebar.tsx`

**Hiện tại:** Sidebar items được hardcode, hiển thị giống nhau cho mọi user

**Cải thiện:**
```typescript
// Mỗi sidebar item có permission requirement
const SIDEBAR_CONFIG = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    permission: null,           // Ai cũng thấy
  },
  {
    title: 'Bài viết của tôi',
    icon: FileText,
    href: '/posts',
    permission: 'posts.create', // Chỉ user có quyền tạo post
  },
  {
    title: 'Quản lý bài viết',
    icon: Newspaper,
    href: '/admin/posts',
    permission: 'posts.read',
    children: [
      { title: 'Tất cả bài viết', href: '/admin/posts', permission: 'posts.read' },
      { title: 'Tạo bài viết', href: '/admin/posts/create', permission: 'posts.create' },
      { title: 'Nháp', href: '/admin/posts/drafts', permission: 'posts.read' },
      { title: 'Thùng rác', href: '/admin/posts/trash', permission: 'posts.delete' },
    ],
  },
  {
    title: 'Khóa học',
    icon: GraduationCap,
    href: '/admin/courses',
    permission: 'courses.read',
  },
  {
    title: 'Crawler',
    icon: Globe,
    href: '/admin/crawler',
    permission: 'crawler.read',
  },
  {
    title: 'SEO',
    icon: Search,
    href: '/admin/seo',
    permission: 'seo.read',
  },
  {
    title: 'Người dùng',
    icon: Users,
    href: '/admin/users',
    permission: 'users.read',
  },
  {
    title: 'Phân quyền',
    icon: Shield,
    href: '/admin/access-control',
    permission: 'roles.read',
  },
  {
    title: 'Tuyển dụng',
    icon: Briefcase,
    href: '/admin/recruitment',
    permission: 'recruitment.read',
  },
  {
    title: 'Analytics',
    icon: BarChart,
    href: '/admin/analytics',
    permission: 'analytics.read',
  },
  {
    title: 'Cài đặt',
    icon: Settings,
    href: '/admin/settings',
    permission: 'settings.read',
  },
];
```

**Hành động:**
1. Refactor `app-sidebar.tsx` → filter sidebar items dựa trên `usePermissions()` hook
2. Cache feature map từ API `GET /access-control/my-permissions`
3. Sidebar tự ẩn items mà user không có quyền
4. Thêm badge "Mới" cho features mới

#### Task 1.2.2: Permission-Aware Components

**File mới:** `src/components/admin/shared/permission-gate.tsx`

```tsx
// Wrapper component - chỉ render children nếu user có permission
<PermissionGate permission="posts.create">
  <Button>Tạo bài viết</Button>
</PermissionGate>

// Với fallback
<PermissionGate permission="posts.delete" fallback={<Tooltip>Bạn không có quyền xóa</Tooltip>}>
  <Button variant="destructive">Xóa</Button>
</PermissionGate>

// Multiple permissions (AND logic)
<PermissionGate permissions={['posts.update', 'seo.update']}>
  <Button>Tối ưu SEO</Button>
</PermissionGate>

// Any permission (OR logic)
<PermissionGate anyPermission={['posts.create', 'posts.update']}>
  <PostEditor />
</PermissionGate>
```

**Hành động:**
1. Tạo `PermissionGate` component
2. Tạo `useCanAccess(permission)` hook → return boolean
3. Áp dụng vào tất cả admin pages:
   - Buttons (Create, Edit, Delete, Publish) → wrap với PermissionGate
   - Entire pages → redirect nếu không có quyền
   - Table columns (Actions column) → ẩn nếu không có quyền tương ứng

#### Task 1.2.3: Role Management UI

**File mới:** `src/app/@admin/(dashboard)/admin/access-control/`

```
access-control/
├── page.tsx                 → Danh sách roles
├── roles/
│   ├── page.tsx             → Role list with permissions
│   ├── create/page.tsx      → Tạo role mới
│   └── [id]/
│       └── edit/page.tsx    → Sửa role + assign permissions
├── permissions/
│   └── page.tsx             → Permission list (read-only)
└── audit-logs/
    └── page.tsx             → Audit trail viewer
```

**UI Components cần tạo:**

1. **RoleListPage**: Bảng danh sách roles với columns: Name, Description, Users Count, Permissions Count, Actions
2. **RoleEditor**: Form tạo/sửa role với permission picker (checkbox grid grouped by resource)
3. **PermissionGrid**: Grid hiển thị permissions grouped by resource (users, posts, courses, seo, ...)
   ```
   Resource      | Read | Create | Update | Delete | Manage |
   Users         |  ✅  |   ✅   |   ✅   |   ❌   |   ❌   |
   Posts         |  ✅  |   ✅   |   ✅   |   ✅   |   ❌   |
   Courses       |  ✅  |   ❌   |   ❌   |   ❌   |   ❌   |
   ```
4. **AuditLogViewer**: Bảng audit logs với filter (action, user, resource, date range), expandable rows hiển thị changes diff

#### Task 1.2.4: Admin Phân Quyền Cho User (QUAN TRỌNG)

**Mục tiêu:** Admin có thể xem và thay đổi quyền của bất kỳ user nào, với giao diện trực quan và preview kết quả.

**File mới:** `src/app/@admin/(dashboard)/admin/users/[id]/permissions/page.tsx`

**UI Phân Quyền User:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Phân quyền: Nguyễn Văn A (a@email.com)          [← Quay lại] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─── Vai trò hiện tại ───────────────────────────────────────┐ │
│ │                                                             │ │
│ │  [✅ User]  [✅ Editor]  [❌ Content Manager]               │ │
│ │  [❌ SEO Specialist]  [❌ HR Manager]  [❌ Admin]           │ │
│ │                                                             │ │
│ │  Click vào badge để gán/gỡ role. Thay đổi chưa lưu.       │ │
│ │                                         [💾 Lưu thay đổi] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─── Quyền hiệu lực (Effective Permissions) ─────────────────┐ │
│ │                                                             │ │
│ │ Quyền từ roles: 15 quyền                                   │ │
│ │ Quyền cấp riêng (GRANT): 2 quyền                          │ │
│ │ Quyền chặn riêng (DENY): 1 quyền                          │ │
│ │ ─────────────────────────────                               │ │
│ │ Tổng quyền hiệu lực: 16 quyền                             │ │
│ │                                                             │ │
│ │ Resource      │ Read │ Create │ Update │ Delete │ Manage   │ │
│ │ ──────────────┼──────┼────────┼────────┼────────┼──────── │ │
│ │ Bài viết      │  ✅  │   ✅   │   ✅   │   ✅   │   ❌   │ │
│ │ Khóa học      │  ✅  │   ❌   │   ❌   │   ❌   │   ❌   │ │
│ │ SEO           │  ✅  │   -    │   🟢⁺  │   -    │   ❌   │ │
│ │ Người dùng    │  ✅  │   ❌   │   ❌   │   🔴⁻  │   ❌   │ │
│ │ Crawler       │  ✅  │   ✅   │   ✅   │   ❌   │   ❌   │ │
│ │ Analytics     │  ✅  │   -    │   -    │   -    │   ❌   │ │
│ │ Tuyển dụng    │  ❌  │   ❌   │   ❌   │   ❌   │   ❌   │ │
│ │ Cài đặt       │  ❌  │   -    │   ❌   │   -    │   ❌   │ │
│ │                                                             │ │
│ │ Chú thích: ✅ Có quyền (từ role)                           │ │
│ │            🟢⁺ Cấp riêng (GRANT override)                  │ │
│ │            🔴⁻ Chặn riêng (DENY override)                  │ │
│ │            ❌ Không có quyền                                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─── Quyền cấp riêng (Permission Overrides) ─────────────────┐ │
│ │                                                             │ │
│ │  🟢 seo.update    │ Cấp bởi: Admin │ Lý do: Hỗ trợ SEO   │ │
│ │                    │ Hết hạn: Không  │           [🗑 Gỡ]   │ │
│ │                                                             │ │
│ │  🔴 users.delete  │ Cấp bởi: Admin │ Lý do: Chặn xóa user│ │
│ │                    │ Hết hạn: 30/03  │           [🗑 Gỡ]   │ │
│ │                                                             │ │
│ │                              [+ Thêm quyền đặc biệt]      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─── Preview: User sẽ thấy gì? ──────────────────────────────┐ │
│ │                                                             │ │
│ │  Sidebar preview:                                           │ │
│ │  ┌──────────────────┐                                       │ │
│ │  │ 📊 Dashboard     │ ← Luôn thấy                          │ │
│ │  │ 📝 Bài viết      │ ← posts.read ✅                      │ │
│ │  │ 🔍 SEO           │ ← seo.read ✅                        │ │
│ │  │ 🌐 Crawler       │ ← crawler.read ✅                    │ │
│ │  │ 📊 Analytics     │ ← analytics.read ✅                  │ │
│ │  │ ░░ Người dùng    │ ← users.manage ❌ (ẩn)               │ │
│ │  │ ░░ Phân quyền    │ ← roles.read ❌ (ẩn)                 │ │
│ │  │ ░░ Tuyển dụng    │ ← recruitment.read ❌ (ẩn)           │ │
│ │  └──────────────────┘                                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Dialog "Thêm quyền đặc biệt":**
```
┌──────────────────────────────────────────┐
│ Cấp/Chặn quyền đặc biệt                │
├──────────────────────────────────────────┤
│                                          │
│ Loại:  ○ Cấp quyền (GRANT)              │
│        ○ Chặn quyền (DENY)              │
│                                          │
│ Quyền: [Chọn quyền ▼]                  │
│        ├── posts.create                  │
│        ├── posts.update                  │
│        ├── seo.manage                    │
│        └── ... (chỉ hiện quyền mà       │
│            admin ĐANG CÓ - delegation)   │
│                                          │
│ Lý do:  [________________________________]│
│                                          │
│ Hết hạn: ○ Vĩnh viễn                    │
│          ○ Có thời hạn [📅 Chọn ngày]   │
│                                          │
│            [Hủy]  [Xác nhận]            │
└──────────────────────────────────────────┘
```

**Components cần tạo:**

1. **`UserPermissionManager`** - Component chính quản lý quyền user
   - Hiển thị roles (toggle badges)
   - Permission grid (effective permissions)
   - Direct overrides list
   - Sidebar preview
2. **`RoleToggleBadge`** - Badge click để gán/gỡ role
3. **`PermissionOverrideDialog`** - Dialog thêm GRANT/DENY
4. **`PermissionPreview`** - Preview sidebar user sẽ thấy
5. **`EffectivePermissionGrid`** - Grid hiển thị quyền kết hợp (role + direct)

**API calls:**
```typescript
// src/services/access-control.api.ts (tạo mới)
const accessControlApi = {
  // Lấy quyền hiện tại của user
  getUserPermissions: (userId: string) =>
    httpClient.get(`/access-control/users/${userId}/permissions`),

  // Gán roles
  assignRoles: (userId: string, roleIds: string[]) =>
    httpClient.post(`/access-control/users/${userId}/roles`, { roleIds }),

  // Gỡ role
  removeRole: (userId: string, roleId: string) =>
    httpClient.delete(`/access-control/users/${userId}/roles/${roleId}`),

  // Thêm permission override
  addPermissionOverride: (userId: string, data: {
    permissionId: string;
    grantType: 'GRANT' | 'DENY';
    reason?: string;
    expiresAt?: string;
  }) => httpClient.post(`/access-control/users/${userId}/permissions`, data),

  // Gỡ permission override
  removePermissionOverride: (userId: string, overrideId: string) =>
    httpClient.delete(`/access-control/users/${userId}/permissions/${overrideId}`),

  // Preview thay đổi
  previewChanges: (userId: string, changes: any) =>
    httpClient.post(`/access-control/users/${userId}/preview`, changes),

  // Bulk assign role
  bulkAssignRole: (userIds: string[], roleId: string) =>
    httpClient.post('/access-control/bulk-assign-role', { userIds, roleId }),

  // Lấy danh sách roles
  getRoles: () => httpClient.get('/access-control/roles'),

  // Lấy danh sách permissions
  getPermissions: () => httpClient.get('/access-control/permissions'),
};
```

**Hành động:**
1. Tạo `src/services/access-control.api.ts` với tất cả API calls
2. Tạo page `src/app/@admin/(dashboard)/admin/users/[id]/permissions/page.tsx`
3. Tạo 5 components: UserPermissionManager, RoleToggleBadge, PermissionOverrideDialog, PermissionPreview, EffectivePermissionGrid
4. Thêm nút "Phân quyền" vào User Detail page + User List table actions
5. Thêm nút "Phân quyền hàng loạt" (bulk assign role) vào User List page
6. Delegation rule: chỉ hiện permissions mà admin đang có trong dropdown chọn

#### Task 1.2.5: Permission Denied Page

**File mới:** `src/components/admin/shared/permission-denied.tsx`

```tsx
// Full page component khi user truy cập route không có quyền
<PermissionDenied
  requiredPermission="users.manage"
  message="Bạn không có quyền quản lý người dùng"
  suggestContact="admin@erg.edu.vn"
/>
```

**Hành động:**
1. Tạo component đẹp với icon Shield, message rõ ràng
2. Hiển thị quyền cần thiết và suggest liên hệ admin
3. Hook vào `AdminAuthGuard` → check route permissions trước khi render page

---

<a id="phase-2"></a>
## PHASE 2: QUẢN LÝ USER CHI TIẾT (Admin UI)

### 2.1 Hiện trạng

- Admin có trang users list cơ bản
- Chỉ có: list, update status, assign roles, delete
- **Thiếu:** Search/filter, user detail page, activity log, bulk actions, user creation by admin, export

### 2.2 Kế hoạch nâng cấp

#### Task 2.2.1: User List Page Nâng Cấp

**File:** `src/app/@admin/(dashboard)/admin/users/page.tsx`

**UI cần có:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Quản lý người dùng                           [+ Tạo user mới] │
├─────────────────────────────────────────────────────────────────┤
│ 🔍 [Tìm kiếm email, tên, SĐT...]                             │
│                                                                 │
│ Filters: [Status ▼] [Role ▼] [Provider ▼] [Ngày tạo ▼]       │
│                                                                 │
│ ☐ │ Avatar │ Họ tên        │ Email            │ Vai trò  │ ... │
│ ☐ │  👤    │ Nguyễn Văn A  │ a@email.com      │ Admin    │ ... │
│ ☐ │  👤    │ Trần Thị B    │ b@email.com      │ Editor   │ ... │
│                                                                 │
│ [Chọn hành động ▼] (Kích hoạt / Vô hiệu / Xóa)   Trang 1/10 │
└─────────────────────────────────────────────────────────────────┘
```

**Hành động:**
1. Sử dụng `@tanstack/react-table` cho sortable, filterable table
2. Columns: Checkbox, Avatar, Full Name, Email, Phone, Status (badge), Roles (badges), Provider, Last Login, Created, Actions
3. Inline status change: click badge → dropdown change status
4. Bulk select → batch actions (activate, deactivate, delete)
5. Export button: CSV/JSON
6. Search: debounced (300ms), search across email, fullName, phone

#### Task 2.2.2: User Detail Page

**File mới:** `src/app/@admin/(dashboard)/admin/users/[id]/page.tsx`

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ ← Quay lại                                                     │
├───────────────────────┬────────────────────────────────────────┤
│                       │                                         │
│    [Avatar lớn]       │  Nguyễn Văn A                          │
│                       │  a@email.com | 0912.xxx.xxx             │
│    ● Active           │  Vai trò: Admin, Editor                │
│                       │  Tham gia: 15/01/2026                  │
│  [Sửa] [Đổi trạng    │  Đăng nhập gần nhất: 2 giờ trước      │
│   thái] [Phân quyền] │                                         │
│                       │                                         │
├───────────────────────┴────────────────────────────────────────┤
│                                                                 │
│  [Thông tin] [Bài viết] [Hoạt động] [Phiên đăng nhập]        │
│                                                                 │
│  Tab: Thông tin                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Họ tên:     Nguyễn Văn A                                │   │
│  │ Email:      a@email.com                                  │   │
│  │ SĐT:       0912.xxx.xxx                                 │   │
│  │ Ngày sinh:  01/01/1990                                   │   │
│  │ Giới tính:  Nam                                          │   │
│  │ Địa chỉ:   Quận 1, TP.HCM                              │   │
│  │ Bio:        Senior Developer...                          │   │
│  │ Provider:   Local (email/password)                       │   │
│  │ Profile:    ✅ Completed                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Tab: Bài viết (call GET /users/:id/posts)                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Tiêu đề              │ Trạng thái │ SEO Score │ Ngày   │   │
│  │ Bài viết 1            │ Published  │ 85/100    │ 20/02  │   │
│  │ Bài viết 2            │ Draft      │ 60/100    │ 18/02  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Tab: Hoạt động (call GET /users/:id/activity)                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🟢 LOGIN       │ Chrome/Mac │ 192.168.1.1 │ 2 giờ trước│   │
│  │ 📝 POST_CREATE │ Bài viết 1 │             │ 5 giờ trước│   │
│  │ 🔑 PASSWORD_CHANGE │        │             │ 1 ngày trước│  │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Tab: Phiên đăng nhập (call GET /users/:id/sessions)          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Chrome/Mac │ 192.168.1.1 │ Active │ [Thu hồi]          │   │
│  │ Safari/iOS │ 10.0.0.1    │ Active │ [Thu hồi]          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Hành động:**
1. Tạo page layout với tabs (Thông tin, Bài viết, Hoạt động, Sessions)
2. Header card hiển thị thông tin chính + quick actions
3. Mỗi tab lazy-load data khi click
4. Admin actions: Edit profile, Change status, Assign roles, Revoke sessions

#### Task 2.2.3: Create User Dialog (Admin)

**File mới:** `src/components/admin/users/create-user-dialog.tsx`

```
Form fields:
- Email* (required, validate format)
- Họ tên* (required)
- Mật khẩu* (required, validate strength)
- Số điện thoại
- Vai trò (multi-select roles)
- Trạng thái (default: Active)
- Ghi chú (admin notes)
```

**Hành động:**
1. Dialog/Modal form với React Hook Form + Zod validation
2. Password strength indicator
3. Role multi-select component
4. Call API `POST /users/create`

#### Task 2.2.4: User Statistics Dashboard

**File mới:** `src/app/@admin/(dashboard)/admin/users/stats/page.tsx` (hoặc widget trên dashboard)

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Tổng users   │ Active hôm   │ Mới tuần này │ Mới tháng   │
│    1,234     │ nay: 56      │    +23       │ này: +89     │
└──────────────┴──────────────┴──────────────┴──────────────┘

[Chart: User growth over time (line chart)]
[Chart: Users by role (pie chart)]
[Chart: Users by status (bar chart)]
[Chart: Users by provider (donut chart)]
```

---

<a id="phase-3"></a>
## PHASE 3: GIAO DIỆN KHÓA HỌC & HIỂN THỊ SUBDOMAIN

### 3.1 Hiện trạng

- Chưa có UI cho khóa học (entities có nhưng chưa có controller/service ở BE)
- Subdomains hiện chỉ hiển thị static pages + tin tức
- **Cần:** Admin UI quản lý courses, public UI hiển thị courses trên subdomains

### 3.2 Kế hoạch phát triển

#### Task 3.2.1: Admin - Course Management

**Files mới:** `src/app/@admin/(dashboard)/admin/courses/`

```
courses/
├── page.tsx                → Danh sách khóa học
├── create/page.tsx         → Tạo khóa học mới
└── [id]/
    ├── page.tsx            → Chi tiết khóa học
    ├── edit/page.tsx       → Sửa khóa học
    ├── syllabus/page.tsx   → Quản lý nội dung (topics + lessons)
    └── enrollments/page.tsx → Danh sách học viên
```

**Course List Page:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Quản lý khóa học                              [+ Tạo khóa học]│
├─────────────────────────────────────────────────────────────────┤
│ [Filter: Status ▼] [Filter: Category ▼] [Filter: Level ▼]     │
│                                                                 │
│ ┌────────────┬─────────────────────────────────────────────┐   │
│ │ [Thumbnail]│ MOS Excel 2021 Advanced                     │   │
│ │            │ 📚 12 bài học · ⏱ 24 giờ · 👥 156 học viên │   │
│ │            │ ⭐ 4.8/5 · 💰 1,500,000đ                   │   │
│ │            │ 🏷 Intermediate · 🌐 tinhocquocte           │   │
│ │            │ Status: ✅ Published                         │   │
│ │            │ [Sửa] [Nội dung] [Học viên] [...]           │   │
│ └────────────┴─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Course Editor Page:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Tạo khóa học mới                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Thông tin cơ bản                                                │
│ ├── Tên khóa học *         [____________________________]       │
│ ├── Mã khóa học            [____________________________]       │
│ ├── Danh mục *             [MOS ▼]                              │
│ ├── Cấp độ                 [Beginner ▼]                         │
│ ├── Ngôn ngữ               [Tiếng Việt ▼]                      │
│ ├── Giá                    [1,500,000] VNĐ                      │
│ └── Mô tả ngắn            [____________________________]       │
│                                                                 │
│ Nội dung                                                        │
│ ├── Thumbnail              [Upload ảnh]                         │
│ ├── Video giới thiệu       [URL video]                          │
│ ├── Mô tả chi tiết         [Rich text editor]                  │
│ └── Điều kiện tiên quyết   [____________________________]       │
│                                                                 │
│ Hiển thị                                                        │
│ ├── Subdomain hiển thị *   [☑ tinhocquocte] [☑ tinhocquocgia]  │
│ │                          [☐ ai] [☐ tinhocthieunhi]            │
│ ├── Tags                   [Excel] [MOS] [Office] [+]          │
│ └── Giảng viên             [Chọn giảng viên ▼]                 │
│                                                                 │
│                            [Lưu nháp] [Xuất bản]               │
└─────────────────────────────────────────────────────────────────┘
```

**Syllabus Editor (Drag & Drop):**
```
┌─────────────────────────────────────────────────────────────────┐
│ Nội dung khóa học: MOS Excel 2021                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ [+ Thêm chủ đề]                                                │
│                                                                 │
│ 📁 Chủ đề 1: Làm quen với Excel               [☰ drag] [...]  │
│ │  ├── 📄 Bài 1: Giao diện Excel    │ 30 phút │ 🆓 Free │     │
│ │  ├── 📄 Bài 2: Cell & Range       │ 45 phút │ 🔒 Paid │     │
│ │  └── [+ Thêm bài học]                                        │
│ │                                                               │
│ 📁 Chủ đề 2: Công thức cơ bản                 [☰ drag] [...]  │
│ │  ├── 📄 Bài 3: SUM, AVERAGE       │ 60 phút │ 🔒 Paid │     │
│ │  ├── 📄 Bài 4: IF, COUNTIF        │ 45 phút │ 🔒 Paid │     │
│ │  └── [+ Thêm bài học]                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Hành động:**
1. Sử dụng `@dnd-kit/core` cho drag & drop reorder syllabus/lessons
2. Tạo API service `src/services/courses.api.ts` cho tất cả course CRUD
3. Rich text editor (Tiptap) cho lesson content
4. Image upload cho thumbnails (sử dụng existing upload service)
5. Multi-select checkboxes cho subdomain targeting

#### Task 3.2.2: Course Theming, Appearance & Live Preview

**Mục tiêu:** Mỗi khóa học nhìn khác nhau (màu sắc, layout, badge) nhưng dùng chung component. Admin thấy preview real-time khi chọn theme.

**Thêm vào Course Editor page - Section "Giao diện":**
```
┌─────────────────────────────────────────────────────────────────┐
│ Giao diện khóa học                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Chọn Theme:                                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ │ 💙       │ │ 💜       │ │ 💚       │ │ 🧡       │           │
│ │ Tech     │ │ Creative │ │ Nature   │ │ Warm     │           │
│ │ Blue     │ │ Purple   │ │ Green    │ │ Orange   │           │
│ │ ✅ Chọn  │ │          │ │          │ │          │           │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│ │ ⬛       │ │ 💗       │ │ 🎨       │                        │
│ │ Profes-  │ │ Playful  │ │ Custom   │                        │
│ │ sional   │ │ Pink     │ │ (Tùy    │                        │
│ │          │ │          │ │  chỉnh)  │                        │
│ └──────────┘ └──────────┘ └──────────┘                        │
│                                                                 │
│ [Nếu chọn Custom → hiện color pickers:]                        │
│ Màu chính:    [🎨 #2563EB]                                     │
│ Màu phụ:      [🎨 #1E40AF]                                     │
│ Màu nền:      [🎨 #EFF6FF]                                     │
│                                                                 │
│ Kiểu Card:    [Gradient ▼]  (default / gradient / bordered / elevated / minimal)
│ Kiểu Header:  [Banner ▼]   (banner / split / overlay / simple)
│                                                                 │
│ Badge:  [Bestseller ▼]  Màu badge: [🎨 #EF4444]               │
│         (Bestseller / Mới / Hot / Nâng cao / Tự nhập / Không)  │
│                                                                 │
│ ┌─── LIVE PREVIEW ────────────────────────────────────────────┐ │
│ │                                                             │ │
│ │  Preview Card (như user sẽ thấy):                           │ │
│ │  ┌─────────────────────────────────────────────────────┐    │ │
│ │  │ ┌────────────────────────────────────────────────┐  │    │ │
│ │  │ │          [Thumbnail Preview]                    │  │    │ │
│ │  │ │          gradient: #2563EB → #1E40AF           │  │    │ │
│ │  │ │                    🏷 Bestseller                │  │    │ │
│ │  │ └────────────────────────────────────────────────┘  │    │ │
│ │  │ MOS Excel 2021 Advanced                             │    │ │
│ │  │ ⭐ 4.8/5 (156) · 12 bài học · 24 giờ              │    │ │
│ │  │ 1,500,000đ                                          │    │ │
│ │  │ [Xem chi tiết]                                      │    │ │
│ │  └─────────────────────────────────────────────────────┘    │ │
│ │                                                             │ │
│ │  [Toggle: Card View / Detail Page View]                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Components cần tạo:**

1. **`CourseThemeSelector`** - Grid các preset themes + custom option
2. **`CourseThemeCustomizer`** - Color pickers, style dropdowns (chỉ hiện khi chọn Custom)
3. **`CourseCardPreview`** - Live preview card component, update real-time khi thay đổi theme
4. **`CourseDetailPreview`** - Preview trang chi tiết khóa học (toggle từ card view)
5. **`ThemedCourseCard`** - Component card dùng chung, nhận `theme: CourseTheme` prop → apply CSS variables

**Cách ThemedCourseCard hoạt động:**
```tsx
// Component nhận theme config → render card với style động
function ThemedCourseCard({ course }: { course: CourseWithTheme }) {
  const theme = course.theme || DEFAULT_THEME;

  // Apply CSS custom properties từ theme
  const style = {
    '--course-primary': theme.primaryColor,
    '--course-secondary': theme.secondaryColor,
    '--course-bg': theme.backgroundColor,
    '--course-text': theme.textColor,
    '--course-accent': theme.accentColor,
  } as React.CSSProperties;

  // cardStyle → className mapping
  const cardClass = {
    default: 'bg-white border',
    gradient: 'bg-gradient-to-br from-[var(--course-primary)] to-[var(--course-secondary)]',
    bordered: 'border-2 border-[var(--course-primary)]',
    elevated: 'shadow-xl hover:shadow-2xl',
    minimal: 'border-0 bg-transparent',
  }[theme.cardStyle];

  return <div style={style} className={cardClass}>...</div>;
}
```

**Hành động:**
1. Tạo 5 components theo danh sách trên
2. Tích hợp `CourseThemeSelector` + `CourseThemeCustomizer` vào Course Editor page
3. Live preview: mỗi khi thay đổi theme → re-render preview (no API call, pure client-side)
4. Fetch preset themes từ API `GET /courses/theme-presets`
5. Save theme khi save course (gửi `theme` JSON cùng course data)
6. Trên public pages: `ThemedCourseCard` render khác nhau cho mỗi course
7. Add dependency: không cần thêm lib mới (dùng Tailwind CSS variables)

#### Task 3.2.3: Public Course Display trên Subdomains

**Mục tiêu:** Mỗi subdomain hiển thị khóa học phù hợp

**Files mới cho mỗi subdomain:**
```
src/app/@tinhocquocte/khoa-hoc/
├── page.tsx              → Danh sách khóa học (filter by subdomain)
└── [slug]/
    └── page.tsx          → Chi tiết khóa học (public view)

src/app/@tinhocquocgia/khoa-hoc/
├── page.tsx
└── [slug]/page.tsx

// ... tương tự cho các subdomain khác
```

**Course Listing UI (Public):**
```
┌─────────────────────────────────────────────────────────────────┐
│ Khóa Học Tin Học Quốc Tế                                        │
│ Khám phá các chương trình đào tạo chứng chỉ quốc tế           │
├─────────────────────────────────────────────────────────────────┤
│ [Filter: Level ▼] [Filter: Category ▼] [Sort: Phổ biến ▼]    │
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│ │ [Thumbnail] │ │ [Thumbnail] │ │ [Thumbnail] │               │
│ │             │ │             │ │             │               │
│ │ MOS Excel   │ │ MOS Word    │ │ IC3 GS6     │               │
│ │ ⭐ 4.8 (156)│ │ ⭐ 4.6 (89) │ │ ⭐ 4.9 (200)│               │
│ │ 12 bài học  │ │ 10 bài học  │ │ 15 bài học  │               │
│ │ 1,500,000đ  │ │ 1,200,000đ  │ │ 2,000,000đ  │               │
│ │ [Xem chi tiết]│ [Xem chi tiết]│ [Xem chi tiết]              │
│ └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

**Course Detail UI (Public):**
```
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumb: ERG > Tin Học Quốc Tế > MOS > MOS Excel 2021      │
├─────────────────────────┬───────────────────────────────────────┤
│                         │ ┌─────────────────────────────────┐  │
│ MOS Excel 2021          │ │ Thông tin khóa học              │  │
│ Advanced Level          │ │ 📚 12 bài học                   │  │
│                         │ │ ⏱ 24 giờ học                   │  │
│ ⭐ 4.8/5 (156 đánh giá) │ │ 📊 Intermediate                │  │
│                         │ │ 🌐 Tiếng Việt                  │  │
│ [Video giới thiệu]     │ │ 💰 1,500,000đ                  │  │
│                         │ │                                 │  │
│ Mô tả:                 │ │ [Đăng ký ngay]                  │  │
│ Lorem ipsum dolor sit   │ │ [Thêm vào yêu thích]           │  │
│ amet...                 │ └─────────────────────────────────┘  │
│                         │                                       │
├─────────────────────────┴───────────────────────────────────────┤
│ Nội dung khóa học                                               │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ▼ Chủ đề 1: Làm quen (3 bài · 1.5 giờ)                   │ │
│ │   ├── 🆓 Bài 1: Giao diện Excel (30 phút) [Xem free]     │ │
│ │   ├── 🔒 Bài 2: Cell & Range (45 phút)                    │ │
│ │   └── 🔒 Bài 3: Formatting (15 phút)                      │ │
│ │ ▼ Chủ đề 2: Công thức (4 bài · 3 giờ)                    │ │
│ │   ├── 🔒 Bài 4: SUM, AVERAGE (60 phút)                   │ │
│ │   └── ...                                                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Giảng viên                                                      │
│ ┌───────┬──────────────────────────────────────────────────────┐│
│ │ [Ava] │ Nguyễn Văn A - Senior Instructor                    ││
│ │       │ 10+ năm kinh nghiệm đào tạo MOS                    ││
│ └───────┴──────────────────────────────────────────────────────┘│
│                                                                 │
│ Đánh giá (156 reviews)                                          │
│ ...                                                             │
└─────────────────────────────────────────────────────────────────┘
```

**Hành động:**
1. Tạo shared components: `CourseCard`, `CourseSyllabus`, `CourseDetail`
2. Reuse components cho tất cả subdomains (chỉ khác data)
3. SEO metadata cho course pages (generateMetadata + schema Course)
4. ISR: revalidate course list mỗi 30 phút, course detail mỗi 10 phút
5. Thêm course links vào menu items của mỗi subdomain

#### Task 3.2.3: Course SEO trên Subdomains

**Hành động cho mỗi course page:**
1. `generateMetadata()`:
   - Title: `[Tên khóa học] | [Tên subdomain] - ERG`
   - Description: course summary (max 160 chars)
   - OpenGraph: course thumbnail, type: 'website'
   - Twitter Card
   - Canonical URL: `https://[subdomain].erg.edu.vn/khoa-hoc/[slug]`
2. Schema markup (JSON-LD):
   ```json
   {
     "@type": "Course",
     "name": "MOS Excel 2021",
     "description": "...",
     "provider": { "@type": "EducationalOrganization", "name": "ERG" },
     "offers": { "@type": "Offer", "price": "1500000", "priceCurrency": "VND" },
     "aggregateRating": { "ratingValue": "4.8", "reviewCount": "156" },
     "hasCourseInstance": { "courseMode": "blended", "instructor": {...} }
   }
   ```
3. BreadcrumbList schema
4. Hreflang alternates

---

<a id="phase-4"></a>
## PHASE 4: SEO TOÀN DIỆN - POSTS LÊN TOP TÌM KIẾM

### 4.1 Hiện trạng

- Có metadata generation, OpenGraph, Twitter Card
- Schema markup (Article, FAQ, HowTo, etc.)
- Sitemap with multi-subdomain support
- Robots.txt
- SEO analysis panel trong post editor
- **Cần cải thiện:** Breadcrumb hiển thị trên search results, subdomain SEO independence, structured data đầy đủ hơn, menu cây thư mục, wider keyword targeting

### 4.2 Kế hoạch tối ưu

#### Task 4.2.1: Cải Thiện Breadcrumb cho Search Results

**File:** `src/utils/seo/generate-breadcrumb.ts` + `src/components/seo/schema-script.tsx`

**Mục tiêu:** Google hiển thị breadcrumb đẹp trong search results

```
ERG > Tin Học Quốc Tế > MOS Excel > Cách tạo PivotTable trong Excel 2021
```

**Hành động:**
1. Cập nhật `generateBreadcrumbItems()`:
   - Level 1: Tên subdomain (ERG / Tin Học Quốc Tế / AI / ...)
   - Level 2: Category name
   - Level 3: Post title (truncated 60 chars)
2. Đảm bảo mỗi breadcrumb item có `@id` URL đúng
3. Render breadcrumb UI visible trên page (Google ưu tiên visible breadcrumbs)
4. Tạo `Breadcrumb` component dùng chung cho tất cả content pages

#### Task 4.2.2: Sitelinks Search Box

**Mục tiêu:** Google hiển thị search box ngay trong search results

**Hành động:**
1. Thêm `WebSite` schema với `potentialAction: SearchAction`:
   ```json
   {
     "@type": "WebSite",
     "url": "https://tinhocquocte.erg.edu.vn",
     "potentialAction": {
       "@type": "SearchAction",
       "target": "https://tinhocquocte.erg.edu.vn/tim-kiem?q={search_term_string}",
       "query-input": "required name=search_term_string"
     }
   }
   ```
2. Tạo search page cho mỗi subdomain: `src/app/@[subdomain]/tim-kiem/page.tsx`
3. Search page gọi API search posts filtered by subdomain

#### Task 4.2.3: SEO mỗi Subdomain như Domain Riêng

**Hành động:**

1. **Robots.txt riêng cho mỗi subdomain:**
   ```typescript
   // src/app/robots.ts
   export default function robots() {
     const host = headers().get('host');
     const subdomain = extractSubdomain(host);

     return {
       rules: getSubdomainRules(subdomain),
       sitemap: `https://${host}/sitemap.xml`,
       host: `https://${host}`,
     };
   }
   ```

2. **Sitemap riêng cho mỗi subdomain:**
   - Hiện tại sitemap.ts đã detect subdomain, cần đảm bảo:
   - Mỗi subdomain chỉ include URLs của nó
   - Image sitemap entries
   - Lastmod accurate
   - Priority phù hợp (homepage: 1.0, category: 0.8, post: 0.6)

3. **Organization schema riêng:**
   ```json
   // Mỗi subdomain có schema riêng
   {
     "@type": "EducationalOrganization",
     "name": "Tin Học Quốc Tế ERG",
     "url": "https://tinhocquocte.erg.edu.vn",
     "logo": "https://tinhocquocte.erg.edu.vn/logo.png",
     "sameAs": ["facebook-url", "youtube-url"],
     "areaServed": "VN",
     "knowsLanguage": ["vi", "en"]
   }
   ```

4. **Verification tags riêng:**
   - Google Search Console verification per subdomain
   - Bing Webmaster verification per subdomain
   - Render trong `<head>` dựa trên subdomain config từ API

5. **Canonical URL luôn đúng:**
   - Mỗi page phải có canonical pointing đến subdomain URL
   - Cross-subdomain content (nếu cùng 1 post hiện ở nhiều subdomains) → canonical về subdomain chính

#### Task 4.2.4: Menu Cây Thư Mục (Navigation Schema)

**Mục tiêu:** Google hiển thị sitelinks (menu phụ dưới kết quả tìm kiếm chính)

**Hành động:**
1. Thêm `SiteNavigationElement` schema cho mỗi subdomain:
   ```json
   {
     "@type": "SiteNavigationElement",
     "name": "Khóa Học MOS",
     "url": "https://tinhocquocte.erg.edu.vn/khoa-hoc"
   }
   ```
2. Đảm bảo navigation HTML semantic: `<nav>` tag với `aria-label`
3. Tạo footer links đầy đủ cho mỗi subdomain (Google crawl footer links)
4. Internal linking strategy: mỗi post có related posts links

#### Task 4.2.5: SEO cho TẤT CẢ Search Engines (Google, Bing, CocCoc, Safari, Google AI Search)

**A. Google (bao gồm Google AI Overviews / AI Search)**

- Đã có: sitemap, robots, schema, OpenGraph
- Thêm: Google Indexing API integration (auto-submit khi publish)
- Thêm: Google Search Console data display trong admin

**Google AI Search (AI Overviews) - XU HƯỚNG 2026:**
Google AI Overviews hiển thị câu trả lời AI ở đầu kết quả tìm kiếm. Để được trích dẫn:

```
Hành động FE:
1. Content structure: Mỗi section (H2) phải bắt đầu bằng "direct answer" 2-3 câu
   → Tạo component ContentSummaryBox hiển thị key takeaways ở đầu bài
2. FAQ section: Tự động render FAQ schema ở cuối mỗi post
   → Component: PostFaqSection (render FAQ từ post.faqItems)
3. "People Also Ask" section: Render các câu hỏi liên quan
   → Component: RelatedQuestionsSection
4. Structured snippets: Dùng <table>, <ol>, <ul> cho dữ liệu có cấu trúc
   → Đảm bảo Tiptap editor export HTML semantic
5. Tóm tắt ngắn ở đầu bài (excerpt) → AI dễ trích dẫn
```

**B. Bing & IndexNow Protocol:**
```
Hành động FE:
1. Thêm <meta name="msvalidate.01"> per subdomain
2. IndexNow key file: tạo route /[key].txt cho verification
   → File: src/app/[key]/route.ts (dynamic route)
3. Admin UI: Bing Webmaster verification input trong SEO Settings
```

**C. CocCoc (6-8% thị phần Việt Nam - KHÔNG BỎ QUA):**
```
Hành động FE:
1. CocCoc ưu tiên tiếng Việt có dấu đầy đủ trong content
   → Đảm bảo meta description LUÔN tiếng Việt có dấu
2. CocCoc render giống Chrome → đảm bảo responsive, Core Web Vitals tốt
3. Đảm bảo robots.txt KHÔNG block CocCocBot-Web
4. CocCoc đặc biệt ưu tiên tốc độ load → LCP < 2.5s, FID < 100ms
5. Không lazy-load content chính (CocCocBot có thể không chờ JS render)
   → Ưu tiên SSR/SSG cho content pages
```

**D. Safari / Apple (Applebot, Spotlight, Siri):**
```
Hành động FE:
1. Thêm Apple meta tags vào layout.tsx per subdomain:
   <meta name="apple-mobile-web-app-title" content="Tin Học Quốc Tế ERG">
   <meta name="apple-mobile-web-app-capable" content="yes">
   <meta name="apple-mobile-web-app-status-bar-style" content="default">
2. Apple Smart Banner (nếu có mobile app sau này):
   <meta name="apple-itunes-app" content="app-id=...">
3. Apple Touch Icons: đảm bảo có apple-touch-icon.png per subdomain
4. Applebot đọc schema.org → đảm bảo SchemaScript component render đúng
```

**E. Yandex, DuckDuckGo, Baidu:**
```
Hành động FE:
1. Yandex: <meta name="yandex-verification" content="..."> per subdomain
2. DuckDuckGo: dùng Bing index → IndexNow cover
3. Baidu (nếu cần): <meta name="baidu-site-verification" content="...">
```

**Component tổng hợp:**

```tsx
// src/components/seo/search-engine-meta.tsx (NÂN CẤP)
export function SearchEngineMeta({ subdomain }: { subdomain: string }) {
  const config = useSubdomainSeoConfig(subdomain); // Fetch từ API

  return (
    <>
      {/* Google */}
      {config.googleVerification && (
        <meta name="google-site-verification" content={config.googleVerification} />
      )}

      {/* Bing */}
      {config.bingVerification && (
        <meta name="msvalidate.01" content={config.bingVerification} />
      )}

      {/* Yandex */}
      {config.yandexVerification && (
        <meta name="yandex-verification" content={config.yandexVerification} />
      )}

      {/* Baidu */}
      {config.baiduVerification && (
        <meta name="baidu-site-verification" content={config.baiduVerification} />
      )}

      {/* Apple */}
      <meta name="apple-mobile-web-app-title" content={config.siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      {/* CocCoc: không cần meta riêng, chỉ cần robots.txt đúng + content tốt */}
    </>
  );
}

// src/components/seo/ai-search-content.tsx (MỚI)
// Component giúp format content cho Google AI Overviews
export function AiSearchSummaryBox({ post }: { post: Post }) {
  // Render key takeaways box ở đầu bài
  // → Google AI dễ trích dẫn
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <h2 className="font-semibold text-lg mb-2">Tóm tắt</h2>
      <p>{post.excerpt}</p>
      {post.meta?.toc && (
        <ul className="mt-2 list-disc list-inside">
          {post.meta.toc.slice(0, 5).map(item => (
            <li key={item.id}><a href={`#${item.id}`}>{item.text}</a></li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**SEO Settings UI trong Admin (để quản lý verification codes per subdomain):**

```
┌─────────────────────────────────────────────────────────────────┐
│ Cài đặt SEO - Subdomain: tinhocquocte                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Search Engine Verification                                      │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Google:  [verification-code___________________________]  │   │
│ │ Bing:    [msvalidate-code_____________________________]  │   │
│ │ Yandex:  [yandex-code_________________________________]  │   │
│ │ Baidu:   [baidu-code__________________________________]  │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Analytics                                                       │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Google Analytics ID:  [GA-XXXXXXXXX____________________] │   │
│ │ GTM Container ID:     [GTM-XXXXXXX____________________]  │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ IndexNow Key: abc123... [📋 Copy] [🔄 Regenerate]              │
│ Key File URL: https://tinhocquocte.erg.edu.vn/abc123.txt       │
│                                                                 │
│                                          [💾 Lưu cài đặt]     │
└─────────────────────────────────────────────────────────────────┘
```

#### Task 4.2.6: Keyword Suggestion UI (Đề Xuất Từ Khóa SEO Hot)

**Mục tiêu:** Khi admin tạo post hoặc khóa học, hiển thị từ khóa SEO hot để admin chọn. Giống Ubersuggest tích hợp sẵn.

**Tích hợp vào Post Editor + Course Editor:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Từ khóa SEO                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Từ khóa chính (Focus Keyword):                                  │
│ [pivot table excel_______________________________________] 🔍   │
│                                                                 │
│ ┌─── Từ khóa đề xuất (đang load...) ────────────────────────┐  │
│ │                                                             │  │
│ │ 🔥 Hot Trends (Google Autocomplete):                        │  │
│ │  ┌────────────────────────────┬───────┬───────┬──────────┐ │  │
│ │  │ Từ khóa                    │Volume │Trend  │ Score    │ │  │
│ │  │ ☐ cách tạo pivot table     │ Cao   │  📈   │ 92/100  │ │  │
│ │  │ ☐ pivot table excel 2021   │ Cao   │  📈   │ 90/100  │ │  │
│ │  │ ☑ hướng dẫn pivot table    │ TB    │  ➡️   │ 85/100  │ │  │
│ │  │ ☐ pivot table là gì        │ Cao   │  📈   │ 88/100  │ │  │
│ │  └────────────────────────────┴───────┴───────┴──────────┘ │  │
│ │                                                             │  │
│ │ ❓ Câu hỏi phổ biến (People Also Ask):                     │  │
│ │  ☐ Pivot table dùng để làm gì?                              │  │
│ │  ☐ Cách sử dụng pivot table cho người mới?                  │  │
│ │  ☑ Pivot table có khó không?                                │  │
│ │                                                             │  │
│ │ 🔗 Từ khóa liên quan (LSI):                                │  │
│ │  ☐ bảng tổng hợp dữ liệu  ☐ phân tích dữ liệu excel      │  │
│ │  ☐ công thức excel nâng cao ☐ báo cáo excel tự động        │  │
│ │                                                             │  │
│ │ 📊 Từ khóa đang hot trong danh mục "MOS Excel":            │  │
│ │  ☐ chứng chỉ MOS 2026    ☐ đề thi MOS Excel mới nhất     │  │
│ │  ☐ excel 365 mới nhất    ☐ MOS expert level               │  │
│ │                                                             │  │
│ │                        [✅ Thêm từ khóa đã chọn]           │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                 │
│ Từ khóa đã chọn:                                                │
│ [pivot table excel ✕] [hướng dẫn pivot table ✕]                │
│ [Pivot table có khó không ✕]                                    │
│                                                                 │
│ Từ khóa phụ (Secondary Keywords):                               │
│ [bảng tổng hợp dữ liệu ✕] [+ Thêm]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Components cần tạo:**

1. **`KeywordSuggestionPanel`** - Panel chính hiển thị suggestions
   - Gọi API `GET /seo/keywords/suggest?keyword=...&category=...`
   - Hiển thị kết quả theo 4 nhóm: Hot Trends, Questions, LSI, Category Trending
   - Checkbox để chọn keywords
   - Button "Thêm từ khóa đã chọn" → thêm vào tag list
   - Debounce 500ms khi user gõ focus keyword
   - Skeleton loading khi đang fetch

2. **`KeywordTagInput`** - Input cho keywords (giống tag input)
   - Hiển thị selected keywords dưới dạng tags (có nút ✕ xóa)
   - Support paste nhiều keywords (comma-separated)
   - Autocomplete khi gõ (gọi `/seo/keywords/autocomplete`)

3. **`KeywordScoreBadge`** - Badge hiển thị score/volume/trend cho 1 keyword
   - Score 80-100: Xanh (khuyến nghị)
   - Score 50-79: Vàng (bình thường)
   - Score 0-49: Đỏ (nên tránh)
   - Trend icon: 📈 rising, ➡️ stable, 📉 declining

**Tích hợp vào cả 2 nơi:**
- **Post Editor**: section "SEO" → KeywordSuggestionPanel + KeywordTagInput
- **Course Editor**: section "SEO" → KeywordSuggestionPanel (với type='course')

**API calls:**
```typescript
// Thêm vào src/services/seo.api.ts
const seoApi = {
  // ... existing methods ...

  // Keyword suggestions
  getKeywordSuggestions: (keyword: string, category?: string, type?: 'post' | 'course') =>
    httpClient.get('/seo/keywords/suggest', { params: { keyword, category, type } }),

  getKeywordAutocomplete: (q: string) =>
    httpClient.get('/seo/keywords/autocomplete', { params: { q } }),

  getTrendingKeywords: (category?: string, period?: '7d' | '30d') =>
    httpClient.get('/seo/keywords/trending', { params: { category, period } }),

  analyzeKeywords: (keywords: string[]) =>
    httpClient.post('/seo/keywords/analyze', { keywords }),
};
```

**Hành động:**
1. Tạo 3 components: `KeywordSuggestionPanel`, `KeywordTagInput`, `KeywordScoreBadge`
2. Tích hợp vào Post Editor (section SEO) và Course Editor
3. Trigger: khi admin nhập focus keyword → debounce 500ms → fetch suggestions
4. Keywords đã chọn lưu vào post/course data khi save
5. Cũng áp dụng cho AI Writer: khi AI generate bài → auto-suggest keywords cho bài đó

#### Task 4.2.7: Từ Khóa Tìm Kiếm Rộng Hơn (Content-Level)

**Hành động ở Frontend:**
1. Trong post editor, hiển thị AI-suggested keywords (primary + secondary + LSI + long-tail)
2. Keyword tag input cho mỗi post (user có thể thêm/bớt) → đã có ở Task 4.2.6
3. Display keywords trong `<meta name="keywords">` tag
4. Auto-suggest related topics khi tạo post mới
5. Content optimization hints: "Bài viết thiếu từ khóa phụ: [keyword1], [keyword2]"

---

#### Task 4.2.8: Hệ Thống Đánh Giá (Reviews/Ratings) cho SEO Google Rich Snippets

> **Mục tiêu:** Xây dựng giao diện đánh giá hoàn chỉnh (public + admin moderation) để Google hiển thị ⭐ sao trên kết quả tìm kiếm → tăng CTR 15-25%.

**Phụ thuộc Backend:** Task 4.2.7 (BE) phải hoàn thành trước.

##### 4.2.8.1: Nâng cấp Review Component Public

**File sửa:** `src/components/shared/reviews.tsx`

```
┌─────────────────────────────────────────────────────────────────┐
│ Đánh giá & Nhận xét                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  ⭐ 4.7/5  (156 đánh giá)                                  │ │
│ │                                                             │ │
│ │  ★★★★★  ████████████████████████████░░  80  (51%)          │ │
│ │  ★★★★☆  ██████████████░░░░░░░░░░░░░░░  45  (29%)          │ │
│ │  ★★★☆☆  ████░░░░░░░░░░░░░░░░░░░░░░░░  20  (13%)          │ │
│ │  ★★☆☆☆  ██░░░░░░░░░░░░░░░░░░░░░░░░░░   8  ( 5%)          │ │
│ │  ★☆☆☆☆  █░░░░░░░░░░░░░░░░░░░░░░░░░░░   3  ( 2%)          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌── Sắp xếp: [Mới nhất ▾] [Điểm cao ▾] [Hữu ích nhất ▾] ──┐ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🟢 Nguyễn Văn A  ★★★★★  ✅ Đã mua khóa học               │ │
│ │ 2 ngày trước                                                │ │
│ │                                                             │ │
│ │ "Khóa học rất hay, giảng viên giải thích rõ ràng..."       │ │
│ │                                                             │ │
│ │ ↪️ Phản hồi từ EduRise Global:                              │ │
│ │   "Cảm ơn bạn đã đánh giá! Chúng tôi sẽ tiếp tục..."     │ │
│ │                                                             │ │
│ │ [👍 12 người thấy hữu ích]  [📌 Nổi bật]                  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ✍️ Viết đánh giá của bạn                                   │ │
│ │                                                             │ │
│ │ Chọn số sao:  ☆ ☆ ☆ ☆ ☆                                  │ │
│ │ ┌───────────────────────────────────────────────────────┐   │ │
│ │ │ Chia sẻ trải nghiệm của bạn (tối thiểu 20 ký tự)... │   │ │
│ │ └───────────────────────────────────────────────────────┘   │ │
│ │                                                             │ │
│ │ ⓘ Đánh giá sẽ được hiển thị sau khi được duyệt            │ │
│ │                                          [Gửi đánh giá]    │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Hành động:**
1. Nâng cấp component `Reviews` hiện tại:
   - Thêm **Rating Distribution Bar** (hiển thị % cho từng mức sao)
   - Thêm **Sort options**: Mới nhất, Điểm cao, Điểm thấp, Hữu ích nhất
   - Hiển thị badge **"✅ Đã mua khóa học"** cho `isVerifiedPurchase = true`
   - Hiển thị badge **"📌 Nổi bật"** cho `isFeatured = true`
   - Hiển thị **admin reply** (phản hồi từ ERG) dưới review
   - Nút **"👍 Hữu ích"** → gọi API tăng `helpfulCount`
   - Thông báo rõ: *"Đánh giá sẽ được hiển thị sau khi được duyệt"* khi submit
   - Lấy **tên user thật** từ auth context khi đã đăng nhập (fix TODO hiện tại)
2. Validate trước khi submit:
   - Rating bắt buộc (1-5 sao)
   - Comment tối thiểu 20 ký tự
   - Không cho submit nếu đã review rồi (hiện thông báo "Bạn đã đánh giá")
3. Gọi API thật: `POST /reviews` → `reviewsApi.create(data)`

##### 4.2.8.2: JSON-LD AggregateRating + Review Schema trên Public Pages

**Files sửa:**
- `src/app/@tinhocquocte/khoa-hoc/[slug]/page.tsx`
- `src/app/@tinhocquocgia/khoa-hoc/[slug]/page.tsx`
- Các post detail pages dạng how-to/review

**Hành động:**
1. Backend trả về `reviewStats` + `schemaMarkup` kèm theo course/post data
2. Inject JSON-LD vào `<head>` thông qua `<script type="application/ld+json">`:

```typescript
// Trong generateMetadata() hoặc trong page component:
const course = await fetchCourse(slug);

// Schema tự động có aggregateRating nếu >= 3 reviews approved
<script type="application/ld+json">
  {JSON.stringify(course.schemaMarkup)}
</script>
```

3. Kết quả trên Google Search:

```
Khóa học MOS Excel 2021 - EduRise Global
https://tinhocquocte.erg.edu.vn/khoa-hoc/mos-excel-2021
⭐⭐⭐⭐⭐ 4.7 (156 đánh giá) — Khóa học
Luyện thi chứng chỉ MOS Excel 2021 cùng giảng viên chuyên nghiệp...
```

4. **Lưu ý quan trọng:** Chỉ generate `AggregateRating` khi:
   - Có **>= 3 reviews** đã approved (yêu cầu của Google)
   - Reviews phải từ **người dùng thật** (không fake)
   - **KHÔNG** thêm rating cho bài tin tức (Google cấm)

##### 4.2.8.3: Admin Review Moderation Dashboard

**File mới:** `src/app/@admin/(dashboard)/admin/reviews/page.tsx`

```
┌─────────────────────────────────────────────────────────────────┐
│ Quản Lý Đánh Giá                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ │ Chờ duyệt│ │ Đã duyệt │ │ Từ chối  │ │ Tổng     │           │
│ │   🟡 12  │ │  🟢 234  │ │  🔴 8   │ │   254    │           │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                 │
│ ┌── Lọc: [Tất cả ▾] [Khóa học ▾] [Bài viết ▾] [⭐ Sao ▾] ──┐│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ☐ | Nguyễn Văn A | ⭐⭐⭐⭐⭐ | Khóa MOS Excel | 🟡 Chờ    │ │
│ │   "Khóa học rất hay, giảng viên..."                         │ │
│ │   🕐 2 giờ trước | ✅ Đã mua | IP: 14.xx.xx.xx             │ │
│ │                                                             │ │
│ │   [✅ Duyệt] [❌ Từ chối] [💬 Phản hồi] [📌 Nổi bật]     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ☐ | Trần Thị B  | ⭐⭐☆☆☆ | Bài viết #45    | 🟡 Chờ    │ │
│ │   "Bài viết thiếu chi tiết, cần bổ sung..."                │ │
│ │   🕐 5 giờ trước | ❌ Chưa mua                              │ │
│ │                                                             │ │
│ │   [✅ Duyệt] [❌ Từ chối] [💬 Phản hồi]                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ☐ Chọn tất cả | [✅ Duyệt hàng loạt] [❌ Từ chối hàng loạt]  │
│                                                                 │
│ ┌── Khi từ chối, bắt buộc nhập lý do: ──────────────────────┐ │
│ │ ┌─────────────────────────────────────────────────────┐     │ │
│ │ │ Lý do từ chối: [Spam/Quảng cáo ▾]                  │     │ │
│ │ │ Ghi chú: ______________________________________     │     │ │
│ │ └─────────────────────────────────────────────────────┘     │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Hành động:**
1. Tạo trang admin `/admin/reviews` với permission gate `reviews.manage`
2. Hiển thị tất cả reviews từ API `GET /reviews/admin/all`
3. Filter theo: Status (Chờ/Duyệt/Từ chối), Target Type (Khóa học/Bài viết), Rating (1-5 sao)
4. Actions cho từng review:
   - **Duyệt** → `PATCH /reviews/:id/approve` → review xuất hiện public + cập nhật Google schema
   - **Từ chối** → `PATCH /reviews/:id/reject` → bắt buộc nhập lý do (dropdown preset + ghi chú tùy chỉnh)
   - **Phản hồi** → `POST /reviews/:id/reply` → dialog nhập nội dung phản hồi
   - **Đánh dấu nổi bật** → `PATCH /reviews/:id/feature` → hiện đầu tiên trên public page
5. **Batch actions**: Chọn nhiều → Duyệt/Từ chối hàng loạt
6. Hiển thị metadata: IP, User-Agent, thời gian, verified purchase status → giúp admin phát hiện spam
7. **Notification**: Khi có review mới chờ duyệt → hiện badge đỏ trên sidebar menu "Đánh giá"

##### 4.2.8.4: Admin Reply Dialog

**File mới:** `src/components/admin/reviews/review-reply-dialog.tsx`

```
┌─────────────────────────────────────────┐
│ 💬 Phản hồi đánh giá                   │
├─────────────────────────────────────────┤
│                                         │
│ Đánh giá của: Nguyễn Văn A             │
│ ⭐⭐⭐⭐⭐ — "Khóa học rất hay..."       │
│                                         │
│ Phản hồi từ EduRise Global:            │
│ ┌─────────────────────────────────────┐ │
│ │ Cảm ơn bạn đã đánh giá!           │ │
│ │ Chúng tôi rất vui khi khóa học    │ │
│ │ hữu ích cho bạn...                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ⓘ Phản hồi sẽ hiển thị công khai      │
│   dưới đánh giá trên website           │
│                                         │
│           [Hủy]  [Gửi phản hồi]       │
└─────────────────────────────────────────┘
```

**Hành động:**
1. Dialog với textarea nhập phản hồi
2. Preview hiển thị review gốc + phản hồi
3. Gọi `POST /reviews/:id/reply`
4. Phản hồi hiển thị trên public page dưới review → tăng uy tín cho Google

##### 4.2.8.5: Tích hợp Review vào Course Detail & Post Detail Pages

**Hành động trên public pages:**
1. **Course detail** (`@tinhocquocte/khoa-hoc/[slug]/page.tsx`):
   - Hiển thị `⭐ 4.7/5 (156 đánh giá)` trên hero section
   - Section "Đánh giá & Nhận xét" với component `<Reviews>` nâng cấp
   - JSON-LD `aggregateRating` trong schema
2. **Post detail** (`@main/tin-tuc/[slug]/page.tsx`):
   - Chỉ hiển thị reviews cho posts dạng how-to, review, tutorial
   - KHÔNG hiển thị cho tin tức (Google policy)
3. **Landing pages** (`@tinhocquocte/page.tsx`, etc.):
   - Hiển thị "featured reviews" carousel từ tất cả khóa học → social proof

##### 4.2.8.6: Service Layer

**File mới:** `src/services/reviews.api.ts` (nâng cấp)

```typescript
export const reviewsApi = {
  // Public
  getApproved: (targetId, targetType, sort?, page?) => httpClient<ReviewListResponse>(...),
  getStats: (targetId) => httpClient<ReviewStats>(...),
  create: (data: CreateReviewDto) => httpClient<Review>(...),
  markHelpful: (id: string) => httpClient(...),

  // Admin
  adminGetAll: (filters: ReviewFilters) => httpClient<ReviewListResponse>(...),
  approve: (id, data?) => httpClient(...),
  reject: (id, data) => httpClient(...),
  reply: (id, content) => httpClient(...),
  toggleFeatured: (id) => httpClient(...),
  batchAction: (ids, action, note?) => httpClient(...),
};
```

**Checklist Phase 4.2.8:**
- [ ] 🔴 Nâng cấp `Reviews` component (rating distribution, sort, verified badge, reply, featured, helpful)
- [ ] 🔴 JSON-LD AggregateRating + Review schema trên course/post pages
- [ ] 🔴 Admin Review Moderation Dashboard (`/admin/reviews`)
- [ ] 🔴 Approve/Reject flow với lý do bắt buộc khi từ chối
- [ ] 🟡 Admin Reply Dialog
- [ ] 🟡 Batch approve/reject
- [ ] 🟡 Nâng cấp `reviews.api.ts` service (public + admin endpoints)
- [ ] 🟡 Notification badge khi có review mới chờ duyệt
- [ ] 🟢 Featured reviews carousel trên landing pages
- [ ] 🟢 "Hữu ích" vote button

---

<a id="phase-5"></a>
## PHASE 5: SEO SCORING DASHBOARD

### 5.1 Hiện trạng

- Có `SeoAnalysisPanel` component trong post editor
- Backend tính seoScore, readabilityScore, keywordDensity
- **Cần:** Dashboard tổng quan SEO, chi tiết scoring per post, history tracking, actionable recommendations

### 5.2 Kế hoạch phát triển

#### Task 5.2.1: SEO Dashboard Page

**File mới:** `src/app/@admin/(dashboard)/admin/seo/page.tsx`

```
┌─────────────────────────────────────────────────────────────────┐
│ SEO Dashboard                                [🔄 Phân tích lại]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ │ Điểm TB  │ │ Posts ≥80│ │ Posts <50 │ │ Issues   │           │
│ │  72/100  │ │   45%    │ │   12%    │ │   234    │           │
│ │ ▲ +3 pts │ │ ▲ +5%   │ │ ▼ -2%   │ │ ▼ -15   │           │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Xu hướng điểm SEO (30 ngày)                              │   │
│ │ [Line chart: average score over time]                     │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌────────────────────────────┬──────────────────────────────┐   │
│ │ Phân bổ điểm SEO          │ Top Issues                    │   │
│ │ [Donut chart:              │ 1. Meta description quá ngắn │   │
│ │   90-100: 15%              │    (45 posts)                │   │
│ │   70-89: 30%               │ 2. Thiếu alt text cho ảnh   │   │
│ │   50-69: 35%               │    (38 posts)                │   │
│ │   0-49: 20%]               │ 3. Keyword density quá thấp │   │
│ │                            │    (32 posts)                │   │
│ └────────────────────────────┴──────────────────────────────┘   │
│                                                                 │
│ Bài viết cần cải thiện SEO                                      │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Tiêu đề              │ Score │ Issues │ Category  │ Action│   │
│ │ Bài viết XYZ          │ 35    │ 8      │ MOS       │ [Sửa]│   │
│ │ Hướng dẫn ABC         │ 42    │ 6      │ IC3       │ [Sửa]│   │
│ │ Tips DEF              │ 48    │ 5      │ AI        │ [Sửa]│   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Bài viết SEO tốt nhất                                           │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Tiêu đề              │ Score │ Views  │ Category  │ Action│   │
│ │ Bài viết 1            │ 95    │ 12,345 │ MOS       │ [Xem]│   │
│ │ Bài viết 2            │ 92    │ 8,900  │ IC3       │ [Xem]│   │
│ └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Hành động:**
1. Tạo dashboard page với Recharts charts
2. Call API `GET /seo/dashboard` cho data
3. Sortable/filterable tables cho worst/best posts
4. Quick link từ mỗi post row → post editor

#### Task 5.2.2: SEO Score Detail Panel (trong Post Editor)

**Cải thiện `SeoAnalysisPanel.tsx`:**

```
┌─────────────────────────────────────────┐
│ Phân tích SEO             Score: 72/100 │
│ [████████████████░░░░░░░░] 72%          │
├─────────────────────────────────────────┤
│                                          │
│ ▼ Tiêu đề (18/20)                  ✅   │
│   ✅ Độ dài phù hợp (55 ký tự)         │
│   ✅ Chứa từ khóa chính                 │
│   ⚠️ Không có số trong tiêu đề         │
│   💡 Gợi ý: "Top 10 cách..."           │
│                                          │
│ ▼ Meta Description (12/15)          ⚠️   │
│   ✅ Độ dài phù hợp (148 ký tự)        │
│   ❌ Thiếu CTA (hãy thêm lời kêu gọi) │
│   ⚠️ Từ khóa ở cuối description        │
│                                          │
│ ▼ Nội dung (22/30)                 ⚠️   │
│   ✅ Đủ dài (1,200 từ)                  │
│   ✅ Có H2, H3 headings                 │
│   ❌ 3 ảnh thiếu alt text              │
│   ⚠️ Keyword density thấp (0.8%)       │
│   ✅ Có internal links (5)              │
│   ⚠️ Thiếu external links              │
│                                          │
│ ▼ Readability (12/15)              ✅   │
│   ✅ Câu ngắn gọn, dễ đọc              │
│   ⚠️ Một số đoạn quá dài (>300 từ)     │
│                                          │
│ ▼ Technical (8/10)                  ✅   │
│   ✅ Schema markup: Article             │
│   ✅ OpenGraph đầy đủ                   │
│   ❌ Thiếu Twitter Card image           │
│                                          │
│ ▼ Social (10/10)                    ✅   │
│   ✅ OG Title                            │
│   ✅ OG Description                      │
│   ✅ OG Image                            │
│                                          │
│ Lịch sử điểm SEO                         │
│ [Sparkline chart: score over last edits] │
│                                          │
│ [🔄 Phân tích lại] [💡 Tối ưu tự động] │
└─────────────────────────────────────────┘
```

**Hành động:**
1. Refactor `SeoAnalysisPanel` thành multi-section collapsible panel
2. Color coding: ✅ Green (pass), ⚠️ Yellow (warning), ❌ Red (fail)
3. Actionable suggestions cho mỗi issue
4. "Tối ưu tự động" button → call AI để fix issues
5. History sparkline chart từ `GET /seo/history/:postId`
6. Real-time update khi user edit post (debounced 2 giây)

#### Task 5.2.3: SEO Score Badge trên Post List

**File:** Components hiển thị post list (admin/posts/page.tsx)

**Hành động:**
1. Thêm SEO Score column vào posts table
2. Color badge: Red (0-49), Yellow (50-69), Green (70-89), Blue (90-100)
3. Tooltip hiển thị quick summary: "Title: ✅ | Meta: ⚠️ | Content: ❌"
4. Filter posts by score range
5. Sort by score (ascending → fix worst first)

---

<a id="phase-6"></a>
## PHASE 6: GIAO DIỆN QUẢN LÝ CRAWLER

### 6.1 Hiện trạng

- Có 3 pages: RSS feeds, Configs, History
- **Cần cải thiện:** Pipeline view, real-time status, retry failed, statistics dashboard

### 6.2 Kế hoạch nâng cấp

#### Task 6.2.1: Crawler Dashboard

**File mới/cập nhật:** `src/app/@admin/(dashboard)/admin/crawler/page.tsx`

```
┌─────────────────────────────────────────────────────────────────┐
│ Crawler Dashboard                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│ │ Đang crawl│ │ Hoàn thành│ │ Thất bại  │ │ Tổng hôm  │       │
│ │    3      │ │    156    │ │    12     │ │ nay: 171  │       │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
│                                                                 │
│ Pipeline đang xử lý                                             │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ URL                  │ Step        │ Progress │ Time     │   │
│ │ example.com/article1 │ 🔄 SEO OPT │ 75%     │ 2m ago   │   │
│ │ example.com/article2 │ 🔄 SCRAPE  │ 25%     │ 1m ago   │   │
│ │ example.com/article3 │ ⏳ QUEUE   │ 0%      │ 30s ago  │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ [Tab: RSS Feeds] [Tab: Configs] [Tab: History] [Tab: Thống kê]│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Task 6.2.2: Pipeline Status View (Real-time)

**Component mới:** `src/components/admin/crawler/pipeline-status.tsx`

```
Mỗi URL đang crawl hiển thị pipeline progress:

┌─────────────────────────────────────────────────────────┐
│ https://example.com/article-title-here                   │
│                                                          │
│ [DISCOVER] → [SCRAPE] → [PROCESS] → [SEO] → [PUBLISH]  │
│     ✅          ✅          🔄         ⏳        ⏳      │
│                                                          │
│ Current: Processing content (downloading images...)      │
│ Started: 2 minutes ago                                   │
│ Source: RSS Feed "Tech News"                             │
└─────────────────────────────────────────────────────────┘
```

**Hành động:**
1. Poll `GET /crawler/pipeline-status` mỗi 5 giây (khi có items in progress)
2. Stepper component hiển thị 5 bước pipeline
3. Khi fail → hiển thị error message + "Retry from [step]" button
4. Khi complete → link đến post đã tạo

#### Task 6.2.3: Crawler History Cải Thiện

**Hành động:**
1. Thêm filter: status (SUCCESS/FAILED/PENDING), source (RSS/Manual), date range
2. Failed items: hiển thị error message + retry button
3. Bulk retry: chọn nhiều failed items → retry cùng lúc
4. Export history to CSV
5. Statistics: success rate chart, crawl volume over time, avg processing time

#### Task 6.2.4: RSS Feed Management - Non-Tech Friendly (QUAN TRỌNG)

**Mục tiêu:** Admin non-tech chỉ cần paste URL → hệ thống tự lo mọi thứ

**"1-Click Add RSS" Flow (Wizard UX):**
```
┌─────────────────────────────────────────────────────────────────┐
│ Thêm nguồn tin mới                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Bước 1: Paste URL                                               │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ 🔗 Nhập URL website hoặc RSS feed:                       │   │
│ │ [https://example.com/blog_________________________________]│   │
│ │                                      [🔍 Kiểm tra]        │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Bước 2: Xác nhận (auto-detected)                                │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ ✅ Phát hiện RSS Feed!                                    │   │
│ │                                                           │   │
│ │ Tên:     Example Blog - Tin Công Nghệ                    │   │
│ │ RSS URL: https://example.com/feed.xml                     │   │
│ │ Số bài:  25 bài viết                                      │   │
│ │                                                           │   │
│ │ 📰 Xem trước 3 bài mới nhất:                             │   │
│ │  1. "Top 10 xu hướng AI 2026" (2 giờ trước)             │   │
│ │  2. "Hướng dẫn Python cơ bản" (5 giờ trước)             │   │
│ │  3. "Review MacBook Pro M5" (1 ngày trước)               │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Bước 3: Cài đặt (smart defaults, admin có thể bỏ qua)         │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Danh mục: [Tin học Quốc tế ▼]  ← BẮT BUỘC chọn          │   │
│ │                                                           │   │
│ │ Tần suất cập nhật:                                        │   │
│ │  ○ Mỗi 1 giờ (cập nhật liên tục)                        │   │
│ │  ● Mỗi 3 giờ (khuyến nghị)        ← default             │   │
│ │  ○ Mỗi 6 giờ (tiết kiệm)                                │   │
│ │  ○ Mỗi ngày (8h sáng)                                    │   │
│ │  ○ Chỉ crawl thủ công                                    │   │
│ │                                                           │   │
│ │ Tự động xuất bản: [✅ Bật] (bài crawl sẽ tự publish)    │   │
│ │                                                           │   │
│ │ 🔧 Cài đặt nâng cao (ẩn mặc định, click để mở)          │   │
│ │  ├── CSS Selectors (auto-detected): [h1.title___]        │   │
│ │  ├── Scraper type: [Static (nhanh) ▼]                    │   │
│ │  └── Cron expression: [0 */3 * * *]                      │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│          [Hủy]                   [✅ Thêm nguồn tin]           │
└─────────────────────────────────────────────────────────────────┘
```

**Key UX Principles cho Non-Tech:**
1. **Không hiển thị thuật ngữ kỹ thuật** trừ khi mở "Cài đặt nâng cao"
   - "Cron expression" → "Tần suất cập nhật" (dropdown dễ hiểu)
   - "CSS Selector" → ẩn trong nâng cao, auto-detect
   - "Static/Dynamic scraper" → ẩn, auto-detect
2. **Smart defaults**: Hệ thống auto-detect mọi thứ, admin chỉ cần chọn category
3. **Preview trước khi commit**: Luôn hiển thị preview bài viết trước khi crawl
4. **Error messages bằng tiếng Việt đơn giản**:
   - ❌ "Failed to parse RSS XML" → ❌ "Không thể đọc nguồn tin này. Vui lòng kiểm tra URL."
   - ❌ "Connection timeout" → ❌ "Website không phản hồi. Thử lại sau."
   - ❌ "Invalid selector" → ❌ "Không thể tự động nhận dạng nội dung. Liên hệ kỹ thuật."

**Components cần tạo:**
1. **`AddRssFeedWizard`** - Multi-step wizard (3 bước)
2. **`RssFeedPreview`** - Preview items từ RSS feed
3. **`CronPresetSelector`** - Dropdown tần suất thân thiện (không show cron expression)
4. **`SmartDetectStatus`** - Hiển thị kết quả auto-detect (loading → success/error)

**RSS Feed List cũng cần cải thiện:**
1. Hiển thị trạng thái rõ ràng: "Đang hoạt động ✅", "Tạm dừng ⏸", "Lỗi ❌"
2. "Lần cập nhật tiếp: 14:30 hôm nay" thay vì "cron: 0 */3 * * *"
3. Success rate per feed (biểu đồ mini)
4. "Preview" button: xem 5 items mới nhất mà không crawl
5. Toggle On/Off cho mỗi feed (thay vì checkbox isActive)

**Hành động:**
1. Tạo `AddRssFeedWizard` (3-step) thay thế form hiện tại
2. Gọi API `POST /crawler/smart-detect` khi paste URL
3. Gọi API `GET /crawler/cron-presets` cho dropdown tần suất
4. Fallback: nếu auto-detect fail → hiển thị form manual nhưng với hướng dẫn rõ ràng
5. Refactor RSS feed list: bỏ technical terms, thêm visual status indicators

---

<a id="phase-7"></a>
## PHASE 7: AI WRITER UI - MULTI API KEY

### 7.1 Hiện trạng

- Post create page có AI generation
- AI key management trong Settings
- Status polling cho generation jobs
- **Cần cải thiện:** Provider health display, key usage statistics, better UX for generation flow, template selection

### 7.2 Kế hoạch nâng cấp

#### Task 7.2.1: AI Key Management Dashboard

**File:** `src/app/@admin/(dashboard)/admin/settings/ai-keys/page.tsx`

```
┌─────────────────────────────────────────────────────────────────┐
│ Quản lý API Keys AI                            [+ Thêm key mới]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Tình trạng Providers (12+ providers hỗ trợ)                    │
│ ┌────────────┬────────────┬────────────┬────────────┐          │
│ │ 🟢 Groq    │ 🟢 Gemini  │ 🟢 Cerebras│ 🟢 SambaNova│         │
│ │ 3 keys     │ 5 keys     │ 2 keys     │ 1 key      │          │
│ │ 1200/14400 │ 800/1500   │ 500/1000   │ 300/1000   │          │
│ └────────────┴────────────┴────────────┴────────────┘          │
│ ┌────────────┬────────────┬────────────┬────────────┐          │
│ │ 🟢 Mistral │ 🟢 DeepSeek│ 🟡 Together│ 🟡 Claude  │          │
│ │ 2 keys     │ 1 key      │ 1 key      │ 1 key      │          │
│ │ 600/1000   │ 400/∞      │ 200/500    │ 45/50      │          │
│ └────────────┴────────────┴────────────┴────────────┘          │
│ ┌────────────┬────────────┬────────────┬────────────┐          │
│ │ ⚪ Cohere  │ ⚪ OpenAI  │ 🟢 OpenRouter│⚪ Hyperbolic│         │
│ │ 0 keys     │ 0 keys     │ 1 key      │ 0 keys     │          │
│ │ -/-        │ -/-        │ 100/free   │ -/-        │          │
│ └────────────┴────────────┴────────────┴────────────┘          │
│                                                                 │
│ Tổng capacity hôm nay: ~18,500 requests (FREE)                │
│                                                                 │
│ Danh sách Keys                                                  │
│ ┌──────────────────────────────────────────────────────────┐    │
│ │ Label      │ Provider │ Status  │ Usage │ Quota  │ Action│    │
│ │ Project A  │ Gemini   │ 🟢 OK   │ 450   │ 1500   │ [🗑]  │    │
│ │ Project B  │ Gemini   │ 🟡 Rate │ 1500  │ 1500   │ [🗑]  │    │
│ │ Free tier  │ Groq     │ 🟢 OK   │ 200   │ 14400  │ [🗑]  │    │
│ │ API Key 1  │ Claude   │ 🔴 Quota│ 50    │ 50     │ [🗑]  │    │
│ └──────────────────────────────────────────────────────────┘    │
│                                                                 │
│ Sử dụng hôm nay                                                │
│ [Bar chart: usage per provider per hour]                        │
│                                                                 │
│ Fallback Order: Groq → Gemini → Claude → OpenAI                │
│ (Tự động tối ưu dựa trên health status)                        │
└─────────────────────────────────────────────────────────────────┘
```

**Hành động:**
1. Hiển thị provider health cards (từ API `GET /ai-content/provider-health`)
2. Key list table với status badges (Active, Rate Limited, Quota Exceeded, Error)
3. Usage chart (Recharts bar chart)
4. Add key dialog: provider select (12+ providers), key input (masked), label, daily quota
   - Provider dropdown grouped:
     - "Khuyến nghị (Free tier cao)" → Groq, Cerebras, SambaNova, Gemini
     - "Chất lượng cao" → DeepSeek, Mistral, Claude, OpenAI
     - "Aggregator" → OpenRouter, Together
     - "Khác" → Cohere, Hyperbolic
   - Mỗi provider hiển thị: tên + free tier limit info
   - Link "Cách lấy API key miễn phí →" cho mỗi provider (mở tab mới)
5. Real-time status update (poll mỗi 30 giây)
6. Hiển thị "Tổng capacity hôm nay: ~X requests (FREE)" dựa trên tổng keys

#### Task 7.2.2: AI Writer Flow Cải Thiện

**File:** Post create/edit page (AI generation section)

```
┌─────────────────────────────────────────────────────────────────┐
│ Tạo bài viết bằng AI                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Chủ đề *                                                        │
│ [Hướng dẫn sử dụng PivotTable trong Excel 2021________________]│
│                                                                 │
│ Danh mục *        │ Template                                    │
│ [MOS Excel ▼]     │ [Hướng dẫn (How-to) ▼]                    │
│                   │ ├── Bài viết thông thường                   │
│                   │ ├── Hướng dẫn (How-to)                     │
│                   │ ├── Listicle (Top 10...)                    │
│                   │ ├── So sánh (Comparison)                    │
│                   │ └── Review/Đánh giá                         │
│                                                                 │
│ Độ dài            │ Ngôn ngữ                                    │
│ [Dài (2000+ từ) ▼]│ [Tiếng Việt ▼]                            │
│                                                                 │
│ Provider ưu tiên (tuỳ chọn)                                    │
│ [Tự động (khuyến nghị) ▼]                                      │
│ ├── Tự động (Groq → Gemini → Claude → OpenAI)                 │
│ ├── Groq (Llama 3.3 - Nhanh nhất)                              │
│ ├── Gemini (2.0 Flash - Cân bằng)                              │
│ ├── Claude (Haiku 4.5 - Chất lượng)                            │
│ └── OpenAI (GPT-4o-mini - Premium)                              │
│                                                                 │
│                   [🚀 Tạo bài viết]                             │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ ⏳ Đang tạo bài viết...                                  │   │
│ │ [████████████████████░░░░░░░] 75%                         │   │
│ │                                                           │   │
│ │ ✅ Tạo nội dung (Groq - 3.2s)                           │   │
│ │ ✅ Tạo ảnh thumbnail (Gemini - 5.1s)                    │   │
│ │ 🔄 Tạo ảnh minh họa 2/4...                              │   │
│ │ ⏳ Tối ưu SEO                                            │   │
│ │ ⏳ Hoàn tất                                               │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ 💡 Tip: Thêm nhiều API key để tăng tốc độ và độ ổn định       │
└─────────────────────────────────────────────────────────────────┘
```

**Hành động:**
1. Template selection dropdown
2. Length option (short/medium/long)
3. Provider preference selector (optional, default: auto)
4. Progress UI chi tiết hơn: hiển thị mỗi step + provider used + time taken
5. Error retry: nếu fail, hiển thị "Thử lại với provider khác" button
6. Capacity indicator: "Còn khả dụng: ~50 bài hôm nay (Groq: 30, Gemini: 20)"

#### Task 7.2.3: Batch AI Generation

**File mới:** `src/app/@admin/(dashboard)/admin/posts/ai-batch/page.tsx`

```
┌─────────────────────────────────────────────────────────────────┐
│ Tạo bài viết hàng loạt bằng AI                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Danh sách chủ đề (1 dòng = 1 bài viết)                        │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ 1. Hướng dẫn PivotTable Excel 2021                       │   │
│ │ 2. Cách sử dụng VLOOKUP nâng cao                         │   │
│ │ 3. Top 10 phím tắt Excel hữu ích                         │   │
│ │ 4. So sánh Excel vs Google Sheets                         │   │
│ │ 5.                                                         │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Danh mục: [MOS Excel ▼]  Template: [Tự động ▼]                │
│                                                                 │
│ Ước tính: 4 bài × ~5 phút = ~20 phút                           │
│ API capacity: Đủ (Groq: 1200 remaining)                        │
│                                                                 │
│                   [🚀 Bắt đầu tạo]                             │
│                                                                 │
│ Tiến độ:                                                        │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ 1. PivotTable Excel         ✅ Hoàn thành  [Xem]         │   │
│ │ 2. VLOOKUP nâng cao         🔄 Đang tạo... 60%           │   │
│ │ 3. Phím tắt Excel           ⏳ Chờ xử lý                 │   │
│ │ 4. Excel vs Google Sheets   ⏳ Chờ xử lý                 │   │
│ └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Hành động:**
1. Textarea cho nhiều topics (1 dòng = 1 topic)
2. Shared settings: category, template, length
3. Queue tất cả topics vào BullMQ
4. Poll status cho từng job
5. Link đến post đã tạo khi hoàn thành

---

<a id="phase-8"></a>
## PHASE 8: TỐI ƯU PERFORMANCE & UX

### 8.1 Performance Optimization

#### Task 8.1.1: Image Optimization

**Hành động:**
1. Sử dụng `next/image` cho tất cả images (kiểm tra lại, có thể đang dùng `<img>`)
2. Lazy loading cho images below the fold
3. AVIF/WebP format (đã có trong config, verify implementation)
4. Responsive images: `sizes` attribute cho mỗi image context
5. Blur placeholder: generate blurDataURL cho thumbnails

#### Task 8.1.2: Bundle Optimization

**Hành động:**
1. Review `optimizePackageImports` trong next.config → thêm packages lớn còn thiếu
2. Dynamic import cho heavy components:
   - Tiptap editor: `dynamic(() => import('@/components/admin/shared/editor'), { ssr: false })`
   - Recharts: `dynamic(() => import('@/components/charts'), { ssr: false })`
   - SeoAnalysisPanel: lazy load khi user mở panel
3. Code splitting per route (Next.js đã tự làm, verify)
4. Tree shaking: import cụ thể từ lucide-react, lodash

#### Task 8.1.3: Caching Strategy

**Hành động:**
1. ISR review:
   - Post list: revalidate 30 min (giữ nguyên)
   - Post detail: revalidate 10 min (giữ nguyên)
   - Course list: revalidate 30 min (thêm mới)
   - Course detail: revalidate 10 min (thêm mới)
   - Sitemap: revalidate 60 min
2. TanStack Query cache:
   - staleTime: 60s → tùy theo endpoint:
     - User session: 5 min (đã có)
     - Post list: 2 min
     - Categories: 10 min
     - SEO data: 5 min
   - Prefetch popular routes on hover
3. Service Worker: cache static assets (fonts, icons)

### 8.2 UX Improvements

#### Task 8.2.1: Loading States

**Hành động:**
1. Skeleton loading cho mọi data-driven page (đã có NewsCardSkeleton, cần thêm)
2. Tạo skeletons: CourseCardSkeleton, UserTableSkeleton, PostTableSkeleton
3. Optimistic updates cho mutations (status change, delete, etc.)
4. Progress indicators cho long-running operations

#### Task 8.2.2: Error Handling

**Hành động:**
1. Error boundaries cho mỗi major section
2. Toast notifications cho success/error (đã có sonner, verify usage)
3. Retry buttons cho failed API calls
4. Offline indicator + queue mutations

#### Task 8.2.3: Responsive Admin Dashboard

**Hành động:**
1. Mobile-friendly sidebar (collapse to bottom nav on mobile)
2. Responsive tables: horizontal scroll on mobile, card view option
3. Touch-friendly interactions (larger tap targets)
4. Test trên các kích thước: 375px (mobile), 768px (tablet), 1024px+ (desktop)

### 8.3 Accessibility

**Hành động:**
1. ARIA labels cho interactive elements
2. Keyboard navigation support
3. Focus management khi open/close modals
4. Color contrast check (WCAG 2.1 AA)
5. Screen reader friendly: proper heading hierarchy, alt texts

---

## CHECKLIST TỔNG HỢP

| Phase | Task | Priority | Complexity |
|-------|------|----------|------------|
| 1 | Dynamic Sidebar based on Permissions | HIGH | Medium |
| 1 | PermissionGate Component | HIGH | Low |
| 1 | Role Management UI | HIGH | High |
| **1** | **Admin Phân Quyền Cho User (Gán role, GRANT/DENY, Preview)** | **CRITICAL** | **High** |
| 1 | Permission Denied Page | MEDIUM | Low |
| 2 | User List Page Nâng Cấp | HIGH | Medium |
| 2 | User Detail Page | HIGH | High |
| 2 | Create User Dialog | MEDIUM | Low |
| 2 | User Statistics Dashboard | LOW | Medium |
| 3 | Admin Course Management UI | HIGH | High |
| **3** | **Course Theming & Live Preview** | **HIGH** | **Medium** |
| 3 | Public Course Display (Subdomains) | HIGH | High |
| 3 | Course SEO on Subdomains | HIGH | Medium |
| 4 | Breadcrumb cho Search Results | HIGH | Medium |
| 4 | Sitelinks Search Box | MEDIUM | Medium |
| 4 | Subdomain SEO Independence | HIGH | High |
| 4 | Navigation Schema | MEDIUM | Low |
| **4** | **SEO Multi-Engine (Google AI Search, CocCoc, Bing, Apple, Yandex)** | **HIGH** | **High** |
| **4** | **Keyword Suggestion UI (Đề xuất từ khóa hot)** | **HIGH** | **High** |
| **4** | **Review/Rating SEO — Rich Snippets UI + Admin Moderation Dashboard** | **CRITICAL** | **High** |
| 4 | Wider Keyword Targeting UI | MEDIUM | Medium |
| 5 | SEO Dashboard Page | HIGH | High |
| 5 | SEO Score Detail Panel | HIGH | Medium |
| 5 | SEO Score Badge on Post List | MEDIUM | Low |
| 6 | Crawler Dashboard | MEDIUM | Medium |
| 6 | Pipeline Status View | MEDIUM | Medium |
| 6 | Crawler History Cải Thiện | MEDIUM | Medium |
| **6** | **RSS Feed Wizard - Non-Tech Friendly (1-Click Add)** | **HIGH** | **Medium** |
| 7 | AI Key Management Dashboard (12+ providers) | HIGH | Medium |
| 7 | AI Writer Flow Cải Thiện | HIGH | Medium |
| 7 | Batch AI Generation | MEDIUM | Medium |
| 8 | Image Optimization | HIGH | Medium |
| 8 | Bundle Optimization | HIGH | Medium |
| 8 | Caching Strategy | MEDIUM | Medium |
| 8 | Loading States | MEDIUM | Low |
| 8 | Error Handling | MEDIUM | Low |
| 8 | Responsive Dashboard | LOW | Medium |
| 8 | Accessibility | LOW | Medium |

---

## THỨ TỰ THỰC HIỆN ĐỀ XUẤT

```
Sprint 1 (Nền tảng):     Phase 1 (RBAC UI + Phân quyền user) → Phase 2 (User Management)
Sprint 2 (Nội dung):     Phase 3 (Course UI + Theming) → Phase 6 (Crawler Non-Tech Friendly)
Sprint 3 (SEO):          Phase 4 (SEO Multi-Engine + Keywords) → Phase 5 (SEO Scoring)
Sprint 4 (AI & Perf):    Phase 7 (AI Writer 12+ providers) → Phase 8 (Performance)
```

> **Lưu ý cho Agent:**
> - Frontend tasks phụ thuộc Backend APIs tương ứng → đảm bảo BE APIs ready trước khi làm FE
> - Sử dụng existing UI components từ `src/components/ui/` (Radix UI) thay vì tạo mới
> - Tuân thủ Tailwind CSS 4 conventions đã có trong project
> - Test responsive trên mobile/tablet/desktop
> - SEO pages phải có `generateMetadata()` đúng chuẩn
> - Admin pages phải wrap với `PermissionGate` khi Phase 1 hoàn thành
> - UX cho non-tech admin: tránh thuật ngữ kỹ thuật, dùng wizard/step-by-step, smart defaults
> - Error messages phải bằng tiếng Việt, dễ hiểu, có hướng dẫn khắc phục

---

## LIÊN KẾT VỚI BACKEND

| Frontend Phase | Backend Phase Phụ Thuộc | Mô tả |
|----------------|------------------------|-------|
| FE Phase 1 (RBAC UI) | BE Phase 1 (RBAC API) | Cần API feature-map, roles CRUD, audit logs, **user permission CRUD, preview** |
| FE Phase 2 (Users) | BE Phase 2 (Users API) | Cần API search, detail, activity, bulk actions |
| FE Phase 3 (Courses) | BE Phase 3 (Courses API) | Cần API courses CRUD, enrollment, syllabus, **theme presets** |
| FE Phase 4 (SEO) | BE Phase 4 (SEO Engine) | Cần API subdomain config, **keyword suggestion, multi-engine submission**, **reviews admin CRUD + aggregateRating schema** |
| FE Phase 5 (SEO Score) | BE Phase 5 (SEO Scoring) | Cần API scoring detail, dashboard, history |
| FE Phase 6 (Crawler) | BE Phase 6 (Crawler Refactor) | Cần API pipeline status, retry, **smart-detect, cron-presets** |
| FE Phase 7 (AI Writer) | BE Phase 7 (AI Multi-key) | Cần API **12+ provider health**, batch generate |
| FE Phase 8 (Perf) | BE Phase 8 (Optimization) | Cần BE **startup < 3s**, tách seed data |

---

<a id="phase-9"></a>
## PHASE 9: CODE QUALITY & TECHNICAL DEBT (Từ REVIEW-VERIFIED)

### 9.1 Giai quyết các Vấn Đề Tech Debt Từ REVIEW-VERIFIED.md
- **B-M6**: Xoá mock data cứng cho trang MOS trong `pagesApi.getPage()`
- **B-L4**: Xóa duplicate `notFound()` check (trong `src/app/@tinhocquocte/khoa-hoc/[slug]/page.tsx`)
- **B-L5**: Xóa các dòng `console.log` còn sót trên production
- **B-L6**: Refactor để giảm tỷ lệ sử dụng `any` type trong các file API và hooks (120+ vị trí)

### 9.2 Hoàn Thiện Security Data Flow
- **B-M12**: Hoàn thiện `middleware.ts` đang bị rỗng (pass-through). Thêm Rate Limiting giả lập FE, CSP/Security headers, Subdomain routing validation.
