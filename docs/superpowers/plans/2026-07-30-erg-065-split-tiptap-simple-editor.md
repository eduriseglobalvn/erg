# ERG-065 — Tách Tiptap Simple Editor và utilities

## Trạng thái

- Task: `ERG-065`
- Final: `Hoàn thành` ngày 2026-07-30.
- Mục tiêu: chia nhỏ Simple Editor và `tiptap-utils` theo ownership, giữ nguyên public API, nội dung editor, paste behavior, upload behavior và UI.
- Dependency: `ERG-066` và `ERG-067` đã hoàn thành; public CMS là canonical owner và quality gate đã hoạt động.
- Workbook: `Tất cả Task` đã ghi `Đang làm`, tiến độ 5% ngày 2026-07-30.
- Workbook closure: 100% với exact-equivalence, 3 policy tests, 7 behavior tests, 11 regression tests, full public CMS gate, governance và repository drift đều đạt.

## Baseline

- Repository: `D:/ERG/erg`; worktree đã dirty trước task và phải được bảo toàn.
- `simple-editor.tsx`: 1.003 dòng.
- `src/lib/tiptap-utils.ts`: 637 dòng.
- Không có source edit ERG-065 trước plan này.
- Full public CMS gates gần nhất của ERG-064: Node/Bun tests, lint, typecheck, security, build 67 pages, bundle, governance và drift đều đạt.

## Invariants

- Không đổi DOM structure, class name, label, icon, toolbar ordering, responsive/mobile behavior hoặc editor styling.
- Không đổi danh sách extension, cấu hình extension, editor content lifecycle, paste rules hoặc `editorProps`.
- Giữ nguyên mọi named export hiện có của `@/lib/tiptap-utils` qua compatibility facade.
- Giữ nguyên giới hạn 5 MB, error message, progress callback, abort semantics và cleanup của upload.
- Không sửa các thay đổi dirty ngoài scope và không đụng vùng matching UI đã khóa.

## File dự kiến

Modify:

- `src/components/cms/shared/editor/tiptap-templates/simple/simple-editor.tsx`
- `src/lib/tiptap-utils.ts`
- `package.json` chỉ khi cần nối policy test vào gate hiện có.

Create:

- `src/components/cms/shared/editor/tiptap-templates/simple/simple-editor-types.ts`
- `src/components/cms/shared/editor/tiptap-templates/simple/simple-editor-extensions.ts`
- `src/components/cms/shared/editor/tiptap-templates/simple/erg-section-block.tsx`
- `src/components/cms/shared/editor/tiptap-templates/simple/image-text-block.tsx`
- `src/components/cms/shared/editor/tiptap-templates/simple/simple-editor-toolbar.tsx`
- `src/components/cms/shared/editor/tiptap-templates/simple/simple-editor-shell.tsx`
- `src/lib/tiptap-shortcut-utils.ts`
- `src/lib/tiptap-schema-utils.ts`
- `src/lib/tiptap-selection-utils.ts`
- `src/lib/tiptap-image-upload.ts`
- `src/lib/tiptap-url-utils.ts`
- `scripts/tiptap-simple-editor-split.policy.test.mjs`
- `scripts/tiptap-image-upload.test.mjs`
- `scripts/tiptap-url-utils.test.mjs`

File có thể được gộp/bỏ nếu characterization cho thấy module không có ownership độc lập; mọi thay đổi scope phải được phản ánh lại trong plan và workbook.

## Các bước thực thi

1. Characterize imports/exports, extension configuration, paste/content wiring, upload and URL edge cases; snapshot exact source fragments cần giữ.
2. Viết test đỏ chứng minh owner modules/policy chưa tồn tại và behavior contract hiện tại.
3. Extract theo cohesion: node views/extensions, toolbar, shell; chia utilities thành shortcut/schema/selection/upload/URL; giữ hai facade tương thích.
4. Chạy focused Node tests, Bun tests, lint/typecheck và so sánh exact invariant fragments.
5. Chạy `bun run verify:public-cms`, governance/drift/diff gates và build; xác nhận file facade dưới 250 dòng và owner modules reviewable.
6. Đồng bộ evidence/trạng thái cuối vào workbook, audit các task FE còn mở và render lại ba sheet quản trị.

## Commands và kết quả mong đợi

```powershell
bun test scripts/tiptap-*.test.mjs
bun run lint
bun run typecheck
bun run verify:public-cms
bun run governance:check
bun run repository-drift:check
bun run build
```

Mọi command phải exit 0; policy test phải xác nhận facade <250 dòng, owner files tồn tại và public exports không drift.

## Rollback

- Vì đây là extraction thuần, rollback theo từng file mới và phục hồi hai facade từ pre-task source; không reset toàn worktree.
- Không có migration, data mutation hoặc external state.

## Definition of Done

- Extension composition có regression evidence.
- Existing content và paste behavior còn nguyên wiring.
- Upload size/abort/progress/cleanup và URL sanitizer có test.
- Hai facade dưới 250 dòng; module owners có ranh giới rõ và không vòng phụ thuộc.
- Không đổi UI; full public CMS gates đạt.
- Workbook và plan tool khớp, formula scan/render đạt.

## Cố ý không làm

- Không redesign editor, đổi Tiptap extension behavior, thay package, đổi copy hoặc CSS.
- Không mass-update consumer imports khỏi compatibility facade.
- Không xử lý các file dirty ngoài ERG-065.
