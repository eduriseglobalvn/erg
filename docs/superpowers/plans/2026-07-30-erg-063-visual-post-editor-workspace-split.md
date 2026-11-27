# ERG-063 Visual Post Editor Workspace Split

> Status: completed — canonical task ERG-063 evidence is in `D:/ERG/TASK/ERG_Task_Management_.xlsx`.

**Goal:** Replace the 2,275-line Visual Post Editor god file with a public facade below 250 lines and cohesive owners for editor state, block commands/presets, library presentation, canvas, preview/settings/SEO, and selection inspectors without changing UI or behavior.

**Invariants:** Preserve all DOM order, Tailwind classes, Vietnamese copy, dynamic editor loading, Tiptap/BlockNote behavior, callbacks, content synchronization, save/publish behavior, preview output, and selection commands. Do not touch contracts, backend behavior, or operational portal code.

## Task 1 — Characterization and RED architecture policy

- [x] Record the 2,275-line baseline and component/function boundaries.
- [x] Add a policy test requiring the public facade below 250 lines and named cohesion owners.
- [x] Run RED before extraction.

## Task 2 — Extract pure data and command builders

- [x] Move public types and block-library catalog without changing values or icon mapping.
- [x] Move Tiptap/BlockNote course preset builders and insert commands behind typed helpers.

## Task 3 — Extract controller and presentation owners

- [x] Move editor engine/state, filtered blocks, preview model, and selection commands into a controller hook.
- [x] Extract header, block library, editor canvas, floating panel, preview/settings/SEO, and selection inspectors.
- [x] Keep the public workspace as a stable facade and the shell as thin composition.

## Task 4 — Verification and closeout

- [x] Run policy, lint, typecheck, security, build, repository drift, and diff checks.
- [x] Close ERG-063 with file/line evidence in the canonical workbook.
