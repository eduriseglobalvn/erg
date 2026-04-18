# HƯỚNG DẪN SỬ DỤNG CRAWLER V2.0

> **Phiên bản:** 2.0.0 | **Ngày:** 2026-03-28
> **Trạng thái:** Hướng dẫn đầy đủ cho Admin

---

## Mục lục

1. [Tổng quan Dashboard](#1-tổng-quan-dashboard)
2. [Quản lý RSS Feeds](#2-quản-lý-rss-feeds)
3. [Crawl có chọn lọc (Selective)](#3-crawl-có-chọn-lọc-selective)
4. [Crawl theo Topic (Trending)](#4-crawl-theo-topic-trending)
5. [Lịch sử Crawl + Quality Score](#5-lịch-sử-crawl--quality-score)
6. [AI Quota Meter](#6-ai-quota-meter)
7. [Notification Channels](#7-notification-channels)
8. [Blacklist Management](#8-blacklist-management)
9. [Sitemap Crawl](#9-sitemap-crawl)
10. [Smart Selector AI](#10-smart-selector-ai)
11. [Cấu hình Scraper + Batch Tester](#11-cấu-hình-scraper--batch-tester)
12. [BOT Commands (Discord/Telegram)](#12-bot-commands-disordtelegram)
13. [Crawl V2 Pipeline Real-time](#13-crawl-v2-pipeline-real-time)
14. [Daily Digest](#14-daily-digest)

---

## 1. Tổng quan Dashboard

Truy cập: **Admin → Crawler**

Dashboard V2 hiển thị 8 phần chính:

```
┌──────────────────────────────────────────────────────┐
│ 🔥 CRAWLER COMMAND CENTER                            │
├──────────┬──────────┬──────────┬──────────┬────────────┤
│ 📰 RSS   │ ✅ OK    │ ❌ FAIL  │ 📊 Rate │ 🤖 AI      │
│ Sources  │          │          │          │            │
│  12      │ 1,847   │   143   │  92.8%  │ 847/1500   │
├──────────┴──────────┴──────────┴──────────┴────────────┤
│ 🔥 TRENDING NOW      │ 📡 ACTIVE PIPELINES             │
│ 1. AI Agent 2026 [Crawl] │  vnexpress.net/bai-1  ⏱45s │
│ 2. Vietnam Economy [Crawl]│  DISCOVER→SCRAPE→[SEO]→PUB│
├───────────────────────────┴────────────────────────────┤
│ 📋 CRAWL HISTORY (15s auto-refresh)                 │
│ Title    │ Source │ Quality │ Status │ Time           │
│ [Table với quality score, source, status badges]   │
├────────────────────────────┬───────────────────────────┤
│ 🌍 DOMAIN HEALTH           │ 🤖 AI QUOTA               │
│ 🟢 vnexpress  98%         │ [████████░░░░] 847/1500  │
│ 🟡 dantri    72%          │ ⚠️ < 300 còn lại         │
└────────────────────────────┴───────────────────────────┘
```

### Cards chính

| Card | Mô tả |
|------|-------|
| **RSS Sources** | Tổng số RSS feeds đang hoạt động |
| **Success / Failed** | Bài crawl thành công/thất bại hôm nay |
| **Success Rate** | % thành công |
| **AI Quota** | Số request Gemini đã dùng / giới hạn |
| **Trending Now** | Top 5 topic đang hot (từ Google Trends) |
| **Active Pipelines** | Crawl đang chạy real-time (SSE) |
| **Crawl History** | Bảng bài viết crawl gần nhất |

---

## 2. Quản lý RSS Feeds

Truy cập: **Admin → Crawler → RSS**

### 2.1 Thêm RSS mới (Wizard 4 bước)

Nhấn **"+ Thêm Nguồn Tin"** → Wizard:

**Bước 1: Nhập URL RSS**
- Paste URL RSS (VD: `https://vnexpress.net/rss/tin-moi-nhat.rss`)
- Hệ thống tự động preview 10 bài gần nhất
- Nếu không tìm thấy RSS → Tự động probe sitemap

**Bước 2: Xác nhận**
- Tên nguồn (auto-detect hoặc nhập tay)
- Loại: **Static** (Cheerio) hoặc **Dynamic** (Playwright)

**Bước 3: Cấu hình**
- Chuyên mục: Chọn danh mục trong MySQL
- Cron: Mỗi giờ / Mỗi 6h / Mỗi ngày / Tùy chỉnh
- Auto-publish: Bật → publish ngay, Tắt → lưu draft

**Bước 4: Hoàn tất**
- Xem lại → Nhấn **"Lưu"**

### 2.2 Thao tác với RSS

| Hành động | Mô tả |
|-----------|--------|
| 🔄 Sync | Crawl ngay lập tức |
| 👁️ Peek | Xem trước 10 bài + chọn crawl từng bài |
| ⏸️ Pause | Tạm dừng auto-crawl |
| ▶️ Resume | Tiếp tục auto-crawl |
| ✏️ Edit | Sửa cấu hình |
| 🗑️ Delete | Xóa nguồn tin |

### 2.3 Tự động tìm sitemap (Smart Fallback)

Nếu URL không phải RSS (VD: nhập `https://vnexpress.net`), hệ thống tự:
1. Probe sitemap: `/sitemap.xml`, `/wp-sitemap.xml`, `/news-sitemap.xml`, v.v.
2. Parse sitemap → Liệt kê URLs → Gợi ý feeds
3. Nếu tìm được → Suggest cách thêm dưới dạng RSS

---

## 3. Crawl có chọn lọc (Selective)

### PeekDialog — Xem trước từng bài

1. Vào **RSS Management** → Nhấn **"👁️ Peek"** bên cạnh nguồn tin
2. Hiển thị 10 bài gần nhất:
   - Tiêu đề bài viết
   - Ngày publish
   - Trạng thái: ✅ Đã crawl / ⏳ Chưa crawl
3. Checkbox chọn từng bài muốn crawl
4. Nhấn **"Crawl đã chọn"** → Chỉ crawl những bài đã tick

**Use case:** Bạn chỉ muốn crawl bài về "AI Agent" trong RSS 50 bài.

---

## 4. Crawl theo Topic (Trending)

Truy cập: **Admin → Crawler → Trending**

### 4.1 Trending Topics

Hệ thống tự động phát hiện topic hot mỗi 30 phút từ:
- **Google Trends** (VN)
- **News API** (top headlines)

**Giao diện:**
```
┌─ TRENDING TOPICS ────────────────────────────────────────┐
│ 🔥 AI Agent 2026     Score: 94  Sources: Google+News  🟢│
│    Velocity: +180%   Last checked: 5 phút trước          │
│    📦 45 potential URLs   [🔄 Crawl Now] [👁 Watch]    │
├──────────────────────────────────────────────────────────┤
│ 📈 Vietnam Economy   Score: 87  Sources: Google+News  🟢│
│    Velocity: +45%    Last checked: 5 phút trước           │
│    📦 23 potential URLs  [🔄 Crawl Now] [👁 Watch]      │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Crawl Topic

1. Tìm topic trong danh sách
2. Nhấn **"🔄 Crawl Now"**
3. Hệ thống:
   - Tự tìm URLs liên quan (từ sitemap, search, RSS)
   - Lọc URLs đã crawl gần đây
   - Queue crawl jobs với BullMQ
   - Stream kết quả real-time

### 4.3 Auto-Discover RSS

Bot tự tạo RSS "tạm" cho topic:

```
🌐 auto: AI Agent 2026
  Keywords: [AI, agent, 2026]
  Sources: 3 feeds
  [ON] Auto-crawl enabled
  15 crawled today / 92% success
```

---

## 5. Lịch sử Crawl + Quality Score

Truy cập: **Admin → Crawler → History**

Bảng lịch sử mở rộng với 3 cột mới:

| Cột | Mô tả |
|-----|--------|
| **Quality** | Badge 🟢 HIGH / 🟡 MED / 🔴 LOW (dựa trên score ≥70) |
| **Source** | Topic/RSS/Manual |
| **Reason** | Lý do fail: LOW_QUALITY, BLACKLIST, DUPLICATE_CONTENT, CONTENT_TOO_OLD |

### Filter Options

- **Status:** Tất cả / Thành công / Thất bại / Pending
- **Source:** RSS / Topic / Manual
- **Quality:** HIGH / MED / LOW
- **Date range**
- **Search URL/title**

### Quality Score Chi tiết

Click vào badge Quality → Xem breakdown 8 rule checks:
```
Quality Score: 72/100

✅ Word count:     25/25 (1,500 words)
✅ Headings:       12/15 (4 headings)
✅ Images:          10/10 (5 images)
✅ Text ratio:      10/15 (12%)
✅ Blacklist:       15/15 (pass)
⚠️  Freshness:      2/10 (25 days old)
✅ URL legitimacy: 10/10 (pass)
✅ Ad density:      pass
```

---

## 6. AI Quota Meter

AI Quota hiển thị ở Dashboard (auto-refresh 60s):

```
Gemini  [████████░░░░░░░░] 847/1500 (56%)
       Remaining: 653 requests
       ⚠️ Warning: < 300 requests còn lại
```

### Màu sắc trạng thái

| % Sử dụng | Màu | Trạng thái |
|-----------|-----|-----------|
| 0-60% | 🟢 Xanh lá | **OK** — Bình thường |
| 60-85% | 🟡 Vàng | **WARNING** — Cần theo dõi |
| 85%+ | 🔴 Đỏ | **CRITICAL** — Sắp hết quota |

### Per-Key Breakdown

Nhấn **"Chi tiết từng key"** (expandable):
```
Key 1 (primary)    [████████████░░░░░░] 500/1500 (33%)   🟢
Key 2 (fallback)    [██████░░░░░░░░░░░] 347/1500 (23%)   🟢
```

### Alert tự động

- `< 20% remaining` → Discord/Telegram gửi **system.warning**
- `< 5% remaining` → **system.critical** alert

---

## 7. Notification Channels

Truy cập: **Admin → Notifications → Settings**

### 7.1 Discord

**Setup:**
1. Nhập **Webhook URL** (từ Discord Developer Portal)
2. Nhấn **"Test Message"** — Verify
3. Bật/tắt từng loại notification

**Discord gửi:**
```
✅ Crawl thành công!
📰 AI Agent 2026: Hướng dẫn toàn tập
🌐 Nguồn: vnexpress.net
📊 Quality: 85/100
→ Xem bài: [Link]
```

### 7.2 Telegram

**Setup:**
1. Nhập **Bot Token** (từ @BotFather)
2. Nhấn **"Test Message"**
3. Bật/tắt notification types

**Telegram gửi kèm inline buttons:**
```
✅ Crawl thành công!
📰 AI Agent 2026: Hướng dẫn toàn tập
🌐 Nguồn: vnexpress.net

[View Post] [Edit] [Publish Now]
```

### 7.3 Per-event Settings

| Sự kiện | Discord | Telegram | In-App |
|---------|--------|---------|--------|
| crawl.success | ✅ | ✅ | ✅ |
| crawl.failed | ✅ | ✅ | ✅ |
| trending.keyword_emerged | ✅ | ✅ | ✅ |
| daily.digest (8h sáng) | ✅ | ✅ | ✅ |
| system.warning | ✅ | ✅ | ✅ |
| system.critical | ✅ | ✅ | ✅ |

---

## 8. Blacklist Management

Truy cập: **Admin → Crawler → Blacklist**

Ngăn chặn content/domain/keyword không mong muốn ngay từ đầu.

### 8.1 Các loại Blacklist

| Loại | Ví dụ | Áp dụng cho |
|------|--------|------------|
| **Domain** | `spam-site.net` | URL hostname match |
| **Keyword** | `casino online` | Nội dung HTML |
| **Pattern** | `click here to continue` | Regex match trong content |

### 8.2 Thêm Entry

Nhấn **"+ Thêm Blacklist"**:

```
Type:     [Domain ▼]
Value:    malware-site.com
Reason:   Malware distribution site
Expires:   [Never ▼]

[Ngày hết hạn: Optional — tự động xóa sau ngày này]
```

**Soft-delete:** Entry không bị xóa hẳn mà chỉ bị deactive (`isActive=false`).

### 8.3 Blacklist trong Quality Gate

Khi crawl, `BlacklistService.isBlocked()` được gọi:
1. **Domain check:** hostname match → instant reject
2. **Keyword check:** content.includes(keyword) → instant reject
3. **Pattern check:** regex.test(content) → instant reject

→ Không gọi AI, không tốn quota!

---

## 9. Sitemap Crawl

### 9.1 Tự động (RSS Wizard Fallback)

Khi nhập website URL (không phải RSS):
1. Hệ thống probe 8 sitemap paths phổ biến
2. Parse sitemap → Liệt kê URLs
3. Suggest feeds từ sitemap

### 9.2 Manual Sitemap Discover

**Admin → Crawler → Configs → Sitemap**

```
Discover Sitemap:
URL: https://vnexpress.net/sitemap.xml

[Discover]

Results:
✅ Found: https://vnexpress.net/sitemap.xml
   └─ 2,847 URLs found

✅ Found: https://vnexpress.net/news-sitemap.xml
   └─ 845 URLs found
```

### 9.3 Parse Sitemap

```
URL: https://vnexpress.net/sitemap.xml

[Parse Sitemap]

Found 3,692 URLs:
  1. https://vnexpress.net/ai-agent-2026 (2026-03-27)
  2. https://vnexpress.net/tech-layoffs (2026-03-26)
  ...

Filter: Only recent (≤ 7 days)
→ 45 recent URLs
→ [Crawl All 45]
```

---

## 10. Smart Selector AI

**Admin → Crawler → Configs → Selector Tester**

AI tự phân tích HTML → Suggest CSS selectors:

### 10.1 Auto-Detect

1. Nhập URL: `https://vnexpress.net/ai-agent-2026`
2. Nhấn **"🔮 Phân tích AI"**
3. AI phân tích → Trả về:

```
┌─ KẾT QUẢ PHÂN TÍCH ──────────────────────────────────┐
│ 🔧 CMS: WordPress (confidence: 92%)                   │
│ 📄 Type: News article (confidence: 88%)               │
├────────────────────────────────────────────────────┤
│ Title:       h1.article-title       (confidence: 95%)│
│ Content:     div.article-body        (confidence: 90%)│
│ Thumbnail:   meta[property="og:image"] (conf: 99%)  │
│ Author:      a.author-name            (confidence: 75%)│
│ PublishDate: time.publish-date       (confidence: 80%)│
├────────────────────────────────────────────────────┤
│ Reasoning: Page uses standard WordPress news theme.  │
│ Article body is in div with class 'article-body'.  │
└────────────────────────────────────────────────────┘

[Apply Selectors]  [Copy to Clipboard]
```

### 10.2 Áp dụng Selectors

Nhấn **"Apply Selectors"** → Tự động điền vào form Scraper Config:
- Selector cho title, content, thumbnail, author, date
- Lưu dưới tên domain

---

## 11. Cấu hình Scraper + Batch Tester

**Admin → Crawler → Configs**

### 11.1 Scraper Config Table

| Domain | Type | Status | Actions |
|--------|------|--------|---------|
| vnexpress.net | STATIC | 🟢 Active | Test / Edit / Delete |
| dantri.com.vn | DYNAMIC | 🟡 Degraded | Test / Edit / Delete |

### 11.2 Selector Tester (Single URL)

Nhập URL + Category → Nhấn **"Test"** → Xem:
- Title extracted
- Content length
- Error (nếu có)

### 11.3 Batch Tester (Nhiều URLs)

```
Nhập URLs (mỗi dòng 1 URL, tối đa 50):

https://vnexpress.net/ai-agent-2026
https://vnexpress.net/tech-salaries-2026
https://dantri.com.vn/startup-news
...

Type: [STATIC ▼]

[🚀 Run Batch Test]

Progress: [████████░░░░░░░░░░] 40%
┌──────────────────────────────────────────────────┐
│ URL                    │ Status │ Title    │ Len  │
│ vnexpress.net/ai-...  │ ✅ OK  │ AI Agent │ 4.2K │
│ dantri.com.vn/startup  │ ✅ OK  │ Startup  │ 3.8K │
│ blocked-site.com/page   │ ❌ 429 │ —       │ —    │
└──────────────────────────────────────────────────┘

[Export CSV]
```

---

## 12. BOT Commands (Discord/Telegram)

### Quick Start

**Discord:** `/start`
**Telegram:** `/start`

Bot reply:
```
👋 Xin chào! Đây là ERG Crawler Bot.

Dùng /help để xem danh sách commands.
```

### 12.1 RSS Management

```
/rss                    → Danh sách RSS feeds
/rss add               → Wizard thêm RSS mới
/rss add https://...    → Thêm nhanh với URL
/rss del [id]          → Xóa RSS
/rss pause [id]        → Tạm dừng
/rss resume [id]        → Tiếp tục
/rss sync [id]          → Sync ngay
/rss stats [id]        → Stats per RSS
```

### 12.2 Crawl

```
/crawl https://vnexpress.net/bai-viet  → Crawl URL
/crawl feed [rssId]    → Crawl toàn bộ feed
/crawl topic AI Agent   → Crawl topic
/crawl batch [id] 10   → Crawl 10 bài đầu
/crawl stop [jobId]     → Dừng job
/crawl retry [url]     → Retry fail
/crawl history         → Lịch sử gần đây
```

### 12.3 Trending

```
/trending              → Top 5 trending
/trending 10           → Top 10
/trending crawl [id]   → Crawl keyword
/keyword add AI 2026   → Thêm keyword tracking
/keyword del [id]      → Xóa keyword
```

### 12.4 Drafts

```
/drafts                → Danh sách drafts gần đây
/drafts today          → Drafts hôm nay
/draft [postId]        → Chi tiết 1 draft
/draft approve [postId] → Publish ngay
/draft reject [postId] Lý do → Reject
```

### 12.5 Stats

```
/stats                 → Tổng quan
/stats ai              → AI quota usage
/stats quality        → Quality pass rate
/stats rss            → Stats per RSS
```

### 12.6 System

```
/pause                 → Pause TẤT CẢ auto-crawl
/resume                 → Resume tất cả
/health                → Health check
/settings              → Cài đặt notification
/notify on crawl.failed → Bật notification
/notify off daily.digest → Tắt digest
```

### 12.7 Account

```
/link                  → Bắt đầu linking
/link ABC123           → Verify code từ web
/unlink                → Hủy link
/account              → Xem account đã link
```

---

## 13. Crawl V2 Pipeline Real-time

SSE stream cập nhật mỗi < 1 giây khi crawl đang chạy:

```
✅ vnexpress.net/ai-agent-2026
   DISCOVER (5%) → SCRAPE (10%) → PROCESS (30%) →
   QUALITY (45%) → DEDUP (50%) → IMAGES (55%) →
   SEO (65%) → PUBLISH (80%) → ✅ COMPLETE (100%)
   Thời gian: 28 giây | Quality: 85/100
```

### Trạng thái Pipeline

| Trạng thái | Màu | Mô tả |
|------------|-----|--------|
| DISCOVER | 🔵 Xanh dương | Đang tìm URLs |
| SCRAPE | 🟡 Vàng | Đang tải HTML |
| PROCESS | 🟠 Cam | Đang xử lý quality + dedup |
| SEO | 🟣 Tím | Đang gọi AI |
| PUBLISH | 🔵 Xanh dương | Đang lưu draft |
| COMPLETED | 🟢 Xanh lá | Hoàn tất |
| FAILED | 🔴 Đỏ | Thất bại (hover xem lỗi) |

---

## 14. Daily Digest

**Tự động gửi lúc 8h sáng** (configurable)

### Nội dung Digest

```
📊 Daily Digest - 28/03/2026

🔢 Hôm nay:
• Bài cào thành công: 187
• Bài thất bại: 14
• Topic hot mới: 3
• AI quota sử dụng: 847/1500 (56%)

🏆 Top Keywords:
1. AI Agent 2026      (Score: 94)
2. Vietnam Economy    (Score: 87)
3. Tech Layoffs       (Score: 81)

📈 Chất lượng: 92.5% pass rate
⏱️  Thời gian TB: 24 giây/bài
📁 Draft chờ duyệt: 23 bài

→ /dashboard để xem chi tiết
```

### Cài đặt Digest

```
Admin → Notifications → Settings
├── Daily Digest: [ON/OFF]
├── Time: [08:00 ▼] (0-23)
└── Timezone: Asia/Ho_Chi_Minh
```

---

## Keyboard Shortcuts

| Phím tắt | Hành động |
|---------|----------|
| `R` | Refresh dashboard |
| `S` | Sync RSS đã chọn |
| `P` | Pause/Resume |
| `H` | Toggle history panel |
| `?` | Keyboard shortcuts help |

---

## Common Workflows

### Workflow 1: Thêm topic hot mới

```
1. Mở Dashboard → Trending Now panel
2. Thấy "AI Agent 2026" (Score: 94)
3. Nhấn "Crawl Now"
4. Đợi ~30s → Kết quả stream real-time
5. Draft mới xuất hiện trong /admin/posts/drafts
6. Review → Publish
```

### Workflow 2: Crawl RSS rồi duyệt draft

```
1. RSS Management → Sync RSS "VNExpress Tin công nghệ"
2. Peek → Checkbox chọn 10 bài
3. Nhấn "Crawl đã chọn"
4. Kết quả: 8 thành công, 2 fail (quality thấp)
5. Vào Posts → Drafts → Review 8 bài
6. Edit nếu cần → Publish
```

### Workflow 3: Xử lý domain bị block

```
1. Dashboard → Domain Health → Thấy "zing.vn 🔴 Degraded (15%)"
2. Thêm vào Blacklist (Domain): zing.vn (tạm thời)
3. RSS vẫn active nhưng skip zing
4. 2 giờ sau: Thử lại zing.vn
5. Nếu recovered → Xóa khỏi Blacklist
```

### Workflow 4: Emergency — AI quota sắp hết

```
1. AI Quota meter → 🔴 CRITICAL (< 100 requests)
2. Vào /admin/notifications → Tắt daily.digest
3. Vào RSS Management → Pause tất cả RSS auto-crawl
4. Tiếp tục crawl thủ công từng bài quan trọng
5. Hoặc: Thêm Gemini API key mới (GCP project 2)
```

---

*Mọi thắc mắc → Xem `CRAWLER_V2.md` (Technical) hoặc `BOT_SETUP.md` (BOT Configuration)*
